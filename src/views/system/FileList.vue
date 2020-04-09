<template>
  <div>
    <a-collapse defaultActiveKey="1" :bordered="false" style="position:relative">
      <div style="position:absolute;right:30px;top:8px;z-index:9999;">
        <a-upload
          name="file"
          :multiple="true"
          :withCredentials="true"
          :headers="uploadHeaders"
          :action="uploadUrl">
          <a-button type="primary"> <a-icon type="upload" /> 批量上传 </a-button>
        </a-upload>
      </div>
      <a-collapse-panel header="模糊文件搜索">
        <!-- 文件名及上传时间搜索 -->
        <div class="table-page-search-wrapper">
          <!-- form1 模糊搜索 -->
          <a-form :form="form2" layout="inline">
            <a-row :gutter="16">
              <a-col class="inputWrap" :md="6">
                <a-form-item label="文件名称">
                  <a-input placeholder="请输入文件名称" v-decorator="['fileName']" />
                </a-form-item>
              </a-col>
              <a-col class="inputWrap" :md="6">
                <a-form-item label="上传时间">
                  <a-date-picker v-decorator="['uploadTime']" format="YYYY-MM-DD" />
                </a-form-item>
              </a-col>
              <a-col :md="6"><!-- 不写满宽度 剩余宽度自适应 -->
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
      <a-table :columns="listColumns" :dataSource="listData" :loading="listIsLoading" :pagination="pagination">
        <span slot="control" slot-scope="data">
          <a @click="clickModify(data)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确认要删除这个文件？" @confirm="confirmDelete(data.fileId)" okText="删除" cancelText="取消">
            <a href="#">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="clickDownload(data.fileId)">下载</a>
        </span>

        <span slot="fileAuth" slot-scope="data">
          {{ (data.fileAuth) === '0' ? '禁止访问' : (data.fileAuth) === '1' ? '内部文件' : (data.fileAuth) === '2' ? '公开文件' : '未知' }}
        </span>
      </a-table>
    </a-card>

    <a-modal title="文件信息修改" :visible="modalVisible" @ok="modifySubmit" @cancel="modalCancel" :confirmLoading="modalConfirmLoading">
      <a-form :form="form">
        <a-form-item label="文件ID">
          <a-input v-decorator="['fileId']" disabled/>
        </a-form-item>

        <a-form-item label="文件权限">
          <!-- 三种权限 0禁止访问文件 1登录可下载 2无需登录下载 -->
          <a-select v-decorator="['fileAuth']" defaultValue="2" style="width: 120px">
            <a-select-option value="0">禁止访问</a-select-option>
            <a-select-option value="1">内部文件</a-select-option>
            <a-select-option value="2">公开文件</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
// 导入接口函数 uploadFile
import { getFileList, deleteFile, updateFileInfo } from '@/api/system'
import { downloadFile } from '@/utils/download'
import moment from 'moment'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  data () {
    var pageData = {
      uploadUrl: 'http://localhost:8000/api/system/file/upload',
      // 上传header 附加token
      uploadHeaders: {
        token: Vue.ls.get(ACCESS_TOKEN)
      },
      listColumns: [
        {
          title: '文件ID',
          dataIndex: 'fileId'
        },
        {
          title: '文件名',
          dataIndex: 'fileName'
        },
        {
          title: '文件大小',
          dataIndex: 'fileSize',
          width: 90
        },
        {
          title: '文件权限',
          scopedSlots: { customRender: 'fileAuth' },
          width: 90
        },
        {
          title: '上传时间',
          dataIndex: 'uploadTime',
          width: 90
        },
        {
          title: '下载次数',
          dataIndex: 'downloadCount',
          width: 90
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'control' },
          width: 150
        }
      ],
      // 文件列表数据
      listData: [],
      searchValue: [],
      listIsLoading: true,
      form: this.$form.createForm(this),
      form2: this.$form.createForm(this),
      // 分页 数据总量 每页条数 当前页数
      pagination: {
        total: 0,
        pageSize: 10,
        current: 1,
        onChange: this.paginationOnChange,
        showTotal: total => `文件总数：${total}`
      },
      // 信息修改模态框
      modalVisible: false,
      modalConfirmLoading: false,
      // 页面描述
      description: '文件上传及管理'
    }

    return pageData
  },
  methods: {
    moment,
    // 取得列表数据 搜索字串组 第几页 一页显示数量
    getListData (searchParam, pageNumParam, pageSizeParam) {
      this.listIsLoading = true
      getFileList(searchParam, pageNumParam, pageSizeParam).then(res => {
        if (res.code === 0) {
          this.pagination.total = res.total
          this.listData = res.rows
          this.listIsLoading = false
        } else {
          this.$message.error('取得文件列表失败，可能提交了错误的查询')
        }
      }).catch(() => {
        this.$message.error('系统错误，请稍后再试')
      })
    },
    paginationOnChange (pageNumber) {
      this.getListData(this.searchValue, pageNumber, this.pagination.pageSize)
      this.pagination.current = pageNumber
    },
    // 搜索
    getListSearchData (e) {
      e.preventDefault()
      this.form2.validateFields((err, values) => {
        if (!err) {
          // 格式化时间
          values.uploadTime = (typeof (values.uploadTime) !== 'undefined' && values.uploadTime !== null) ? this.moment(values.uploadTime).format('YYYY-MM-DD') : ''
          this.searchValue = values

          this.getListData(values, this.pagination.current, this.pagination.pageSize)
        }
      })
    },
    resetSearchForm () {
      // 清空表单
      this.form2.resetFields()
      // 清空提交参数searchValue
      this.searchValue = []
      this.getListData(this.searchValue, this.pagination.current, this.pagination.pageSize)
    },
    // 点击修改
    clickModify (data) {
      this.modalVisible = true
      // 异步 确保模态框及表单完全显示
      this.$nextTick(() => {
        // 表单设置初始值
        this.form.setFieldsValue({ 'fileId': data.fileId, 'fileAuth': data.fileAuth })
      })
    },
    modalCancel () {
      this.modalVisible = false
    },
    // 文件信息修改提交
    modifySubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // 提交按钮设置加载状态
          this.modalConfirmLoading = true
          updateFileInfo(values).then(res => {
            if (res.code === 0) {
              // 取消加载状态并隐藏模态框
              this.modalConfirmLoading = false
              this.modalVisible = false
              this.$message.success('文件信息修改成功')
              // 获取最新数据 附带search参数
              this.getListData(this.searchValue, this.pagination.current, this.pagination.pageSize)
            } else {
              this.$message.error('文件信息修改失败，检查信息有效性后重试')
              this.modalConfirmLoading = false
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
            this.modalConfirmLoading = false
          })
        }
      })
    },
    confirmDelete (fileId) {
      deleteFile(fileId).then(res => {
        if (res.code === 0) {
          this.$message.success('文件删除成功')
          this.getListData(this.searchValue, this.pagination.current, this.pagination.pageSize)
        } else {
          this.$message.error('文件删除失败，未知错误')
        }
      }).catch(() => {
        this.$message.error('系统错误，请稍后再试')
      })
    },
    clickDownload (fileId) {
      downloadFile(fileId)
    }
  },
  created: function () {
    this.getListData([], 1, this.pagination.pageSize)
  }
}
</script>

<style>
.inputWrap {
  min-width: 298px;
}
</style>
