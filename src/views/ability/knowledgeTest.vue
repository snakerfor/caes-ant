<template>
  <div>
    <div v-if="firstPageShow">
      <!-- 测评首页 -->
      <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
        <a-row>
          <a-col :md="8">
            <head-info title="试题类型" content="能力测评" :bordered="true"/>
          </a-col>
          <a-col :md="8">
            <head-info title="试题数量" :content="String(answersNumber)" :bordered="true"/>
          </a-col>
          <a-col :md="8">
            <head-info title="预计用时" :content="answersNumber * 10 / 60 + '分钟'" :bordered="true"/>
          </a-col>
        </a-row>
      </a-card>
      <a-card title="答题注意事项" :bordered="false" style="width: 100%;margin-top:23px">
        <a-button type="primary" slot="extra" @click="startAnswer">开始测评</a-button>
        <ol>
          <li>事项1 事项1 事项1 事项1 事项1 事项1</li>
          <li>事项2 事项2 事项2 事项2 事项2 事项2</li>
          <li>事项3 事项2 事项2 事项2 事项2 事项2</li>
          <li>事项4 事项2 事项2 事项2 事项2 事项2</li>
          <li>事项5 事项2 事项2 事项2 事项2 事项2</li>
        </ol>
      </a-card>
    </div>

    <!-- 测评试题 -->
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false" v-if="testAnswerShow">
      <a-row>
        <a-col :lg="2">完成：{{ answersComplete }}/{{ answersNumber }}</a-col>
        <a-col :lg="22">
          <a-progress :percent="parseInt(answersComplete / answersNumber * 100)" :strokeWidth="12" />
        </a-col>
      </a-row>

      <a-divider dashed />

      <a-card style="width: 100%">
        <a-row>
          <a-col :md="12">{{ question }}</a-col>
          <a-col :md="12" class="answerMargin">
            <a-radio-group v-model="changeValue" @change="onChange">
              <a-radio v-for="(option, id) in answerOption" :value="id" :key="id">{{ option }}</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
      </a-card>
    </a-card>

    <!-- 答题完成模态框 -->
    <a-modal title="已完成" v-model="modalVisible">
      <template slot="footer">
        <a-button @click="gotoIndex">返回首页</a-button>
        <a-button type="primary" @click="gotoResult">查看测评结果</a-button>
      </template>
      <p><a-alert message="测评已完成" type="success" /></p>
      <p>选择回到测评首页或查看本次测评结果</p>
    </a-modal>
  </div>
</template>

<script>
// 导入接口函数
import { getTestLibByTypeId } from '@/api/ques'
// 引入业务组件
import headInfo from '@/components/tools/HeadInfo'

export default {
  components: {
    headInfo
  },
  data () {
    var pageData = {
      // ==页面显示控制==
      // 测评首页
      firstPageShow: false,
      // 测评试题
      testAnswerShow: false,
      // 答题完成模态框
      modalVisible: false,

      // 题目总数
      answersNumber: 0,
      // 已答题
      answersComplete: 0,
      // 页面描述
      description: '创新知识基础测试，请按自己的第一印象作答',
      // 单选值暂存
      changeValue: '',
      // 试题数据索引
      roleIndex: 0,
      // 试题数据源
      roleAll: [],
      // 试题题干
      question: '',
      // 答案选项
      answerOption: {
        0: '完全符合',
        1: '部分适合',
        2: '完全不符'
      }
    }

    return pageData
  },
  methods: {
    // 页面显示切换
    pageSwitch (pageName) {
      switch (pageName) {
        case 'firstPage' :
          this.firstPageShow = true
          this.testAnswerShow = false
          break
        case 'testAnswer' :
          this.firstPageShow = false
          this.testAnswerShow = true
          break
      }
    },
    // 开始答题
    startAnswer () {
      this.pageSwitch('testAnswer')
    },
    // 加载所有试题数据
    loadRoleAll (e) {
      getTestLibByTypeId(e).then(res => {
        console.log(res)
        this.roleAll = res.rows
        this.answersNumber = res.rows.length
        // 初次加载先显示试题
        this.newAnswer()
      })
    },
    // 加载新试题
    newAnswer () {
      if (this.roleIndex < this.answersNumber) {
        this.question = this.roleAll[this.roleIndex].testContent
        this.roleIndex = this.roleIndex + 1
      }
    },
    // 选中一个答案
    onChange () {
      if (this.answersComplete < this.answersNumber) {
        this.newAnswer()
        // 提交当前答案并清空选择项
        this.changeValue = ''
        // 增加已完成试题计数
        this.answersComplete += 1

        // 判断是否完成所有试题
        if (this.answersComplete === this.answersNumber) {
          alert('问卷填写完成')
          // 显示答题完成模态框
          this.modalVisible = true
        }
      }
    },
    // 查看测评结果
    gotoResult () {

    },
    // 返回测评首页
    gotoIndex () {

    }
  },
  created: function () {
    // 加载试题数据
    this.loadRoleAll(1)
    // 初始化页面显示
    this.pageSwitch('firstPage')
  }
}
</script>

<style scoped>
/* 视口<768，试题与答案并列存放，增加外边距使试题答案分开 */
@media only screen and (max-width: 768px) {
  .answerMargin {
    margin-top: 0.5em;
  }
}
</style>
