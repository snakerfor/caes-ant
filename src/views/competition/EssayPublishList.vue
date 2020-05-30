<template>
  <div>
    <a-collapse defaultActiveKey="1" :bordered="false" style="position:relative">
      <a-collapse-panel header="文章搜索">
        <div class="table-page-search-wrapper">
          <a-form :form="form" layout="inline">
            <a-row :gutter="16">
              <a-col class="inputWrap" :md="6">
                <a-form-item label="文章标题">
                  <a-input placeholder="请输入文章标题" v-decorator="['essayTitle']" />
                </a-form-item>
              </a-col>
              <a-col class="inputWrap" :md="6">
                <a-form-item label="文章内容">
                  <a-input placeholder="请输入文章内容" v-decorator="['essayContent']" />
                </a-form-item>
              </a-col>
              <a-col :md="6"><!-- 不写满宽度 剩余宽度自适应 -->
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" @click="getListSearchData">查询</a-button>
                  <a-button style="margin-left: 8px" @click="resetSearch">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-collapse-panel>
    </a-collapse>

    <a-card :bordered="false">
      <div class="table-operator">
        <a-button type="primary" icon="plus" @click="handleAdd()">新建</a-button>
      </div>

      <s-table ref="table" rowKey="essayId" :columns="columns" :data="loadData" defaultSort="createTime">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="delById(record.essayId)">删除</a>
        </span>
      </s-table>
      <essayPublish-modal ref="modal" @ok="handleOk"/>
    </a-card>
  </div>
</template>

<script>
import { STable } from '@/components'
import { getEssayPublishList, delEssayPublish } from '@/api/publish'
import EssayPublishModal from './modules/EssayPublishModal.vue'

export default {
  name: 'TableList',
  components: {
    STable,
    EssayPublishModal
  },
  data () {
    return {
      form: this.$form.createForm(this),
      // 文章编辑模态框相关属性
      editModal: {
        title: '',
        visible: false,
        loading: false
      },
      // 表头
      columns: [
        {
          title: '文章id',
          dataIndex: 'essayId',
          width: 50
        },
        {
          title: '文章栏目',
          dataIndex: 'essayType',
          width: 90
        },
        {
          title: '文章标题',
          dataIndex: 'essayTitle',
          ellipsis: true,
          width: 180
        },
        {
          title: '文章内容',
          dataIndex: 'essayContent',
          ellipsis: true
        },
        {
          title: '创建者',
          dataIndex: 'createBy',
          width: 80
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          width: 110
        },
        {
          title: '更新者',
          dataIndex: 'updateBy',
          width: 80
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          sorter: true,
          width: 110
        },
        {
          title: '浏览量',
          dataIndex: 'viewCount',
          width: 50
        },
        {
          title: '操作',
          width: 110,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 搜索参数
      queryParam: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getEssayPublishList(Object.assign(parameter, this.queryParam))
      }
    }
  },
  methods: {
    getListSearchData (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.queryParam = values
          this.handleOk()
        }
      })
    },
    resetSearch () {
      this.form.resetFields()
      this.queryParam = []
      this.handleOk()
    },
    handleAdd () {
      this.$refs.modal.add()
    },
    handleEdit (record) {
      this.$refs.modal.edit(record.essayId)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delById (id) {
      delEssayPublish(id).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
