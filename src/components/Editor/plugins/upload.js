import { uploadFile } from '@/api/system'

// 添加附件 dialog
function showDialog (editor) {
  var dialogConfig = {
    title: '添加附件',
    body: {
      type: 'panel',
      items: [
        {
          type: 'input',
          name: 'fileName',
          label: '附件名：'
        },
        {
          type: 'input',
          name: 'urlFile',
          label: '从URL添加：'
        },
        {
          type: 'button',
          text: '或从本地上传',
          name: 'localFile'
        },
        {
          type: 'htmlpanel',
          html: '<input type="file" id="fileSelect" name="file" hidden /><div id="uploadStatus"></div><div id="fileId" style="display:none"></div>'
        }
      ]
    },
    buttons: [
      {
        type: 'cancel',
        name: 'closeButton',
        text: '关闭'
      },
      {
        type: 'submit',
        name: 'submitButton',
        text: '确认添加',
        primary: true
      }
    ],
    initialData: {
      fileName: '',
      urlFile: ''
    },
    // 提交按钮
    onSubmit: function (api) {
      var data = api.getData()
      var fileId = document.getElementById('fileId')
      if (data.fileName !== '') {
        if (data.urlFile !== '') {
          // 未经验证的url可能被执行js导致xss 后台正则过滤关键字
          editor.insertContent(`<p>附件：<a href="${data.urlFile}">${data.fileName}</a></p>`)
        } else if (fileId.innerText.length > 0) {
          /* 从本地上传由于token验证的原因需要传入fileId到downloadFile()下载 文章展示页需要mounted以下
          import { downloadFile } from '@/utils/download'
          window['downloadFile'] = (fileId) => {
            downloadFile(fileId)
          } */
          editor.insertContent(`<p>附件：<a href="#" onclick="downloadFile('${fileId.innerHTML}')">${data.fileName}</a></p>`)
        }
        // editor.execCommand('mceInsertContent', false, '<p>My ' + '\'s name is: <strong>' + data.catdata + '</strong></p>')
      }
      api.close()
    },
    onAction: (api, details) => {
      // var data = api.getData()
      // 点击了从本地上传按钮
      if (details.name === 'localFile') {
        var fileId = document.getElementById('fileId')
        var fileSelect = document.getElementById('fileSelect')
        var uploadStatus = document.getElementById('uploadStatus')
        fileSelect.click()
        fileSelect.onchange = function () {
          const file = this.files[0]
          uploadFile(file, (complete) => {
            // 实时上传进度
            uploadStatus.innerText = `显示上传完成之前不要关闭：${complete}%`
          }).then(res => {
            // 上传成功
            if (res.code === 0) {
              api.setData({ fileName: file.name })
              fileId.innerText = res.fileInfo.fileId
              uploadStatus.innerText = `${file.name} 上传完成`
              api.disable('urlFile')
            } else {
              uploadStatus.innerText = `${file.name} 上传失败：${res.fileInfo.saveStatus}`
            }
          }).catch(() => {
            uploadStatus.innerText = `与服务器断开连接`
          })
        }
      }
    }
  }
  editor.windowManager.open(dialogConfig)
  // editor.insertContent('<div style="height:40px;position:fixed;border-radius:10px;padding:10px;line-height:20px;border:1px dashed grey;background-color:#cccccc;font-size:13px;width:160px"><div style="width:20%;position:absolute;left:0;font-size:40px;padding-top:8px;">🖇</div><div style="width:80%;position:absolute;right:0"><div style="display:block;">文件名......</div><div style="display:block;">文件大小：1M</div></div></div>')
}

// tinymce 添加附件插件
const plugin = (editor) => {
  editor.ui.registry.addMenuItem('image', {
    icon: 'non-breaking',
    text: '附件...',
    onAction: function () {
      showDialog(editor)
    }
  })
  editor.ui.registry.addButton('file', {
    text: '添加附件',
    onAction: function () {
      showDialog(editor)
    }
  })
}

// eslint-disable-next-line no-undef
tinymce.PluginManager.add('uploader', plugin)
