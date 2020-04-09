import { pureAxios, axios } from '@/utils/request'

const downloadUrl = [
  '/system/common/download',
  '/system/file'
]

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip',
  octetStream: 'application/octet-stream'
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
  document.body.appendChild(aLink)
}

// 上传文件下载
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
    // blob下载
    resolveBlob(res, mimeMap.octetStream)
  })
}
