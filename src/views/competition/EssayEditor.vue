<template>
  <a-card
    :body-style="{padding: '24px 32px'}"
    :bordered="false">
    <tinymce :key="tinymceFlag" v-model="value"></tinymce>
    {{ value }}
    <div v-html="value"></div>
    <div v-html="testLink"></div>
  </a-card>
</template>

<script>
import { downloadFile } from '@/utils/download'
import Tinymce from '@/components/Editor/Tinymce'
export default {
  components: {
    Tinymce
  },
  data () {
    return {
      description: '文章编辑与发布管理',
      value: '',
      tinymceFlag: 1,
      downloadFile: downloadFile,
      testLink: '<p>测试附件下载：<a href="#" onclick="downloadFile(\'e12ac315195e4f0d92ac783c8e49120e\')">LinZhaoguan-paste-upload-master.zip</a></p>'
    }
  },
  mounted () {
    // 绑定downloadFile函数到全局 用于解析富文本组件生成的html中的附件下载链接
    window['downloadFile'] = (fileId) => {
      downloadFile(fileId)
    }
  },
  activated () {
    this.tinymceFlag++
  }
}
</script>
