import axios from "axios";
import cookie from "js-cookie";

axios.defaults.baseURL = "http://localhost:3000/";

axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    config.headers.authorization = cookie.get("token");
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
