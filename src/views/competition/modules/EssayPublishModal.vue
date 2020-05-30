<template>
  <a-modal title="操作" :width="600" v-model="visible" :confirmLoading="confirmLoading" @ok="handleSubmit">
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['essayId']"/>
      </a-form-item>
      <a-form-item label="文章类型">
        <a-input placeholder="文章类型" v-decorator="['essayType', {rules: [{required: true, message: '请输入文章类型'}]}]" />
      </a-form-item>
      <a-form-item label="文章标题">
        <a-input placeholder="文章标题" v-decorator="['essayTitle', {rules: [{required: true, message: '请输入文章标题'}]}]" />
      </a-form-item>
      <a-form-item label="文章内容">
        <!--<a-input placeholder="文章内容" v-decorator="['essayContent', {rules: [{required: true, message: '请输入文章内容'}]}]" />-->
        <tinymce :key="tinymceFlag" v-decorator="['essayContent', {initialValue:'', rules: [{required: true, message: '请输入文章内容'}]}]"></tinymce>
      </a-form-item>
    </a-form>
    <!-- 文章附件 -->
    <div>
      <a-divider style="font-size: 14px" orientation="left" dashed>
        文章附件
      </a-divider>
      <template v-for="(attachment, index) in attachmentList">
        <a-tooltip :key="attachment.fileId" :title="`附件大小：${attachment.fileSize}`">
          <a-tag class="tagStyle" :key="attachment.fileId" :closable="true" @close="attachmentList.splice(index, 1)">
            {{ attachment.fileName }}
          </a-tag>
        </a-tooltip>
      </template>
      <a-popover title="文件列表" trigger="click">
        <template slot="content">
          <a-list size="small" class="demo-loadmore-list listStyle" :loading="listLoading" item-layout="horizontal" :data-source="fileList">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <div slot="actions">{{ item.fileSize }}</div>
              <a slot="actions" @click="addAttachment(item)">添加</a>
              <div>{{ index }}：{{ item.fileName }}</div>
            </a-list-item>
          </a-list>
        </template>
        <a-tag style="background: #fff; borderStyle: dashed;" @click="loadFileList"><a-icon type="plus" /> 新附件</a-tag>
      </a-popover>
    </div>
  </a-modal>
</template>

<script>
import { saveEssayPublish, getEssayPublishDetail } from '@/api/publish'
import { getFileInfo, getFileList } from '@/api/system'
import Tinymce from '@/components/Editor/Tinymce'
import pick from 'lodash.pick'

export default {
  name: 'EssayPublishModal',
  components: {
    Tinymce
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      attachmentList: [], // 附件列表
      showFileList: false,
      fileList: [],
      listLoading: false,
      // tinymce
      value: '',
      tinymceFlag: 1
    }
  },
  methods: {
    // 创建附件结构体
    createAttachmentStruct (res) {
      return {
        fileId: res.fileId,
        fileSize: res.fileSize,
        fileName: res.fileName
      }
    },
    // 文件列表加载
    loadFileList () {
      getFileList().then(res => {
        if (res.code === 0) {
          this.fileList = res.rows
        } else {
          this.$message.error('获取文件列表失败')
        }
      }).catch(() => {
        this.$message.error('服务器失去连接，请稍后再试')
      })
    },
    // 添加附件
    addAttachment (file) {
      var attachment = this.createAttachmentStruct(file)
      this.attachmentList.push(attachment)
    },
    // 构建附件列表
    buildAttachmentData (fileIdSets) {
      this.attachmentList = []
      for (var fileId of fileIdSets.split(',')) {
        getFileInfo(fileId).then(res => {
          if (res.code === 500) {
            this.$message.error('文章附件信息取得失败，已忽略部分附件信息')
          } else {
            this.attachmentList.push(this.createAttachmentStruct(res))
          }
        }).catch(() => {
          this.$message.error('服务器失去连接，请稍后再试')
        })
      }
    },
    // 取得附件提交格式
    getAttachmentPost (attachmentList) {
      var attachmentPost = []
      for (var attachment of attachmentList) {
        var struct = { fileId: attachment.fileId }
        attachmentPost.push(struct)
      }
      return attachmentPost
    },
    add () {
      this.visible = true
      this.$nextTick(() => {
        this.attachmentList = []
        this.fileList = []
        this.form.resetFields()
        // 标记 新增时提交id=0
        this.form.setFieldsValue({ essayId: 0 })
      })
    },
    edit (essayId) {
      this.attachmentList = []
      this.fileList = []
      this.form.resetFields()
      // 取得文章内容
      getEssayPublishDetail(essayId).then(res => {
        if (res.code === 500) {
          this.$message.error('取得文章内容失败无法编辑，请稍后再试')
        } else {
          this.visible = true

          // 构建附件列表
          if (res.fileIds != null) {
            this.buildAttachmentData(res.fileIds)
          }
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(Object.assign(res), 'essayId', 'essayType', 'essayTitle', 'essayContent'))
          })
        }
      }).catch(() => {
        this.$message.error('服务器失去连接，请稍后再试')
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          // 保存文章
          saveEssayPublish(this.getAttachmentPost(this.attachmentList), values).then(res => {
            if (res.code === 0) {
              this.$message.success('保存成功')
              // 给父组件回传状态触发列表数据刷新
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.error(res.msg)
            }
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    }
  },
  activated () {
    this.tinymceFlag++
  }
}
</script>

<style scoped>
.listStyle {
  overflow-y: scroll;
  height: 200px
}

.tagStyle {
  margin-bottom: 4px;
}
</style>
