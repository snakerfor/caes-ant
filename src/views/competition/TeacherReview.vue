<template>
  <div>
    <a-collapse defaultActiveKey="1" :bordered="false">
      <a-collapse-panel header="模糊搜索">
        <div class="table-page-search-wrapper">
          <!-- form1 模糊搜索 -->
          <a-form :form="form" layout="inline">
            <a-row :gutter="16">
              <a-col class="inputWrap" :md="2">
                <a-form-item label="作品名称">
                  <a-input placeholder="请输入作品名称" v-decorator="['name']" />
                </a-form-item>
              </a-col>
              <a-col class="inputWrap" :md="2">
                <a-form-item label="作品领域">
                  <a-input placeholder="请输入作品领域" v-decorator="['domain']" />
                </a-form-item>
              </a-col>
              <a-col class="inputWrap" :md="2">
                <a-form-item label="作品负责人">
                  <a-input placeholder="请输入作品负责人" v-decorator="['leader']" />
                </a-form-item>
              </a-col>
              <a-col class="inputWrap" :md="2">
                <a-form-item label="作品团队">
                  <a-input placeholder="请输入作品团队" v-decorator="['team']" />
                </a-form-item>
              </a-col>
              <a-col class="inputWrap" :md="2">
                <a-form-item label="创建人">
                  <a-input placeholder="请输入创建人" v-decorator="['createUser']" />
                </a-form-item>
              </a-col>
              <a-col class="inputWrap" :md="3">
                <a-form-item label="修改人(审核者)">
                  <a-input placeholder="请输入修改人" v-decorator="['editUser']" />
                </a-form-item>
              </a-col>
              <a-col class="inputWrap" :md="3">
                <a-form-item label="作品层级">
                  <a-select placeholder="请选择" v-decorator="['prodLevel']">
                    <a-select-option :value="'\u0000'">请选择</a-select-option>
                    <a-select-option :value="'0'">放弃</a-select-option>
                    <a-select-option :value="'1'">通过</a-select-option>
                    <a-select-option :value="'2'">优秀</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8">
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" @click="getListSearchData">查询</a-button>
                  <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-collapse-panel>
    </a-collapse>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-table
        rowKey="productionId"
        :columns="listColumns"
        :dataSource="listData"
        :loading="listIsLoading"
        :pagination="false"
        :scroll="{ x: 1500, y: 300 }">
        <!-- 作品层级列表自定义渲染 -->
        <span slot="prodLevelCustom" slot-scope="prodLevelData, record, index">
          <a-tag @click="showReviewModel(record, index)" :color="prodLevelData === '0' ? 'orange' : (prodLevelData === '1' ? 'geekblue' : (prodLevelData === '2' ? 'green' : 'red'))">
            {{ prodLevelData === '0' ? '放弃' : (prodLevelData === '1' ? '通过' : (prodLevelData === '2' ? '优秀' : '未审批')) }}
          </a-tag>
        </span>

        <!-- 各种详细描述 完整文字以ToolTip显示 -->
        <span slot="descCustom" slot-scope="descData">
          <a-tooltip><template slot="title">{{ descData }}</template><a class="longTextWrap">{{ descData }}</a></a-tooltip>
        </span>
        <span slot="teamDescCustom" slot-scope="teamDescData">
          <a-tooltip><template slot="title">{{ teamDescData }}</template><a class="longTextWrap">{{ teamDescData }}</a></a-tooltip>
        </span>
        <span slot="currentDescCustom" slot-scope="currentDescData">
          <a-tooltip><template slot="title">{{ currentDescData }}</template><a class="longTextWrap">{{ currentDescData }}</a></a-tooltip>
        </span>
        <span slot="futureDescCustom" slot-scope="futureDescData">
          <a-tooltip><template slot="title">{{ futureDescData }}</template><a class="longTextWrap">{{ futureDescData }}</a></a-tooltip>
        </span>
        <span slot="prodEvaluateCustom" slot-scope="prodEvaluateData">
          <a-tooltip><template slot="title">{{ prodEvaluateData }}</template><a class="longTextWrap">{{ prodEvaluateData }}</a></a-tooltip>
        </span>
      </a-table>
      <!-- 分页 -->
      <div class="paginationStyle">
        <div>
          <a-pagination :defaultCurrent="1" :total="paginationTotal" :pageSize="paginationPageSize" @change="paginationOnChange" />
        </div>
        &nbsp;
        <div>共{{ paginationTotal }}条</div>
      </div>
    </a-card>

    <!-- 作品审批模态框 -->
    <a-modal :title="'作品审批：' + reviewModelTitle" :visible="reviewModelVisible" :confirmLoading="reviewModelConfirmLoading" @ok="reviewSubmit" @cancel="reviewModelHandleCancel">
      <a-card class="dataCard" title="作品信息">
        <p>作品名称：{{ reviewModelData.name }}</p>
        <p>作品领域：{{ reviewModelData.domain }}</p>
        <p>作品介绍：{{ reviewModelData.desc }}</p>
        <p>作品负责人：{{ reviewModelData.leader }}</p>
        <p>作品团队：{{ reviewModelData.team }}</p>
        <p>团队描述：{{ reviewModelData.teamDesc }}</p>
        <p>目前阶段描述：{{ reviewModelData.currentDesc }}</p>
        <p>未来达成描述：{{ reviewModelData.futureDesc }}</p>
      </a-card>
      <!-- form2 作品评价表单 -->
      <a-form :form="form2">
        <a-form-item v-show="false">
          <a-input v-decorator="['productionId']" />
        </a-form-item>

        <a-form-item label="作品评价">
          <a-textarea v-decorator="['prodEvaluate']" placeholder="请输入作品评价" :rows="2" />
        </a-form-item>

        <a-form-item label="作品层级">
          <a-select placeholder="请选择" v-decorator="['prodLevel']">
            <a-select-option :value="'\u0000'">请选择</a-select-option>
            <a-select-option :value="'0'">放弃</a-select-option>
            <a-select-option :value="'1'">通过</a-select-option>
            <a-select-option :value="'2'">优秀</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
// 导入接口函数
import { getCompetitionSumbitList, competitionReviewSumbit } from '@/api/competition'

export default {
  data () {
    var pageData = {
      listColumns: [
        {
          title: '作品名称',
          dataIndex: 'name',
          fixed: 'left',
          width: 130
        },
        {
          title: '作品领域',
          dataIndex: 'domain',
          width: 130
        },
        {
          title: '作品介绍',
          dataIndex: 'desc',
          scopedSlots: { customRender: 'descCustom' },
          width: 130
        },
        {
          title: '作品负责人',
          dataIndex: 'leader',
          width: 130
        },
        {
          title: '作品团队',
          dataIndex: 'team',
          width: 130
        },
        {
          title: '团队描述',
          dataIndex: 'teamDesc',
          scopedSlots: { customRender: 'teamDescCustom' },
          width: 130
        },
        {
          title: '目前阶段描述',
          dataIndex: 'currentDesc',
          scopedSlots: { customRender: 'currentDescCustom' },
          width: 130
        },
        {
          title: '未来达成描述',
          dataIndex: 'futureDesc',
          scopedSlots: { customRender: 'futureDescCustom' },
          width: 130
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 130
        },
        {
          title: '创建人',
          dataIndex: 'createUser',
          width: 130
        },
        {
          title: '修改时间',
          dataIndex: 'editTime',
          width: 130
        },
        {
          title: '修改人',
          dataIndex: 'editUser',
          width: 130
        },
        {
          title: '作品层级',
          dataIndex: 'prodLevel',
          scopedSlots: { customRender: 'prodLevelCustom' },
          fixed: 'right',
          width: 100
        },
        {
          title: '作品评价',
          dataIndex: 'prodEvaluate',
          scopedSlots: { customRender: 'prodEvaluateCustom' },
          fixed: 'right',
          width: 130
        }],

      listData: [],
      listIsLoading: true,
      searchValue: [],
      // 分页 数据总量 每页条数 当前页数
      paginationTotal: 0,
      paginationPageSize: 10,
      paginationPageNumber: 1,
      // 页面描述
      description: '教师审批学生参赛作品，并给予客观评价',
      form: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      // reviewModel
      reviewModelData: [],
      reviewModelTitle: 0,
      reviewModelVisible: false,
      reviewModelConfirmLoading: false
    }
    return pageData
  },
  methods: {
    // 取得列表数据 搜索字串组 第几页 一页显示数量
    getListData (searchParam, pageNumParam, pageSizeParam) {
      this.listIsLoading = true
      getCompetitionSumbitList(searchParam, pageNumParam, pageSizeParam).then(res => {
        if (res.code === 0) {
          this.paginationTotal = res.total
          this.listData = res.rows
          this.listIsLoading = false
        } else {
          this.$message.error('取得大赛项目审批列表失败，可能提交了错误的查询')
        }
      }).catch(() => {
        this.$message.error('系统错误，请稍后再试')
      })
    },
    // 分页选择切换
    paginationOnChange (pageNumber) {
      this.getListData(this.searchValue, pageNumber, this.paginationPageSize)
      // 当前页数允许全局访问
      this.paginationPageNumber = pageNumber
    },
    // 审核信息提交 form2
    reviewSubmit (e) {
      e.preventDefault()
      this.form2.validateFields((err, values) => {
        if (!err) {
          // 提交按钮设置加载状态
          this.reviewModelConfirmLoading = true
          competitionReviewSumbit(values).then(res => {
            if (res.code === 0) {
              // 取消加载状态并隐藏模态框
              this.reviewModelConfirmLoading = false
              this.reviewModelVisible = false
              this.$message.success('作品评级提交成功')
              // 获取最新数据 附带search参数
              this.getListData(this.searchValue, this.paginationPageNumber, this.paginationPageSize)
            } else {
              this.$message.error('作品评级提交失败，检查信息有效性后重试')
              this.reviewModelConfirmLoading = false
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
            this.reviewModelConfirmLoading = false
          })
        }
      })
    },
    // 显示作品审核模态框
    showReviewModel (record, index) {
      this.reviewModelTitle = record.productionId + '[' + index + ']'
      this.reviewModelData = record
      this.reviewModelVisible = true
      // 异步 确保模态框及表单完全显示
      this.$nextTick(() => {
        // 为form2表单元素设置初始值 坑：千万不用v-decorator 无法在第三次打开表单后正确更新真实的value(打开顺序121) 虽然表面上显示的是用v-decorator设置的值 实际validateFields获取的是第二次填写表单输入的值
        this.form2.setFieldsValue({ 'productionId': record.productionId, 'prodEvaluate': record.prodEvaluate, 'prodLevel': record.prodLevel })
      })
    },
    reviewModelHandleCancel () {
      this.reviewModelVisible = false
    },
    // 取得列表数据 附带搜索参数
    getListSearchData (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log(values)
          // 搜索参数允许外部访问
          this.searchValue = values
          this.getListData(values, this.paginationPageNumber, this.paginationPageSize)
        }
      })
    },
    // 重置模糊搜索表单
    resetSearchForm () {
      // 清空表单
      this.form.resetFields()
      // 清空提交参数searchValue
      this.searchValue = []
      this.getListData(this.searchValue, this.paginationPageNumber, this.paginationPageSize)
    }
  },
  created: function () {
    this.getListData([], 1, this.paginationPageSize)
  }
}
</script>

<style>
.inputWrap {
  min-width: 230px;
}

.longTextWrap {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 70px;
  text-align: center;
}

.paginationStyle {
  float: right;
  display: flex;
  margin-top: 10px;
}

.paginationStyle div {
  box-sizing: border-box;
  line-height: 30px;
}

.dataCard p {
  margin-bottom: 0px;
}

.dataCard .ant-card-head-title {
  padding:8px 0;
  font-size:14px;
}

.dataCard .ant-card-head {
  min-height: 20px;
}
</style>
