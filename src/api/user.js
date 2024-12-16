import request from '@/utils/request'

export const ajaxUser = {
  home(data) {
    return request({
      url: '/admin_statistics',
      method: 'post',
      data
    })
  },
  tongji(data) {
    return request({
      url: '/tongji',
      method: 'post',
      data
    })
  },
  admin_statisticsFilter(data) {
    return request({
      url: '/admin_statisticsFilter',
      method: 'post',
      data
    })
  },
  getU(data) {
    return request({
      url: '/admin_reverse',
      method: 'post',
      data
    })
  }

}
export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}
export function updatePwd(data) {
  return request({
    url: '/changepass',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function getPriceStatus(data) {
  return request({
    url: '/admin_get_price_status',
    method: 'post',
    data
  })
}
export function updatePriceStatus(data) {
  return request({
    url: '/admin_update_uprice',
    method: 'post',
    data
  })
}
