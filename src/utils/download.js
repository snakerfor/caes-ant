import { pureAxios, axios } from '@/utils/request'
import { notification } from 'ant-design-vue'

const downloadUrl = [
  '/system/common/download',
  '/system/file'
]

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip',
<<<<<<< HEAD
  xml: 'application/xml'
=======
  octetStream: 'application/octet-stream'
>>>>>>> 6e6e46d2dd3419e40663e5dfd8e0bf52a2b2e5cd
}

export function exportExcel (url, params) {
  axios({
    url: url,
    method: 'post',
    params: params
  }).then(res => {
    if (res.code === 0) {
      downloadXlsx(res.msg)
    }
  })
}

/**
 * 下载.xlsx文件
 * @param {String} filename 文件名
 */
export function downloadXlsx (filename) {
  pureAxios({
    url: downloadUrl[0],
    method: 'get',
    params: { fileName: filename, delete: true },
    responseType: 'blob'
  }).then(res => {
    resolveBlob(res, mimeMap.xlsx)
  })
}

/**
 * 代码生成并下载为zip
 * @param {String} url 链接
 * @param {String} tables 表名
 */
export function genCodeZip (url, tables) {
  pureAxios({
    url: url,
    method: 'get',
    params: { tables: tables },
    responseType: 'blob'
  }).then(res => {
    resolveBlob(res, mimeMap.zip)
  })
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob (res, mimeType) {
  const aLink = document.createElement('a')
  var blob = new Blob([res.data], { type: mimeType })
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  var contentDisposition = decodeURI(res.headers['content-disposition'])
  var result = patt.exec(contentDisposition)
  var fileName = result[1]
  aLink.href = URL.createObjectURL(blob)
  // 文件名过滤掉双引号并设置下载文件名
  aLink.setAttribute('download', fileName.replace(/"/g, '')) // 设置下载文件名称
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
  window.URL.revokeObjectURL(aLink.href)
}

/**
 * 私有函数 解析blob响应内容为Json
 * @param {*} blob blob响应内容
 * @returns {*} promise对象
 */
function blob2Json (blob) {
  var promise = new Promise(function (resolve, reject) {
    var reader = new FileReader()
    reader.onload = (e) => resolve(JSON.parse(e.target.result))
    reader.readAsText(blob)
  })
  return promise
}

/**
 * 通用文件下载
 * @param {*} fileId 文件id
 */
export function downloadFile (fileId) {
  var parameter = {
    fileId: fileId
  }
  return pureAxios({
    url: downloadUrl[1] + '/download',
    method: 'get',
    params: parameter,
    responseType: 'blob'
  }).then(res => {
    if (res.data.type === 'application/json') {
      blob2Json(res.data).then(function (value) {
        notification.error({
          message: `下载出错：${value.code} `,
          description: value.msg
        })
      })
    } else {
      // blob下载
      resolveBlob(res, mimeMap.octetStream)
    }
  })
}
