import { axios } from '@/utils/request'

const api = {
  testLib: '/system/ques'
}

export function getTestLibList (parameter) {
  return axios({
    url: api.testLib + '/list',
    method: 'get',
    params: parameter
  })
}

export function saveTestLib (parameter) {
  return axios({
    url: api.testLib + (parameter.quesId > 0 ? '/update' : '/save'),
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function delTestLib (parameter) {
  return axios({
    url: api.testLib + '/remove',
    method: 'post',
    params: parameter
  })
}
export function getTestLibByTypeId (typeId) {
  return axios({
    url: api.testLib + '/getByTypeId/' + `${typeId}`,
    method: 'get'
  })
}
