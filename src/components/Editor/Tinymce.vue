<template>
  <div class="tinymce-editor">
    <Editor
      v-model="value"
      :init="init"
      :disabled="disabled"
      @onClick="onClick"
      @onChange="onChange">
    </Editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/code'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/link'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/template'
import './plugins/upload'

export default {
  name: 'Tinymce',
  components: {
    Editor
  },
  model: {
    // prop: 'value',
    event: 'change.value'
  },
  props: {
    // 传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 统一配置cdn前缀，如果不用cdn就把skins包整个复制到public/tinymce下
    cdnOrigin: {
      type: String,
      default: 'https://cdn.jsdelivr.net/npm/tinymce@5.2.0'
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media table wordcount code paste hr emoticons imagetools link fullscreen template uploader'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent hr | lists image media table code emoticons paste| removeformat code template link | file fullscreen'
    }
  },
  data () {
    return {
      // 初始化配置
      init: {
        language_url: 'https://cdn.jsdelivr.net/npm/tinymce-langs/langs/zh_CN.js', // 语言包的路径
        language: 'zh_CN', // 语言
        skin_url: `${this.cdnOrigin}/skins/ui/oxide`, // skin路径
        content_css: `${this.cdnOrigin}/skins/ui/oxide/content.css`,
        height: 300, // 编辑器高度
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false, // 是否禁用“Powered by TinyMCE”
        menubar: false, // 顶部菜单栏显示
        emoticons_database_url: `${this.cdnOrigin}/plugins/emoticons/js/emojis.js`,
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          success(img)
        },
        // a标签属性白名单 用于添加附件插件中的附件下载链接
        extended_valid_elements: 'a[href|onclick]'
      }
    }
  },
  mounted () {
    tinymce.init({})
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick (e) {
      this.$emit('onClick', e, tinymce)
    },
    // 实现数据反向绑定
    onChange: function (e) {
      // v-model绑定
      this.$emit('change.value', this.value)
      // console.log(this.value)
      // 触发change事件支持antd的表单绑定
      this.$emit('change', this.value)
      // this.$emit('input', this.value)
    }
  }
}

</script>
