import wxApiUrl from './resource'
import {get, post} from '../common/http'
import store from '../store'
import axios from 'axios'
import qs from 'qs'

export default {
  // 定义Ticket函数，外部调用
  setTicket(ticket) {
    axios.ticket = ticket;
  },
  // 定义UserId函数，外部调用
  setUserId(userId) {
    axios.userid = userId;
  },
  // 定义sessionId函数，外部调用
  setSessionId(sessionId) {
    axios.sessionId = sessionId;
  },
  // 定义拦截器-设置headers，外部调用
  initInterceptors() {
    // 请求拦截器
    axios.interceptors.request.use(
      (config) => {
        // 如果headers不等于undefined，则初始化headers为一个对象
        if (config.headers === undefined) {
          config.headers = {}
        }
        // 设置请求头必要参数
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
        config.headers["terminal"] = "H5";
        config.headers["sessionId"] = axios.sessionId;
        if (axios.userid !== undefined) {
          config.headers["userid"] = axios.userid;
        } else {
          config.headers["userid"] = "";
        }
        if (axios.ticket !== undefined) {
          config.headers["ticket"] = axios.ticket;
        } else {
          config.headers["ticket"] = "";
        }
        if (axios.sessionId !== undefined) {
          config.headers["sessionId"] = axios.sessionId
        } else {
          config.headers["sessionId"] = ""
        }
        return config;
      }
    )
    // 响应拦截器
    axios.interceptors.response.use(
      (response) => {
        // 对响应数据做处理
        let token = response.data.token
        // 如果token不等于空时
        if (token !== undefined && token !== null) {
          this.setTicket(token.ticket)
        }
        return response;
      }
    )
  },
  // POST提交  用于领取红包函数定义
  httpPost(data, _callback, url, headers) {
    axios({
      method: "POST",
      url: url,
      data: qs.stringify(data),
      headers: headers
    }).then(function (res) {
      _callback(res.data);
    });
  },
  // GET提交 用于查询红包函数定义
  httpGet(params, _callback, url, headers) {
    axios({
      method: "get",
      url: url,
      params: params,
      headers: headers
    }).then(function (res) {
      _callback(res.data);
    });
  },
  // GET提交 用于落地页获取用户信息
  httpGetLD(params, _callback, url, headers) {
    axios({
      method: "get",
      url: wxApiUrl.getLD,
      params: params,
      headers: headers
    }).then(function (res) {
      _callback(res.data);
    });
  },
  // GET提交 用于落地页计算累计金额
  httpGetR(params, _callback, url, headers) {
    axios({
      method: "get",
      url: wxApiUrl.getR,
      params: params,
      headers: headers
    }).then(function (res) {
      _callback(res.data);
    });
  },
  // GET提交 用于微信分享
  httpGetSh(params, _callback, url, headers) {
    axios({
      method: "get",
      url: wxApiUrl.getHome,
      params: params,
      headers: headers
    }).then(function (res) {
      _callback(res.data);
    });
  },
  // GET提交 用于落地页视频
  httpGetMovie(params, _callback, url, headers) {
    axios({
      method: "get",
      url: wxApiUrl.getMovie,
      params: params,
      headers: headers
    }).then(function (res) {
      _callback(res.data);
    });
  }
}
