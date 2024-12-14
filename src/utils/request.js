import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
let ERRORMSG = null

const tip = (message, type, duration) => {
  return Message({
    message,
    type,
    duration: duration || 2500
  })
}
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['authorization'] = getToken()
    }
    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)
const errorHandle = (status, other, response) => {
  switch (status) {
    case 401:
      if (!ERRORMSG) {
        ERRORMSG = tip(response.message || '未登录', 'error')
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      } else {
        const timeout = setTimeout(() => {
          ERRORMSG = null
          clearTimeout(timeout)
        }, 600)
      }

      break
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      tip('token过期，请重新登录!', 'error')
      setTimeout(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }, 800)
      break
    // 404请求不存在
    case 400:
      tip(response.message || response || '请求出错请稍后尝试', 'error')
      break
    case 404:
      tip(other + '  请求的资源不存在', 'error')
      break
    case 500:
      tip(other + '  内部服务器错误', 'error')
      break
    case 429:
      tip(other + ' 请求次数过多，请稍后再试', 'error')
      break
    case 511:
      tip(other + '  操作无权限', 'error')
      break
    case 502:
      tip(other + '  请联系管理员', 'error')
      break
    case 504:
      tip(other + '  网关超时(gateway timeout)', 'error')
      break
    default:
      tip(other + '  未知错误，请刷新后重试', 'error')
  }
}
// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      Message({
        message: res.err || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.code === 403) {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }
      return Promise.reject(new Error(res.err || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    const { response } = error
    if (response) {
      errorHandle(response.status, response.statusText, response.data)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      tip('网络异常', 'error')
    }
    return Promise.reject(error)
  }
)

export default service
