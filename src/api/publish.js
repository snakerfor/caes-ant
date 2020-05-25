import { axios } from '@/utils/request'

const api = {
  essayPublish: '/system/publish'
}

// 文章详情
export function getEssayPublishDetail (essayId) {
  return axios({
    url: api.essayPublish + '/get/' + essayId,
    method: 'get'
  })
}

export function getEssayPublishList (parameter) {
  return axios({
    url: api.essayPublish + '/list',
    method: 'get',
    params: parameter
  })
}

// 文章保存/修改
export function saveEssayPublish (attachment, publish) {
  return axios({
    url: api.essayPublish + (publish.essayId === 0 ? '/save' : '/update'),
    method: 'post',
    data: {
      // 附件及文章信息
      // attachment=[{fileId:xxx},{fileId:xxx}]
      attachment: attachment,
      publish: publish
    },
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delEssayPublish (essayId) {
  return axios({
    url: api.essayPublish + '/remove',
    method: 'post',
    params: {
      essayId: essayId
    }
  })
}

export const essayPublishExport = api.essayPublish + '/export'
