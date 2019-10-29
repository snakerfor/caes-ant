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
        <a-col :lg="2">完成：{{ roleIndex - 1 }}/{{ answersNumber }}</a-col>
        <a-col :lg="22">
          <a-progress :percent="parseInt((roleIndex - 1) / answersNumber * 100)" :strokeWidth="12" />
        </a-col>
      </a-row>

      <a-divider dashed />

      <a-card style="width: 100%">
        <a-form @submit="handleSubmit" :form="form">
          <a-form-item style="margin-bottom:0">
            <a-row v-for="(ques, index) in roleAll" v-show="ques.quesOrder === roleIndex" :key="index">
              <a-col :md="15">
                <p style="margin-bottom:0">{{ ques.quesContent }}</p>
              </a-col>
              <a-col :md="9">
                <a-radio-group v-decorator="[ques.quesId]" @change="onChange">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-col>
            </a-row>
          </a-form-item>

          <a-form-item
            :colon="false"
            :label="sumbitTip"
            :labelCol="{ span: 10}"
            :wrapperCol="{ span: 14 }"
            style="text-align: center"
            v-show="sumbitVisible">
            <a-button htmlType="submit" type="primary">提交</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-card>

    <!-- 测评报告 -->
    <a-card :bordered="false" v-if="modalVisible">
      <!--<result type="success" :description="result" :title="title">
        <template slot="action">

          <radar :data="radarData" />
          <a-button type="primary" @click="backIndex">返回重新测评</a-button>
        </template>
      </result>-->
      <!-- 用户反馈 -->
      <div class="userReport">
        <span>对本次测评满意吗？请打个分吧！</span>
        <a-rate v-model="star" />
      </div>

      <a-divider><h1 style="color:#7f7f7f">测评报告</h1></a-divider>
      <a-row>
        <a-col :md="15">
          <detail-list title="职业兴趣特征">
            <detail-list-item term="评测得分">111</detail-list-item>
            <detail-list-item term="评价">111</detail-list-item>
            <detail-list-item term="人格特征">{{ holResult }}</detail-list-item>
            <detail-list-item term="人格倾向排序">{{ holSort }}</detail-list-item>
          </detail-list>
          <a-divider dashed />
          <detail-list title="专业相关">
            <detail-list-item term="专业倾向">{{ holType }}</detail-list-item>
            <detail-list-item term="推荐本校专业">{{ advMajors }}</detail-list-item>
            <detail-list-item term="就业方向">xxxxx</detail-list-item>
          </detail-list>
          <a-divider dashed />
        </a-col>
        <a-col :md="9">
          <radar :data="radarData" />
        </a-col>
      </a-row>
      <a-divider dashed />
      <a-button type="primary" @click="backIndex" style="float:right">返回重新测评</a-button>
    </a-card>
  </div>
</template>

<script>
// 导入接口函数
import { getTestLibByTypeId } from '@/api/ques'
import { saveMajorSumbit } from '@/api/caes'
// 引入业务组件
import { Result, Radar } from '@/components'
import headInfo from '@/components/tools/HeadInfo'
import DetailList from '@/components/tools/DetailList'
const DataSet = require('@antv/data-set')
const DetailListItem = DetailList.Item

export default {
  components: {
    headInfo,
    Radar,
    DetailList,
    DetailListItem,
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
      // 测评结果
      holResult: '',
      holSort: '',
      advMajors: '',
      holType: '',

      sumbitTip: '全部试题已经完成，确认提交吗？',
      // 雷达图数据
      radarData: '',

      // 用户评价
      star: 0
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
      this.roleIndex += 1
      if (this.roleIndex - 1 === this.answersNumber) {
        // 显示作答提交按钮
        this.pageSwitch('sumbitAnswer')
      }
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
          saveMajorSumbit(data).then(res => {
            if (res.code === 0) {
              // this.result = '根据霍兰德职业测评结果：' + res.data.holResult + ',推荐报考专业：' + res.data.advMajors
              this.holResult = res.data.holResult
              this.holSort = res.data.holSort
              this.advMajors = res.data.advMajors
              this.holType = this.holToChi(res.data.holResult)
              // 格式化数据并展示雷达图
              this.radarInit(res.data.holSort)
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
    },
    // 霍兰德类型匹配
    hollandType (c) {
      switch (c) {
        case 'I':
          return '研究型'
        case 'A':
          return '艺术型'
        case 'S':
          return '社会型'
        case 'E':
          return '企业型'
        case 'C':
          return '传统型'
        case 'R':
          return '现实型'
        default:
          return 'ERROR'
      }
    },
    // 霍兰德类型转换中文解释
    holToChi (holType) {
      var holArr = holType.split('')
      var resultStr = ''
      for (var hol of holArr) {
        resultStr += this.hollandType(hol) + '、'
      }
      return resultStr
    },
    // 雷达图初始化
    radarInit (dataText) {
      // 字符串数据转换为数组对象
      var formatData = new Array(6)

      var dataSet = dataText.split(',')
      // 去除最后一个空对象
      dataSet.pop()

      for (var i = 0; i < dataSet.length; i++) {
        var res = dataSet[i].split('=')
        var obj = {}

        obj.item = res[0] + '（' + this.hollandType(res[0]) + '）'
        obj.指标 = res[1]
        formatData[i] = obj
      }
      // 数据格式化
      const dv = new DataSet.View().source(formatData)
      dv.transform({
        type: 'fold',
        fields: ['指标'],
        key: 'user',
        value: 'score'
      })
      this.radarData = dv.rows
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

/* 用户反馈 */
.userReport {
  width: 100%;
  text-align: right;
  font-size: 13px;
}

@media only screen and (max-width: 576px) {
  .userReport span {
    display: block;
  }
}
</style>
