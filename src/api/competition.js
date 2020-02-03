import { axios } from '@/utils/request'

const api = {
  competitionAPI: '/system/competitionSubmit'
}

// 参赛作品申报表单提交
export function competitionSumbit (parameter) {
  return axios({
    url: api.competitionAPI + '/save',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
