<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
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
</template>

<script>
// 导入接口函数
import { getTestLibByTypeId } from '@/api/ques'

export default {
  data () {
    var pageData = {
      // 题目总数
      answersNumber: 0,
      // 已答题
      answersComplete: 0,
      // 页面描述
      description: '报考专业测评，请按自己的第一印象作答',
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
        0: '是',
        1: '否'
        // 2:"完全不符",
      }
    }

    return pageData
  },
  methods: {
    // 加载所有试题数据
    loadRoleAll (e) {
      getTestLibByTypeId(e).then(res => {
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
        }
      }
    }
  },
  created: function () {
    // 加载试题数据
    this.loadRoleAll(1)
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
