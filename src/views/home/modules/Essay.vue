<template>
  <div>
    <a-card v-if="essayShow" class="essay">
      <div class="title">
        <h1>{{ essayData.essayTitle }}</h1>
        <div class="timeAndAuthor">
          <span>时间：{{ essayData.createTime }}</span>
          <span>作者：{{ essayData.createBy }}</span>
          <span>阅读量：{{ essayData.viewCount }}</span>
        </div>
      </div>
      <a-divider />
      <div v-html="essayData.essayContent"></div>
      <div style="margin: 20px 0 3px 0" v-if="attachmentList !== []">附件：</div>
      <div class="attachment" v-for="item in attachmentList" :key="item.fileId">
        <a href="#" @click="download(item.fileId)"><a-icon type="file" /> {{ item.fileName }}（{{ item.fileSize }}）</a>
      </div>
    </a-card>
    <a-card v-if="errorShow">
      <a-result status="500" title="Error 500" sub-title="服务器内部错误，文章丢失了 : ("></a-result>
    </a-card>
  </div>
</template>

<script>
// 文章详情组件
// TODO:1. 拆分出index.vue中的内容部分做为首页组件1，剩余的作为页面主框架
//      2. 完成essay.vue作为文章内容组件2
//      3. index.vue中引入页面主框架，及首页组件1作为/index页
//      4. 另起一个essayDetail.vue页面引入页面主框架，及文章内容组件作为文章详情页，由/index页跳转c传进来的essayId参数查询显示对应文章

import { getEssayPublishDetail } from '@/api/publish'
import { getFileInfo } from '@/api/system'
import { downloadFile } from '@/utils/download'

export default {
  data () {
    return {
      essayShow: false,
      errorShow: false,
      essayData: {},
      attachmentList: []
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
          this.$message.error('服务器失去连接，取得附件信息失败请稍后再试')
        })
      }
    },
    showPage (loadStatus) {
      this.essayShow = (loadStatus === 'success')
      this.errorShow = (loadStatus === 'error')
    },
    // 父组件会调用loadEssay()显示文章
    loadEssay (essayId) {
      getEssayPublishDetail(essayId).then(res => {
        if (res.code !== 500) {
          this.showPage('success')
          this.essayData = res
          this.buildAttachmentData(res.fileIds)
        } else {
          this.showPage('error')
        }
      }).catch(() => {
        this.showPage('error')
      })
    },
    download (fileId) {
      downloadFile(fileId)
    }
  },
  mounted () {
    this.loadEssay(1)
  }
}
</script>

<style scoped>
.essay {
  font-family: "微软雅黑";
  padding: 40px;
}

.essay .title {
  position: relative;
}

.essay .title h1 {
  font-size: 30px;
  text-align: center;
}

.essay .title .timeAndAuthor {
  font-size: 16px;
  font-weight: normal;
  color: #999999;
  line-height: 30px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.essay .title .timeAndAuthor span:first-child {
  margin-right: 30px;
}

.essay .title .timeAndAuthor span:last-child {
  position: absolute;
  right: 0;
  visibility: hidden;
}

@media only screen and (min-width: 769px) {
  .essay .title .timeAndAuthor span:last-child {
    visibility: visible;
  }
}

.essay .attachment a {
  color: steelblue;
}
</style>
