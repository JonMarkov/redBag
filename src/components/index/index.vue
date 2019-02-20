<template>
  <div>
    <div v-if="existStatus" class="fourZ">
      <img src="../../assets/404.png"/>
      <p>发生了一些错误，您访问的页面已丢失</p>
      <a>重试</a>
    </div>
    <div class="indexBody" v-else>
      <div class="detTop" :class="HBtype == 3||HBtype == 4?'detTop_bg2':'detTop_bg1'">
        <!--头像-->
        <img class="detTopImg" :src="headImg">
        <!--昵称-->
        <p class="launch">{{nickName}}</p>
        <!--祝福语-->
        <p class="adv_lan">{{blessLang}}</p>
        <!--红包可领取状态 / 当status == 0且时间戳判断红包状态未过期 ExpiredState == false-->
        <button :class="BtnMain?'main_jb2':''" class="new-year-but1" @click="RedBtn"
                v-if="status == 0 && ExpiredState!=true"></button>
        <!--红包已领取状态 / 当status ==9（自定义状态） -->
        <div class="HaveDet" v-if="status == 9">
          <p class="HaveMoney">{{totalReceive}}</p>
          <p class="HaveNum" v-if="HBtype == 3||HBtype == 4">我已助推 <span>{{invitedNum}}</span> 次</p>
        </div>
        <!--红包已领完状态 / 当status == 1-->
        <p class="Already" v-if="Message ==true">{{messageInfo}}</p>
        <!--红包已领完状态 / 当status == 1-->

        <p class="Already" v-if="status == 1 && ExpiredState!=true">红包已领完</p>
        <!--红包已过期状态 / 当status == 2或时间戳判断红包状态已过期 ExpiredState == true-->
        <p class="Expired" v-if="status == 2||ExpiredState == true">红包已过期</p>

        <!--红包领取次数已用完状态 / timesToo == ture -->
        <p class="tooMuch" v-if="timesToo">今天领太多红包啦 明天再试吧</p>

        <a class="HaveBtn" @click="goToRedDet"
           v-if="(status == 9)||(status == 1 && ExpiredState!=true)||(status == 2||ExpiredState == true)||(timesToo||Message ==true)">查看领取详情
          ></a>
        <!--广告位-->
        <div :class="ShareStateS?'ShareTS':'ShareFS'" @touchmove.prevent>
          <img class="GGGif" src="../../assets/jiazai.gif"/>
          <img class="GGTop" src="../../assets/GG_top.png"/>
          <img class="GGImg" src="../../assets/SCGIf.jpg"/>
          <p>正在开红包...</p>
          <img class="GGBottom" src="../../assets/GG_bottom.png"/>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  // 引用请求后台数据的公共方法
  import api from '../../api/index'
  // 封装的微信分享函数
  import wx from 'weixin-js-sdk'

  export default {
    name: 'home',
    components: {},
    data() {
      return {
        // 广告位置
        ShareStateS: false,
        // 查看详情
        Message: false,
        // 详情状态
        messageInfo: '',
        // 红包是否存在 / 初始化为存在
        existStatus: false,
        // 判断次数是否领取过多
        timesToo: false,
        // 红包动画初始状态 / 旋转按钮
        BtnMain: false,
        // 票据
        ticket: "",
        // 时间戳判断红包状态是否过期
        ExpiredState: false,
        // 红包状态
        status: '',
        // 用户昵称
        nickName: '看看视频',
        //用户头像
        headImg: '../../assets/new_year_but1.png',
        // 用户祝福语
        blessLang: '',
        // 助推次数
        invitedNum: '',
        // 用户领取金额
        totalReceive: '',
        // 红包状态
        HBtype: ''
      }
    },
    created() {
      // 获取必要参数函数执行
      this.Obtain();
      // 查询红包请求接口执行
      this.goToQuery();
    },
    methods: {
      // 获取必要参数函数定义
      Obtain() {
        // 此处代表无点击打开按钮时候存储状态存入本地缓存
        localStorage.setItem('DoYouClick', 0)
        // 把code存入本地缓存
        localStorage.setItem('ReqCode', this.$route.query.code || '')
        // 把userId存入本地缓存
        localStorage.setItem('UrlUserId', this.$route.query.userid || '')
        //把sessionid存入本地缓存

        localStorage.setItem('ticket', this.getCookie('ticket') || '')
        //把userCode存入本地缓存
        localStorage.setItem('userCode', this.$route.query.userCode || '')
        //把referCode存入本地缓存
        localStorage.setItem('referCode', this.$route.query.referCode || '')
        // 获取code存入本地data
        this.ReqCode = this.$route.query.code;
        // 获取user_id存入data
        this.UrlUserId = this.$route.query.userid;
        // 获取sessionid存入data
        this.UrlSessionId = this.$route.query.sessionid;
        // 获取userCode存入data
        this.userCode = this.$route.query.userCode;
        // 获取referCode存入data
        this.referCode = this.$route.query.referCode;
        api.setTicket(this.getCookie('ticket'));
        // 执行SessionId，把数据传到axios设置到headers
        api.setSessionId(this.UrlSessionId);
        // 执行SessionId，把数据传到axios设置到headers
        api.setUserId(this.UrlUserId);
        // 执行拦截器
        api.initInterceptors();
      },
      //
      getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
          return unescape(arr[2]);
        else
          return null;
      },
      // 打开红包函数定义
      RedBtn() {
        // 此处代表点击打开按钮时候存储状态存入本地缓存
        localStorage.setItem('DoYouClick', 1)
        // 暂存this,定义this指向
        let _this = this;
        // 为点击域增加一个class
        _this.BtnMain = true;
        // 声明定时器,1秒后执行
        setTimeout(function () {
          // 领取红包函数执行
          _this.DoYouClick()
          _this.ShareStateS = true
        }, 500);
      },
      // 广告位函数定义
      DoYouClick: function () {
        let _this = this
        setTimeout(function () {
          // 领取红包函数执行
          _this.goToReceive()
        }, 6000);
      },
      // 领取红包函数定义
      async goToReceive() {
        // 重定向this值
        let _this = this;
        // 传参集合
        let param = {};
        // 请求接口的后缀
        let url = 'receive';
        // 传参值
        param["code"] = this.ReqCode;
        param["referCode"] = this.referCode || '';
        console.log(param)
        // 开始请求 Post方法
        api.httpPost(param, function (data) {
          // 返回的值
          console.log('Post请求测试')
          console.log(data);
          // 为点击域减去添加的class
          _this.BtnMain = false;
          if (data.code === 200) {
            _this.$router.push({
              name: 'indexList'
            })
            // _this.goToQuery()
          } else if (data.code === 1008) {
            _this.timesToo = true;
            _this.ExpiredState = false;
            _this.status = 10
          } else {
            _this.status = 10
            _this.Message = true;
            _this.messageInfo = data.message

          }
        }, url);
      },
      // 查询红包接口函数定义
      async goToQuery() {
        // 传参集合
        let param = {};
        // 请求接口的后缀
        let url;
        // 重定向this值
        let _this = this;
        // 传参值
        param["code"] = this.ReqCode;
        // 开始请求 Get方法
        api.httpGet(param, function (data) {
          // 返回的值
          console.log('Get请求测试')
          // 否则执行正常逻辑
          if (data.code == 200) {
            // 红包类型 官方或是普通
            _this.HBtype = data.data.type
            //把HBtype存入本地缓存
            localStorage.setItem('HBtype', data.data.type || '')
            //把qrCode存入本地缓存
            localStorage.setItem('qrCode', data.data.qrCode || '')
            //把shareImgLink存入本地缓存
            localStorage.setItem('shareImgLink', data.data.shareImgLink || '')
            //把subtitle存入本地缓存
            localStorage.setItem('subtitle', data.data.subtitle || '')
            //把title存入本地缓存
            localStorage.setItem('title', data.data.title || '')


            // 获取用户昵称
            _this.nickName = data.data.nickname;
            //获取用户头像
            _this.headImg = data.data.avator;
            // 获取祝福语
            _this.blessLang = data.data.remark || '恭喜发财，大吉大利'
            //用户领取状态 recieveStatus:0、可领取 1、已领取 ,
            let recieveStatusTem = data.data.recieveStatus;
            // 红包领取状态 status:0、可领取  status:1、已领完  status:2、已过期
            let statusTem = data.data.status;
            // 如果用户领取状态为已领取则显示用户领取详情，不判断红包是否过期
            if (recieveStatusTem == 1) {
              // 如果上次已经领取过则直接跳转
              setTimeout(function () {
                _this.$router.push({
                  name: 'indexList'
                })
              }, 0);
              // 自定义红包状态码
              _this.status = 9;
              // 助推次数
              _this.invitedNum = data.data.invitedNum;
              // 用户领取金额
              _this.totalReceive = data.data.totalReceive;
              // 如果已领取，则不用当前时间判断红包是否过期
              _this.ExpiredState = false
            }
            // 如果用户已经领取则显示用户的领取详情
            else {

              _this.status = statusTem;
              // 第二次层判断红包是否过期
              // 获取当前时间戳
              let timestampNew = Date.parse(new Date())

              // 获取红包过期时间
              // let timestampExpire = Date.parse(data.data.expireTime)
              let timestampExpire = new Date(Date.parse((data.data.expireTime).replace(/-/g, "/"))).getTime();
              // 如果红包过期时间小于当前时间，则代表红包过期
              if (timestampExpire < timestampNew) {
                _this.ExpiredState = true
                setTimeout(function () {
                  _this.$router.push({
                    name: 'indexList'
                  })
                }, 0);
              }

            }
          } else if (data.code == 1002) {
            // 如果code码为1002则代表红包不存在
            // 如果红包不存在则页面不显示，直接显示404页面
            _this.existStatus = true
          } else if (data.code == 1008) {
            _this.timesToo = true;
            _this.ExpiredState = false;
            _this.status = 10
          } else {
            //_this.existStatus = true
          }
        }, url);
      },
      // 查看详情函数定义
      goToRedDet() {
        let _this = this;
        _this.$router.push({
          name: 'indexList'
        })
      },
      //ssss
      share() {
        console.log('123')
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        // 重定向this值
        let _this = this;
        // 传参集合
        let param = {};
        // 请求接口的后缀
        let url = '';
        // 传参值
        // let purl = "https://opex.kkstudy.cn/index?code=" + _this.ReqCode + '&referCode=' + _this.referCode + '&userid=' + _this.UrlUserId + '&userCode=' + _this.userCode;
        // let purl_1 = window.location.href.split('#')[0]
        if (isAndroid) {
          // 安卓端
          var purl_1 = window.location.href
        }
        if (isiOS) {
          // ios端
          var purl_1 = window.initUrl
        }
        let purl = encodeURIComponent(purl_1)
        param["url"] = purl;
        // alert(purl)
        console.log(param)
        api.httpGetSh(param, function (data) {
          // 返回的值
          console.log('分享请求测试')
          console.log(data);
          // 为点击域减去添加的class
          _this.wxInit(data);
        }, url);
      },
      //微信分享使用方法
      wxInit(sd) {
        // 获取shareImgLink存入data
        this.shareImgLink = localStorage.getItem('shareImgLink');
        // 获取title存入data
        this.title = localStorage.getItem('title');
        // 获取subtitle存入data
        this.subtitle = localStorage.getItem('subtitle');
        console.log(this.title)
        let _this = this
        var host = this.getDomain();
        let links = host + '?code=' + _this.ReqCode + '&referCode=' + _this.userCode;  //分享出去的链接
        let title = this.title;  //分享的标题
        let desc = this.subtitle; //分享的详情介绍
        let imgUrl = this.shareImgLink;
        // let imgUrl = 'http://img3.imgtn.bdimg.com/it/u=2381661931,653570174&fm=26&gp=0.jpg'
        console.log(imgUrl)
        wx.config({
          debug: false,
          appId: process.env.WECHAT_APPID,
          timestamp: sd.data.timestamp,
          nonceStr: sd.data.nonceStr,
          signature: sd.data.signature,
          jsApiList: [
            'checkJsApi', 'updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'
          ]
        });
        wx.ready(function () {
          wx.onMenuShareTimeline({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: links, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
            },
            cancel: function () {

            }
          });

          //微信分享菜单测试
          wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: links, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function () {
            },
            cancel: function () {

            }
          });
          wx.updateTimelineShareData({
            title: title, // 分享标题
            link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
              // 设置成功
            },
            cancel: function () {

            }
          });
          wx.updateAppMessageShareData({
            title: title, // 分享标题
            desc: desc,
            link: links, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: imgUrl, // 分享图标
            success: function () {
              // 设置成功
            },
            cancel: function () {
            }
          });
        });
        wx.error(function (res) {
          // _this.ShCallBackState = true
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
      },
      getDomain() {
        var protocal = document.location.protocol;
        var host = document.location.host;
        return protocal + "//" + host
      }

    },
    mounted() {
      !window.initUrl && (window.initUrl = window.location.href)
      this.share();
    }
  }
</script>
<!--样式-->
<style scoped>
  .fourZ {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .fourZ img {
    margin-top: 20%;
    width: 80%;
    align-items: center;
  }

  .fourZ p {
    margin-top: 10%;
  }

  .fourZ a {
    margin-top: 3%;
  }

  /*背景*/
  .indexBody {
    width: 100%;
    height: 100%;
    position: absolute;
    /*padding: 25px;*/
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    /*justify-content: center;*/
    text-align: center;
  }

  /*红包背景*/
  .detTop {

    background-size: auto 100%;
    display: flex;
    align-items: center;
    width: 90%;
    flex-direction: column;
    margin: 50px auto;
    margin-bottom: 0px;
    min-height: 450px;
    padding: 60px 0px 50px 0px;
  }

  .detTop_bg1 {
    background-image: url("../../assets/new_year_icon23.png");
    overflow: hidden;
    background-size: 100% 100%;
  }

  .detTop_bg2 {
    background-image: url("../../assets/new_year_icon24.png");
    overflow: hidden;
    background-size: 100% 100%;
  }

  /*红包所属人头像*/
  .detTopImg {
    width: 50px;
    height: 50px;
    border-radius: 10px;
  }

  /*昵称*/
  .launch {
    opacity: 1;
    font-size: 18px;
    color: rgba(255, 226, 177, 1);
    line-height: 25px;
    letter-spacing: 0px;
    margin-top: 10px;
  }

  /*祝福语*/
  .adv_lan {
    opacity: 1;
    font-size: 24px;
    color: rgba(255, 226, 177, 1);
    line-height: 33px;
    letter-spacing: 0px;
    margin-top: 20px;
    width: 85%;
    height: 80px;
  }

  /*红包按钮*/
  .new-year-but1 {
    background-image: url("../../assets/new_year_but1.png");
    background-size: auto 100%;
    width: 100px;
    height: 103px;
    border: 0px;
    margin-top: 0%;
  }

  /*红包旋转动画*/
  .main_jb2 {
    animation-name: wobble;
    -webkit-animation-name: wobble;
    -o-animation-name: wobble;
    -ms-animation-name: wobble;
    -moz-animation-name: wobble;
    animation-duration: 1s;
    -webkit-animation-duration: 1s;
    -o-animation-duration: 1s;
    -ms-animation-duration: 1s;
    -moz-animation-duration: 1s;
    animation-timing-function: linear;
    -webkit-animation-timing-function: linear;
    -o-animation-timing-function: linear;
    -ms-animation-timing-function: linear;
    -moz-animation-timing-function: linear;
    animation-delay: 0s;
    -webkit-animation-delay: 0s;
    -o-animation-delay: 0s;
    -ms-animation-delay: 0;
    -moz-animation-delay: 0s;
    animation-iteration-count: infinite;
    -webkit-animation-iteration-count: infinite;
    -o-animation-iteration-count: infinite;
    -ms-animation-iteration-count: infinite;
    -moz-animation-iteration-count: infinite;
  }

  @keyframes wobble {
    0% {
      transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateZ(0px);
    }
    25% {
      transform: rotateY(90deg) rotateX(0deg) rotateZ(0deg) translateZ(0px);
    }
    50% {
      transform: rotateY(180deg) rotateX(0deg) rotateZ(0deg) translateZ(0px);
    }
    75% {
      transform: rotateY(90deg) rotateX(0deg) rotateZ(0deg) translateZ(0px);
    }
    100% {
      transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateZ(0px);
    }
  }

  @-webkit-keyframes wobble {
    0% {
      -webkit-transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateZ(0px);
    }
    25% {
      -webkit-transform: rotateY(90deg) rotateX(0deg) rotateZ(0deg) translateZ(0px);
    }
    50% {
      -webkit-transform: rotateY(180deg) rotateX(0deg) rotateZ(0deg) translateZ(0px);
    }
    75% {
      -webkit-transform: rotateY(90deg) rotateX(0deg) rotateZ(0deg) translateZ(0px);
    }
    100% {
      -webkit-transform: rotateY(0deg) rotateX(0deg) rotateZ(0deg) translateZ(0px);
    }
  }

  .ShareTS {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 9998;
    color: #fff;
    background: #FF5A47;

  }

  .ShareTS p {
    top: 40px;
    position: absolute;
    opacity: 1;
    font-size: 12px;
    color: rgba(255, 239, 198, 1);
    line-height: 20px;
    letter-spacing: 0px;
  }

  .ShareFS {
    display: none;
  }

  .GGTop {
    position: absolute;
    top: 0px;
    width: 98%;
  }

  .GGImg {
    position: absolute;
    width: 75%;
    top: 80px;
    box-shadow: 0 15px 20px -10px rgba(0, 0, 0, 0.20);
    height: auto;
  }

  .GGGif {
    position: absolute;
    width: 100px;
    top: 60px;
    z-index: 1000;
  }

  .GGBottom {
    position: absolute;
    width: 100%;
    bottom: 0px;
  }

  /*红包已领完*/
  .Already {
    opacity: 1;
    font-size: 30px;
    color: rgba(255, 226, 177, 1);
    line-height: 42px;
    letter-spacing: 0px;
    margin-top: 4%;
    width: 76%;
  }

  /*红包已过期*/
  .Expired {
    opacity: 1;
    font-size: 30px;
    color: rgba(255, 226, 177, 1);
    line-height: 42px;
    letter-spacing: 0px;
    margin-top: 4%;
    width: 76%;
  }

  /*领取过去禁止领取*/
  .tooMuch {
    opacity: 1;
    font-size: 30px;
    color: rgba(255, 226, 177, 1);
    line-height: 42px;
    letter-spacing: 0px;
    margin-top: 4%;
    width: 76%;
  }

  /*红包不存在*/
  .NonExi {
    opacity: 1;
    font-size: 30px;
    color: rgba(255, 226, 177, 1);
    line-height: 42px;
    letter-spacing: 0px;
    margin-top: 20%;
    width: 76%;
  }

  /*红包已领取*/
  .HaveDet {
    margin-top: 16%;
  }

  .HaveMoney {
    opacity: 1;
    font-size: 30px;
    color: rgba(255, 226, 177, 1);
    line-height: 42px;
    letter-spacing: 0px;
  }

  .HaveNum {
    opacity: 1;
    font-size: 14px;
    color: rgba(255, 226, 177, 1);
    line-height: 20px;
    letter-spacing: 0px;
  }

  .HaveBtn {
    opacity: 1;
    font-size: 14px;
    color: rgba(255, 226, 177, 1);
    line-height: 100px;
    letter-spacing: 0px;
  }
</style>
