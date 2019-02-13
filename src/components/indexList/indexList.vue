<template>

  <div class="indexListBody">
    <!--头部-->
    <div class="listTop">
      <img src="../../assets/right-icon.png" class="redRules" @click="MaskFnT">
      <!--<img src="../../assets/he.png" class="redRules" @click="shareFnF" v-else/>-->
      <img class="HeadP" :src="avator"/>
      <p class="RedName">来自 {{nickName}} 的红包</p>
      <p class="ResInfo">“{{blessLang}}”</p>
      <p class="RedMoney">{{totalReceive}}<span>元</span></p>
      <p class="RedFull">满1元，微信秒到账</p>
      <!--v-if="totalReceive != 0"-->

    </div>
    <!--底部-->
    <div class="listBottom">
      <div class="BottomBtn" @click="shareFn">
        <!--<img class="animate-bounce-up TwoRed" src="../../assets/two_red.png"/>-->
        <div class="TwoText">
          <p class="TextTile">邀请好友 再开一个</p>
          <p class="TextInfo">领你红包，一辈子都是你徒弟</p>
        </div>
        <img class="open_btn animate-bounce-up" src="../../assets/open_btn.png"/>

        <!--<img class="TwoFx" src="../../assets/fx_icon.png"/>-->
      </div>
    </div>
    <!--<p class="RedGuide">红包已存入<span @click="APPDown">看看视频APP</span>，可立即提现</p>-->
    <!--<div class="centerCopy" style="margin-bottom: 15px">-->
      <!--<a class="RedHref" @click="APPDown">打开看看视频APP</a>-->
    <!--</div>-->
    <div class="BoostDet" v-if="BoostListLength !=0">
      <div class="BoosterNum">
        <img class="BoostImg" v-for="item in BoostList" :src="item.avator"/>
      </div>
      <p class="BoosterText"> 等<span>{{BoostListLength}}</span>人在助推</p>
    </div>
    <!--中部-->
    <div class="listCenter">
      <div class="centerNum">
        <div class="money_left">
          <p>已领取<i>{{num}}</i>/<i>{{total}}</i>个红包</p>
          <p v-if="HBtype!=3&&HBtype!=4">，共<i>{{balance}}</i>/<i>{{amount}}</i>元</p>
        </div>
        <div class="money_right">
          <p class="RedGuide" v-if="HBtype==3||HBtype==4">红包已存入<span @click="APPDown">看看视频APP</span></p>
        </div>
      </div>
      <div class="centerDet" v-for="item in ReceiveList">
        <div class="DetInfo">
          <div class="InfoImg">
            <img :src="item.avator">
            <div class="NameTime">
              <p class="InfoName">{{item.nickname}}</p>
              <p class="InfoTime">{{(item.receiveTime.split(" "))[1]}}</p>
            </div>
          </div>
          <div class="MoneyNum">
            <p class="InfoMoney">￥<span>{{item.amount|numFilter}}</span></p>
            <p class="InfoNum"><span
              v-if="item.invitedNum>0">助推{{item.invitedNum}}次 </span><span>已领{{item.receiveNum}}</span>个
            </p>
          </div>
        </div>
      </div>
    </div>
    <!--下载看看视频App-->
    <!--版权-->
    <div class="down_img" @click="APPDown">
      <img src="../../assets/down_btn.png"/>
    </div>
    <div class="centerCopy">
      <!--<a class="RedHref" @click="APPDown">打开看看视频APP</a>-->
      <p>看看视频 版权所有 ©2019</p>

    </div>
    <!--红包注册规则遮罩-->
    <div :class="MaskState?'MaskT':'MaskF'" @click="MaskFnF">
      <div class="maskRed">
        <img src="../../assets/hbgz.png"/>
      </div>
      <div class="maskInfo">
        <div class="infoWz">
          <p class="WzBt">1、领取红包</p>
          <p class="WzNr"> 在领取红包金额后，你还可将红包分享给好友：若好友为新用户，则他领取时你自动再开一次红包。若用户为老用户，则不会再给你开一次红包。
            <br/>*新用户为从未领取过红包的用户。
          <p>


          <p class="WzBt">2、红包类型</p>
          <p class="WzNr">助推红包：分享出去的红包，若领取者为新用户，则此人成为你的徒弟；
            普通红包：分享出去的红包，师徒关系只会与发出红包的主人产生师徒关系。
          </p>

          <p class="WzBt">3、如何提现</p>
          <p class="WzNr">APP内可直接发起提现至微信。</p>
          <p class="WzTz" @click="APPDown">看看视频APP点击下载>></p>

          <p class="WzBt">4、加速提现</p>
          <p class="WzNr">加入看看视频社区可加速提现。</p>
          <img :src="qrCode" style="width: 200px"/>
          <!--:src="qrCode"-->

        </div>

        <div class="infoBtn">
          <p>
            我知道了
          </p>
        </div>

      </div>
    </div>
    <!--点击分享遮罩-->
    <div :class="ShareState?'ShareT':'ShareF'" @click="shareFnF" @touchmove.prevent>
      <img src="../../assets/FXImg.png"/>
    </div>
    <!--首次进入页面出现-->
    <div :class="ShareStateS?'ShareTS':'ShareFS'" @touchmove.prevent>
      <img src="../../assets/SCGIf.png"/>
    </div>
    <!--分享回调之后遮罩-->
    <div :class="ShCallBackState?'ShCallBackT':'ShCallBackF'" @click="ShCallBackFnF" @touchmove.prevent>
      <div class="CallSh">
        <div class="Call_icon">
          <!--<img src="../../assets/sub_icon.png"/>-->
          <p>进群加速提现</p>
        </div>
        <div class="Call_qr">
          <img :src="qrCode"/>
          <p class="Call_det">(长按识别二维码)</p>
        </div>
        <div class="Call_present">
          <p>进群加速提现</p>
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
  // import wx from 'weixin-js-sdk'
  // import wx from 'wx'
  export default {
    name: 'home',
    components: {},
    data() {
      return {
        // 首次出现
        ShareStateS: false,
        ShCallBackStateP: false,
        // 红包规则遮罩状态
        MaskState: false,
        // 点击分享遮罩状态
        ShareState: false,
        // 分享回调之后遮罩状态
        ShCallBackState: false,
        // 红包领取列表
        ReceiveList: [],
        // 红包发起者用户昵称
        nickName: '',
        // 红包发起者用户头像
        headImg: '../../assets/new_year_but1.png',
        // 红包发起者祝福语
        blessLang: '',
        // 用户领取金额
        totalReceive: '',
        // 用户助推次数
        invitedNum: '',
        // 红包总个数
        total: '',
        // 红包已领个数
        num: '',
        // 红包总金额
        amount: '',
        // 红包已领金额
        balance: '',
        // 红包发起者头像
        avator: '',
        // 助推人数列表
        BoostList: '',
        //助推人数
        BoostListLength: '',
        // 红包状态
        HBtype: '',
      }
    },
    filters: {
      numFilter(value) {
        // 截取当前数据到小数点后两位
        let realVal = parseFloat(value).toFixed(2)
        return parseFloat(realVal)
      }
    },
    async created() {
      // 获取必要参数函数执行
      this.Obtain();
      // 请求红包记录数据函数执行
      this.goToReceive();
      // 请求查询红包函数执行
      this.goToQuery()
      // 请求助推人数函数执行
      this.goToInvited()

    },
    methods: {
      // 获取进入二维码接口函数定义
      QRCodeRequest: function () {

      },
      // 获取必要参数函数定义
      Obtain() {
        let _this = this
        // 获取code存入本地data
        this.ReqCode = localStorage.getItem('ReqCode');
        // 获取user_id存入data
        this.UrlUserId = localStorage.getItem('UrlUserId');
        // 获取sessionid存入data
        console.log(this)
        // 获取referCode存入data
        this.referCode = localStorage.getItem('referCode');
        // 获取HBtype存入data
        this.HBtype = localStorage.getItem('HBtype');
        // 获取userCode存入data
        this.userCode = localStorage.getItem('userCode');
        // 获取qrCode存入data
        this.qrCode = process.env.STATIC_DOMAIN + localStorage.getItem('qrCode');
        // 执行SessionId，把数据传到axios设置到headers
        api.setSessionId(this.UrlSessionId);
        // 执行SessionId，把数据传到axios设置到headers
        api.setUserId(this.UrlUserId);
        // 执行拦截器
        api.initInterceptors();
        // 显示一个gif图
        // // 获取userCode存入data
        // let DoYouClick = localStorage.getItem('DoYouClick');
        // _this.DoYouClick(DoYouClick)
      },
      // DoYouClick: function (DoYouClick) {
      //   let _this = this
      //   if (DoYouClick == 1) {
      //     setTimeout(function () {
      //       _this.ShareStateS = true
      //     }, 100);
      //     setTimeout(function () {
      //       _this.ShareStateS = false
      //     }, 5000);
      //   }
      // },
      // *请求红包查询记录数据函数定义  GET /opex/hongbao
      async goToReceive() {
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
          console.log('Get请求测试GET /opex/hongbao');
          console.log(data);
          // 获取发起者用户昵称
          _this.nickName = data.data.nickname;
          //获取发起者用户头像
          _this.headImg = data.data.avator;
          // 获取红包发起者设置的祝福语
          _this.blessLang = data.data.remark || '恭喜发财，大吉大利';
          // 获取用户领取的金额
          _this.totalReceive = data.data.totalReceive;
          // 获取用户助推次数
          _this.invitedNum = data.data.invitedNum;
          // 红包总个数
          _this.total = data.data.total;
          // 红包已领个数
          _this.num = data.data.num;
          // 红包总金额
          _this.amount = (data.data.amount).toFixed(2);
          // 红包已领总金额
          _this.balance = (data.data.amount - data.data.balance).toFixed(2);
          // 红包发起者头像
          _this.avator = data.data.avator
        }, url);
      },
      // *请求查询红包领取合并记录函数定义   GET /opex/hongbao/mergeRecords
      async goToQuery() {
        // 传参集合
        let param = {};
        // 请求接口的后缀
        let url = 'mergeRecords';
        // 重定向this值
        let _this = this;
        // 传参值
        param["code"] = this.ReqCode;
        param["limit"] = 10000
        // 开始请求 Get方法
        api.httpGet(param, function (data) {
          // 返回的值
          console.log('Get请求测试GET /opex/hongbao/mergeRecords');
          console.log(data);
          // 红包领取记录列表
          _this.ReceiveList = data.data
        }, url);
      },
      // *请求助推人数函数定义  GET /opex/hongbao/invited
      async goToInvited() {
        // 传参集合
        let param = {};
        // 请求接口的后缀
        let url = 'invited';
        // 重定向this值
        let _this = this;
        // 传参值
        param["code"] = this.ReqCode;
        // 开始请求 Get方法
        api.httpGet(param, function (data) {
          // 返回的值
          console.log('Get请求测试GET /opex/hongbao/invited');
          console.log(data.data);
          _this.BoostListLength = data.data.length
          _this.BoostList = data.data
        }, url);
      },
      // *红包规则打开遮罩函数定义
      MaskFnT: function () {
        this.MaskState = true
      },
      // *红包规则关闭遮罩函数定义
      MaskFnF: function () {
        this.MaskState = false
      },
      // *下载APP函数定义
      APPDown: function () {
        location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.xunlei.kankan";
      },
      // *点击分享打开遮罩函数定义
      shareFn: function () {
        let _this = this
        setTimeout(function () {
          _this.ShCallBackState = true
          _this.ShareState = false
        }, 5000);
        this.ShareState = true
      },
      // 点击分享关闭遮罩函数定义
      shareFnF: function () {
        this.ShareState = false;
        // this.ShCallBackState = true;
      },
      // 分享回调之后关闭遮罩函数定义
      ShCallBackFnF: function () {
        this.ShCallBackState = false
      },
      // 分享回调之后关闭遮罩函数定义
      ShCallBackFnFP: function () {
        this.ShCallBackStateP = false
      },
      share() {
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
      // 在html的dom发生改变时候调用
      !window.initUrl && (window.initUrl = window.location.href)
      this.share();
    },
  }
</script>

<style scoped>
  .down_img{
    width: 100%;
    position: fixed;
    bottom: 0px;
  }
  .down_img img{
    width: 50%;
  }
  /*背景*/
  .indexListBody {
    /*background: rgba(241, 241, 241, 1);*/
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  /*头部刘海*/
  .redTopImg {
    width: 100%;
  }

  /*头部*/
  .listTop {
    padding-bottom: 10px;
    background-image: url("../../assets/top_red.png");
    overflow: hidden;
    background-size: 100% 100%;
  }

  .ljtx {
    margin-top: 0px;
    opacity: 1;
    font-size: 20px;
    color: rgba(255, 255, 255, 1);
    line-height: 28px;
    letter-spacing: 0px;
  }

  /*头部红色*/
  .redRules {

    /*position: fixed;*/
    /*top: 0px;*/
    /*right: 0px;*/
    /*position:relative;*/
    /*top:-111px;*/
    /*right: -177px;*/
    position: absolute;
    top: 0px;
    right: 0px;
    opacity: 1;
    font-size: 13px;
    color: rgba(255, 255, 255, 1);
    line-height: 18px;
    letter-spacing: 0px;
    width: 67px;
    height: 39px;
  }

  /*头像*/
  .HeadP {
    width: 100px;
    height: 100px;
    margin-top: 50px;
    opacity: 1;
    background: rgba(255, 255, 255, 1);
    border-radius: 5px 5px 5px 5px;
    box-shadow: 0px 5px 8px 0px rgba(103, 23, 18, 0.3);
    border: 1px solid #FFE2B1;
  }

  /*昵称部分*/
  .RedName {
    opacity: 1;
    font-size: 15px;
    line-height: 21px;
    letter-spacing: 0px;
    margin-top: 15px;
    color: rgba(255, 226, 177, 1);
  }
  .RedFull{
    opacity: 1;
    font-size: 15px;
    line-height: 21px;
    letter-spacing: 0px;
    margin-top: 0px;
    color: rgba(255, 226, 177, 1);
  }

  /*留言信息*/
  .ResInfo {
    opacity: 1;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0px;
    color: rgba(255, 226, 177, 1);
  }

  /*领取钱数*/
  .RedMoney {
    opacity: 1;
    font-size: 44px;
    line-height: 62px;
    letter-spacing: 0px;
    color: rgba(255, 226, 177, 1);
  }

  .RedMoney span {
    opacity: 1;
    font-size: 14px;
    color: rgba(255, 226, 177, 1);
    line-height: 20px;
    letter-spacing: 0px;
  }

  /*钱数走向*/
  .RedGuide {
    opacity: 1;
    font-size: 13px;
    color: rgba(157, 157, 157, 1);
    line-height: 18px;
    letter-spacing: 0px;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .RedGuide span {
    color: #0080ff;
  }

  /*下载APP*/
  .RedHref {
    opacity: 1;
    font-size: 13px;
    color: #ffffff;
    line-height: 18px;
    letter-spacing: 0px;
    background: rgba(0, 128, 255, 1);
    padding: 5px 20px;
    border-radius: 20px;
  }

  /*助推详情*/
  .BoostDet {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;

  }

  /*助推用户*/
  .BoosterNum {
    display: flex;
    flex-direction: row;
  }

  /*用户头像*/
  .BoostImg {
    margin-left: 4px;
    border-radius: 10px;
    width: 20px;
    height: 20px;
    opacity: 1;
    background: rgba(216, 216, 216, 1);
  }

  /*助推文案*/
  .BoosterText {
    opacity: 1;
    font-size: 13px;
    color: rgba(157, 157, 157, 1);
    line-height: 18px;
    letter-spacing: 0px;
    margin-left: 4px;
  }

  /*助推人数*/
  .BoosterText span {
    color: rgba(234, 77, 75, 1);
  }

  /*中部*/
  .listCenter {
    min-height: 230px;
  }

  /*金额领取详情*/
  .centerNum {
    background: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 15px;
    border-bottom: 1px solid rgba(241, 241, 241, 1)
  }
  .money_left{
    display: flex;
    flex-direction: row;
  }

  .centerNum p {
    opacity: 1;
    font-size: 13px;
    color: rgba(157, 157, 157, 1);
    line-height: 18px;
    letter-spacing: 0px;
  }

  .numLeft {
    margin-left: 20px;
  }

  /*用户领取详情*/
  .centerDet {
    background: #ffffff;
  }

  /*用户详情*/
  .DetInfo {
    border-bottom: 1px solid rgba(241, 241, 241, 1);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 15px;
    align-items: center;
  }

  /*领取用户头像*/
  .InfoImg {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .InfoImg img {
    width: 40px;
    height: 40px;
    border-radius: 5px;
  }

  /*领取用户昵称和时间*/
  .NameTime {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px;
  }

  .InfoName {
    opacity: 1;
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    line-height: 20px;
    letter-spacing: 0px;
  }

  .InfoTime {
    opacity: 1;
    font-size: 13px;
    color: rgba(157, 157, 157, 1);
    line-height: 18px;
    letter-spacing: 0px;
  }

  /*用户金额和助推领取详情*/
  .MoneyNum {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .InfoMoney {
    opacity: 1;
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    line-height: 22px;
    letter-spacing: 0px;
    font-weight: bold;
  }

  .InfoNum {
    opacity: 1;
    font-size: 13px;
    color: rgba(157, 157, 157, 1);
    line-height: 18px;
    letter-spacing: 0px;
  }

  /*版权部分*/
  .centerCopy {
    margin-bottom: 20%;
    margin-top: 1%;
  }

  .centerCopy p {
    opacity: 1;
    font-size: 13px;
    color: rgba(157, 157, 157, 1);
    line-height: 18px;
    letter-spacing: 0px;
    padding: 15px;
  }

  /*底部*/
  .BottomBtn {
    background-image: url('../../assets/shareBg.png');
    background-size: 100% 100%;
    width: 98%;
    height: 60px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin: 10px auto;
  }
  .open_btn{
    width: 60px;
  }

  .TwoText {
    padding: 5px;
    margin-right: 20px;
  }

  /*两个红包的图片*/
  .TwoRed {
    width: 80px;
    height: 80px;
    margin-top: -4%;
    position: fixed;
    bottom: 5px;
    left: 0px;
  }

  /*分享图片*/
  .TwoFx {
    position: absolute;
    /*bottom: 28px;*/
    /*width: 20px;*/
    height: 20px;
    /*right: 30px;*/
  }

  /*标题*/
  .TextTile {
    font-weight: bold;
    opacity: 1;
    font-size: 20px;
    color: rgba(255, 255, 255, 1);
    line-height: 28px;
    letter-spacing: 0px;
    padding-bottom: 3px;
  }

  .TextInfo {
    opacity: 1;
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
    line-height: 17px;
    letter-spacing: 0px;
  }

  /*灵感跳动*/
  @-webkit-keyframes bounce-up {
    25% {
      -webkit-transform: translateY(10px);
    }
    50%, 100% {
      -webkit-transform: translateY(0);
    }
    75% {
      -webkit-transform: translateY(-10px);
    }
  }

  @keyframes bounce-up {
    25% {
      transform: translateY(10px);
    }
    50%, 100% {
      transform: translateY(0);
    }
    75% {
      transform: translateY(-10px);
    }
  }

  .animate-bounce-up {
    /*-webkit-animation: bounce-up 1.4s linear infinite;*/
    /*animation: bounce-up 1.4s linear infinite;*/
    animation: breathe 1.1s infinite;
  }
  @keyframes breathe{
    0%{ transform: scale(.95); }
    50%{ transform: scale(1.05); }
    100%{ transform: scale(.95); }
  }
  /*红包规则遮罩*/
  .MaskT {
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
  }

  .MaskF {
    display: none;
  }

  /*规则头部*/
  .maskRed {
    background: #FF5A47;
    width: 90%;
    padding: 15px 0px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .maskRed img {
    width: 99px;
    height: 26px;
  }

  /*规则内容部分*/
  .maskInfo {
    background: #ffffff;
    width: 90%;
    padding: 10px 0px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    height: 300px;
    overflow: auto;
  }

  /*规则内容*/
  .infoWz {
    display: flex;
    align-items: baseline;
    justify-content: center;
    flex-direction: column;
    padding: 10px 20px;
    /*height: 300px;*/
    /*overflow:auto;*/
  }

  .infoWz p {
    display: flex;
    text-align: left;
  }

  /*规则按钮*/
  .infoBtn {
    width: 88%;
    background: red;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    height: 44px;
    opacity: 1;
    background: rgba(255, 90, 71, 1);
    border-radius: 20px;
  }

  /*规则按钮内文字*/
  .infoBtn p {
    opacity: 1;
    font-size: 18px;
    color: rgba(255, 255, 255, 1);
    line-height: 25px;
    letter-spacing: 0px;
  }

  /*规则内文字样式*/
  .WzBt {
    opacity: 1;
    font-size: 12px;
    color: rgba(48, 48, 48, 1);
    line-height: 18px;
    letter-spacing: 0px;
    font-weight: bold;
  }

  .WzNr {
    opacity: 1;
    font-size: 12px;
    color: rgba(48, 48, 48, 1);
    line-height: 18px;
    letter-spacing: 0px;
  }

  .WzTz {
    opacity: 1;
    font-size: 14px;
    color: #0080FF;
    line-height: 22px;
    letter-spacing: 0px;
  }

  /*分享按钮遮罩*/
  .ShareT {
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

  }

  .ShareF {
    display: none;
  }

  .ShareFS {
    display: none;
  }

  .ShareT img {
    width: 90%;
    /*height: 79px;*/
    position: absolute;
    top: 10px;
    right: 6px;

  }

  .ShareTS img {
    width: 90%;
    /*height: 79px;*/
    /*position: absolute;*/
    /*top: 10px;*/
    /*right: 6px;*/

  }

  /*分享回调之后遮罩*/
  .ShCallBackT {

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
  }

  .ShCallBackF {
    display: none;
  }

  /*分享回调之后遮罩的内容背景*/
  .CallSh {
    background: #ffffff;
    width: 76%;
    border-radius: 10px;
    padding: 10%;
  }

  .Call_icon {
    display: flex;
    flex-direction: row;
    justify-content: center;

  }

  .Call_icon img {
    width: 20px;
    height: 20px;
  }

  .Call_icon p {
    margin-left: 2%;
    opacity: 1;
    font-size: 18px;
    color: rgba(34, 35, 39, 1);
    line-height: 25px;
    letter-spacing: 0px;
  }

  .Call_qr {
    margin-top: 6%;
  }

  .Call_qr img {
    width: 100%;
  }

  .Call_det {
    margin-top: 2%;
    opacity: 1;
    font-size: 13px;
    color: rgba(102, 102, 102, 1);
    line-height: 18px;
    letter-spacing: 0px;
  }

  .Call_present {
    margin: 4% auto;
    width: 68%;
    opacity: 1;
    font-size: 18px;
    color: rgba(13, 13, 13, 1);
    line-height: 25px;
    letter-spacing: 0px;
  }
</style>
