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

// 取得参赛作品提交列表 可按照每列名称模糊查找
// ?name=xxx&domain=xxx...
export function getCompetitionSumbitList (parameter, pageNumParam, pageSizeParam) {
  // 分页参数
  var paginationParam = {
    pageNum: pageNumParam,
    pageSize: pageSizeParam
  }

  return axios({
    url: api.competitionAPI + '/list',
    method: 'get',
    // params:合并分页参数与模糊查找参数
    params: Object.assign(paginationParam, parameter)
  })
}

// 教师作品评级/学生修改提交 表单提交
export function competitionReviewSumbit (parameter) {
  return axios({
    url: api.competitionAPI + '/review',
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
