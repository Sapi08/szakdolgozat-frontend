import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token
          return api(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem('refresh_token')

    if (!refreshToken) {
      isRefreshing = false
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      delete api.defaults.headers.common['Authorization']
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const refreshApi = axios.create({
        baseURL: 'http://127.0.0.1:8000',
      })

      const res = await refreshApi.post('/token/refresh/', { refresh: refreshToken })
      const newAccessToken = res.data.access

      localStorage.setItem('access_token', newAccessToken)
      api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken
      originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken

      processQueue(null, newAccessToken)
      isRefreshing = false

      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      isRefreshing = false

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      delete api.defaults.headers.common['Authorization']
      window.location.href = '/login'

      return Promise.reject(refreshError)
    }
  },
)

export default api
