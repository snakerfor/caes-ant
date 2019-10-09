<template>
  <div>
    <div v-if="firstPageShow">
      <!-- 测评首页 -->
      <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
        <a-row>
          <a-col :md="8">
            <head-info title="试题类型" content="能力测评" :bordered="true" />
          </a-col>
          <a-col :md="8">
            <head-info title="试题数量" :content="String(answersNumber)" :bordered="true" />
          </a-col>
          <a-col :md="8">
            <head-info title="预计用时" :content="parseInt(answersNumber * 10 / 60) + '分钟'" :bordered="true" />
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
        <a-col :lg="2">完成：{{ roleIndex }}/{{ answersNumber }}</a-col>
        <a-col :lg="22">
          <a-progress :percent="parseInt(roleIndex / answersNumber * 100)" :strokeWidth="12" />
        </a-col>
      </a-row>

      <a-divider dashed />

      <a-card style="width: 100%">
        <a-form @submit="handleSubmit" :form="form">
          <a-form-item
            v-for="(ques,index) in roleAll"
            v-show="ques.quesOrder === roleIndex"
            :label="ques.quesContent"
            :key="index"
            :labelCol="{lg: {span: 10}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 7}, sm: {span: 17} }"
            :colon="false"
          >
            <a-radio-group v-decorator="[ques.quesId]" @change="onChange">
              <a-radio :value="1">是</a-radio>
              <a-radio :value="0">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            :colon="false"
            :label="sumbitTip"
            :labelCol="{ span: 18}"
            :wrapperCol="{ span: 6 }"
            style="text-align: center"
            v-show="sumbitVisible"
          >
            <a-button htmlType="submit" type="primary">提交</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-card>

    <a-card :body-style="{padding: '24px 32px'}" :bordered="false" v-if="false">
      <a-row>
        <a-col :lg="18">全部试题已经完成，确认提交吗？</a-col>
        <a-col :lg="6" style="text-align: center">
          <a-button type="primary" @click="handleSubmit">提交作答</a-button>
        </a-col>
      </a-row>
    </a-card>

    <a-card :bordered="false" style="margin: -24px -24px 0px;" v-if="modalVisible">
      <result type="success" :description="result" :title="title">
        <template slot="action">
          <a-button type="primary" @click="backIndex">返回重新测评</a-button>
        </template>
      </result>
    </a-card>
  </div>
</template>

<script>
// 导入接口函数
import { getTestLibByTypeId } from '@/api/ques'
import { saveTestSumbit } from '@/api/caes'
import { Result } from '@/components'
// 引入业务组件
import headInfo from '@/components/tools/HeadInfo'

export default {
  components: {
    headInfo,
    Result
  },
  data () {
    var pageData = {
      // ==页面显示控制==
      // 测评首页
      firstPageShow: false,
      // 测评试题
      testAnswerShow: false,
      // 显示提交按钮
      sumbitVisible: false,
      // 答题完成模态框
      modalVisible: false,

      // 题目总数
      answersNumber: 0,
      // 页面描述
      description: '报考专业测评，请按自己的第一印象作答',
      // 试题数据索引
      roleIndex: 1,
      // 试题数据源
      roleAll: [],
      // 试题题干
      question: '',
      form: this.$form.createForm(this),
      // 测结果
      result: '',
      title: '提交成功',
      sumbitTip: '全部试题已经完成，确认提交吗？'
    }

    return pageData
  },
  mounted () {
    window.vue = this
  },
  methods: {
    // 页面显示切换
    pageSwitch  (pageName) {
      switch (pageName) {
        case 'firstPage':
          this.firstPageShow = true
          this.testAnswerShow = false
          this.sumbitVisible = false
          this.modalVisible = false
          break
        case 'testAnswer':
          this.firstPageShow = false
          this.testAnswerShow = true
          this.sumbitVisible = false
          this.modalVisible = false
          break
        case 'sumbitAnswer':
          this.firstPageShow = false
          this.testAnswerShow = true
          this.sumbitVisible = true
          this.modalVisible = false
          break
        case 'resultShow':
          this.firstPageShow = false
          this.testAnswerShow = false
          this.sumbitVisible = false
          this.modalVisible = true
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
      })
    },
    // 选中一个答案
    onChange () {
      if (this.roleIndex === this.answersNumber) {
        // 显示作答提交按钮
        this.pageSwitch('sumbitAnswer')
      }
      this.roleIndex += 1
    },
    // 提交作答
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const data = []
          for (var i in values) {
            const sing = {}
            sing.quesId = i
            sing.answer = values[i]
            data.push(sing)
          }
          this.confirmLoading = true
          saveTestSumbit(data).then(res => {
            if (res.code === 0) {
              this.result = '推荐报考专业：' + res.data
              this.pageSwitch('resultShow')
            } else {
              this.$message.success(res.msg)
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    backIndex () {
      this.roleIndex = 1
      this.pageSwitch('firstPage')
    }
  },
  created: function () {
    // 加载试题数据
    this.loadRoleAll(2)
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
