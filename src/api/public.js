import request from "@/utils/request";


export function getJobRecommendList(params) {
  return request({
    url: '/api/recommend/house_recommand/',
    method: 'get',
    params,
  })
}
// http://127.0.0.1:8000/api/recommend/job_search/?search=
export function jobSearch(params) {
  return request({
    url: '/api/recommend/job_search/',
    method: 'get',
    params,
  })
}

export function houseSearch(params) {
  return request({
    url: '/api/recommend/house_search/',
    method: 'get',
    params,
  })
}

// http://127.0.0.1:8000/api/recommend/update
// 运行刷新，让后端重新爬取数据
export function refreshData() {
  return request({
    url: '/api/recommend/update',
    method: 'get',
  })
}

export function refreshJisuan() {
  return request({
    url: '/api/recommend/jisuan',
    method: 'get',
  })
}

export function getHouseListByJobId(params) {
  const {jobId, page} = params
  return request({
    url: `/api/navigation/job_house_list/${jobId}/`,
    method: 'get',
    params: {
      page,
    }
  })
}

export function jobAnalysis() {
  return request({
    url: '/api/analysis/job_analysis',
    method: 'get',
  })
}

export function houseAnalysis() {
  return request({
    url: '/api/analysis/house_analysis',
    method: 'get',
  })
}

export function getHouseList(params) {
  return request({
    url: '/api/recommend/house_list/',
    method: 'get',
    params
  })
}

export function getJobList(params) {
  return request({
    url: '/api/recommend/job_list/',
    method: 'get',
    params
  })
}
