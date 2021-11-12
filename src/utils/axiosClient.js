import axios from "axios"
import qs from "qs"

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API,
  paramsSerializer: (params) => {
    return qs.stringify(params, { skipNulls: true })
  }
})

axiosClient.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("token")
    if (userInfo) {
      // const {accessToken} = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${userInfo}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data
    }
    return response
  },
  (err) => {
    if (err.response) {
      switch (err.response.status) {
        case 401:
          localStorage.removeItem("token")
          break
        case 403:
          break
        default:
          return Promise.reject(err)
      }
    }
    return Promise.reject(err)
  }
)

export default axiosClient
