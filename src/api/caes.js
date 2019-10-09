import { axios } from '@/utils/request'

const api = {
  testSumbit: '/system/sumbit'
}

export function getTestSumbitList (parameter) {
  return axios({
    url: api.testSumbit + '/list',
    method: 'get',
    params: parameter
  })
}

/* export function saveTestSumbit (parameter) {
  return axios({
    url: api.testSumbit+(parameter.sumbitId > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
} */
// 保存试题作答(专业报考测评)
export function saveMajorSumbit (parameter) {
  return axios({
    url: api.testSumbit + '/saveMajor',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 保存试题作答(创新创业测评)
export function saveCreateSumbit (parameter) {
  return axios({
    url: api.testSumbit + '/saveCreate',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delTestSumbit (parameter) {
  return axios({
    url: api.testSumbit + '/remove',
    method: 'post',
    params: parameter
  })
}

export const testSumbitExport = api.testSumbit + '/export'
