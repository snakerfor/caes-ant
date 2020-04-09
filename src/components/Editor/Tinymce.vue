<template>
  <div class="tinymce-editor">
    <Editor
      v-model="myValue"
      :init="init"
      :disabled="disabled"
      @onClick="onClick">
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

export default {
  name: 'Tinymce',
  components: {
    Editor
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
    plugins: {
      type: [String, Array],
      default: 'lists image media table textcolor wordcount contextmenu code paste hr emoticons imagetools link fullscreen template'
    },
    toolbar: {
      type: [String, Array],
      default: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify  | bullist numlist outdent indent hr | lists image media table code emoticons paste| removeformat code template link | file fullscreen'
    }
  },
  data () {
    return {
      // 初始化配置
      init: {
        language_url: '/tinymce/langs/zh_CN.js', // 语言包的路径
        language: 'zh_CN', // 语言
        skin_url: '/tinymce/skins/ui/oxide', // skin路径
        height: 300, // 编辑器高度
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false, // 是否禁用“Powered by TinyMCE”
        menubar: true, // 顶部菜单栏显示
        emoticons_database_url: 'https://cdn.jsdelivr.net/npm/tinymce@5.2.0/plugins/emoticons/js/emojis.js',
        // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_handler: (blobInfo, success, failure) => {
          const img = 'data:image/jpeg;base64,' + blobInfo.base64()
          success(img)
        },
        // 添加附件按钮
        setup: function (editor) {
          editor.ui.registry.addButton('file', {
            text: '添加附件',
            onAction: function (_) {
              editor.insertContent('<div style="height:40px;position:fixed;border-radius:10px;padding:10px;line-height:20px;border:1px dashed grey;background-color:#cccccc;font-size:13px;width:160px"><div style="width:20%;position:absolute;left:0;font-size:40px;padding-top:8px;">🖇</div><div style="width:80%;position:absolute;right:0"><div style="display:block;">文件名......</div><div style="display:block;">文件大小：1M</div></div></div>')
            }
          })
        }
      },
      myValue: this.value
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
    // 可以添加一些自己的自定义事件，如清空内容
    clear () {
      this.myValue = ''
    }
  },
  watch: {
    value (newValue) {
      this.myValue = newValue
    },
    myValue (newValue) {
      this.$emit('input', newValue)
    }
  }
}

</script>
