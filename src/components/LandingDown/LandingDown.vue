<template>
  <div class="DownBody">
    <!--如果没有推荐人则显示-->
    <div class="noUserId" v-if="UserStatus == true">
      <img src="../../assets/down_noUserid.png"/>
    </div>
    <!--如果有推荐人则显示-->
    <div class="DownTop" v-if="UserStatus == false">
      <img src="../../assets/down_logo.png"/>
    </div>
    <div class="DownCenter" v-if="UserStatus == false">
      <div class="DownCenter_one">
        <img :src="UserHeadPicUrl" class="oneImg"/>
        <p class="oneName">{{UserNickName}}</p>
        <p class="lookId">看看ID:<span id="biao1">{{UserId}}</span></p>
        <div class="Grade">
          <img v-if="UserLevel == 0" src="../../assets/lv0.png"/>
          <img v-if="UserLevel == 1" src="../../assets/lv1.png"/>
          <img v-if="UserLevel == 2" src="../../assets/lv2.png"/>
          <img v-if="UserLevel == 3" src="../../assets/lv3.png"/>
          <img v-if="UserLevel == 4" src="../../assets/lv4.png"/>
          <img v-if="UserLevel == 5" src="../../assets/lv5.png"/>
        </div>
      </div>
      <div class="one_adv">我在看看视频赚了</div>
      <!--<div class="one_make" v-if="Money<10">我在看看视频</div>-->
      <div class="one_money"><p>{{Money}}<span>元</span></p></div>
      <div class="one_direct"> 你也来试试吧</div>
      <!--<div class="one_Invitation" v-if="Money<10">邀请你来开店赚钱</div>-->
      <div class="one_btn" @click="downApp">
        <p>下载看看视频</p>
        <img src="../../assets/down.png"/>
      </div>
    </div>
    <div class="DownBottom">
      <!--<video poster="http://static-test.kkstudy.cn/distFlie/file/ckin.jpg"-->
      <!--src="http://static-test.kkstudy.cn/distFlie/file/ckin.mp4" data-ckin="default" data-overlay="1"-->
      <!--data-title=""></video>-->
      <div id="app">
        <div class="plyr" @click="BoFang">
          <video preload="none" poster="../../assets/movie.png">
            <source :src="videourl" type="video/mp4" controls preload="auto">
            您的浏览器不支持 HTML5 视频,请更换浏览器。比如 Chrome 、 Firefox 等主流浏览器。
          </video>
        </div>
      </div>
    </div>
    <div class="activityRule" v-if="UserStatus == true">
      <div class="rules">
        <h4>活动规则</h4>
        <p>
          看看视频怎么赚钱？<br>
          1、看看小店赚钱<br>
          首次购买任意视频即可获得看看小店，同时您的小店也获得所购视频售卖权。<br>
          出售视频将直接获得返利，从您小店获取视频销售权的用户，销售视频后也将对你返利。<br>
          2、勋章分红<br>
          购买任意视频看看券，即可获得此视频勋章1枚， 勋章最大可产生看看券价格20倍的分红。<br>
          3、邀请奖励<br>
          邀请新用户成为你的徒弟，每当徒弟产生购买或销售行为时，将获得视频售价一定比例作为邀请奖励。<br>
          4、红包领不停<br>
          让好友邀请进入看看视频社区，每天都有红包雨抢不停。<br>
          看看视频怎么提现？<br>
          看看视频APP中，直接申请提现到微信零钱，方便快捷。<br>
        </p>
      </div>
      <div class="rules_btn" @click="downApp">
        <p>下载看看视频</p>
        <img src="../../assets/down.png"/>
      </div>
    </div>
  </div>
</template>

<script>
  // 引用请求后台数据的公共方法
  import api from '../../api/index'

  export default {
    name: 'LandingDown',
    components: {},
    data() {
      return {
        // 用户id
        userId: '',
        UserHeadPicUrl: '',
        UserNickName: '',
        UserId: '',
        UserLevel: '',
        Money: '',
        UserStatus: '',
        videourl: 'http://61.133.53.18/data/cdn_transfer/99/91/9996ec06155550c94e7b02214b4c1cbefa330a91.mp4'

      }
    },
    created() {
      // 获取url值开始执行
      this.UrlUserId()
      // 获取用户信息执行开始
      this.LandingDownHttp()
      // 获取累计金额开始执行
      this.LandingDownR()
      // 获取视频开始执行
      // this.LandingDownMovie()
    },
    methods: {
      // 复制到粘贴板
      copyUrl2: function () {
        let urlV = 'KanKan' + this.UserId
        var input = document.createElement("input");
        input.value = urlV;
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length), document.execCommand('Copy')
        document.body.removeChild(input);
      },
      downApp() {
        this.copyUrl2()
        window.location.href = "https://a.app.qq.com/o/simple.jsp?pkgname=com.xunlei.kankan"
      },
      // 点击播放暂停
      BoFang() {
        var video = document.querySelector('video');
        if (video.paused) {
          video.play();
        } else {
          video.pause()
        }
      },
      // 获取url的userId值
      async UrlUserId() {
        this.userId = this.$route.query.user_id || '';
        this.movieId = this.$route.query.movie_id;
      },
      // 获取用户信息
      async LandingDownHttp() {
        // 如果没有userId
        if (this.userId == '') {
          this.UserStatus = true
        } else {
          // 重定向this值
          let _this = this;
          // 传参集合
          let param = {};
          // 请求接口的后缀
          let url = '';
          // 传参值
          param["userId"] = this.userId || '';
          console.log(param)
          // 开始请求 Post方法
          api.httpGetLD(param, function (data) {
            // 返回的值
            console.log('Get请求测试');
            console.log(data);
            _this.UserId = data.data.id;
            _this.UserNickName = data.data.nickname;
            _this.UserLevel = data.data.level;
            _this.UserHeadPicUrl = data.data.localHeadPic

          }, url);
        }

      },
      // 获取累计金额
      async LandingDownR() {
        // 如果存在userid才请求金额
        if (this.userId != '') {
          // 重定向this值
          let _this = this;
          // 传参集合
          let param = {};
          // 请求接口的后缀
          let url = '';
          // 传参值
          param["userId"] = this.userId || '';
          console.log(param)
          // 开始请求 Post方法
          api.httpGetR(param, function (data) {
            // 返回的值
            console.log('Get请求测试')
            console.log(data);
            _this.Money = data.data || "**.00"
          }, url);
        }

      },
    }
  }
</script>

<style scoped>
  .one_btn img {
    width: 20px;
    margin-left: 10px;
  }

  .noUserId {
    width: 100%;
  }

  .noUserId img {
    width: 100%;
  }

  .DownBottom video {
    width: 81%;
    margin-left: 2.2rem;
    height: 10.7rem;
    margin-top: 44px;
  }

  .DownBody {
    background: #1C1C1C url("../../assets/Combined_Shape.png");
    background-size: auto 100%;
    background-repeat: repeat-x;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .DownTop img {
    width: 176px;
    height: 150px;
  }

  .DownCenter {
    background: #1C1C1C url("../../assets/down_red.png");
    width: 100%;
    background-size: 100%;
    padding: 4% 10% 20% 8%;
  }

  .DownCenter_one {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .oneImg {
    width: 30px;
    height: 30px;
  }

  .Grade {
    display: flex;
    flex-direction: row;
  }

  .Grade img {
    width: 48px;
  }

  .oneName {
    opacity: 1;
    font-size: 13px;
    color: rgba(23, 3, 5, 1);
    line-height: 18px;
    letter-spacing: 0px;
    margin-left: 2%;
  }

  .lookId {
    opacity: 1;
    font-size: 11px;
    color: rgba(23, 3, 5, 1);
    line-height: 16px;
    letter-spacing: 0px;
    margin-left: 2%;
    margin-top: 1%;
  }

  .Grade {
    margin-left: 2%;
    display: flex;
    align-items: center;
  }

  .one_adv {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 7%;
    opacity: 1;
    font-size: 15px;
    color: rgba(252, 72, 37, 1);
    line-height: 21px;
    letter-spacing: 0px;
  }

  .one_Invitation {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 4%;
    opacity: 1;
    font-size: 15px;
    color: rgba(252, 72, 37, 1);
    line-height: 21px;
    letter-spacing: 0px;
  }

  .one_make {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10%;
    opacity: 1;
    font-size: 15px;
    color: rgba(252, 72, 37, 1);
    line-height: 21px;
    letter-spacing: 0px;
  }

  .one_direct {
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    font-size: 15px;
    color: rgba(252, 72, 37, 1);
    line-height: 21px;
    letter-spacing: 0px;
  }

  .one_money {
    display: flex;
    justify-content: center;
  }

  .one_money p {
    opacity: 1;
    font-size: 44px;
    color: rgba(23, 3, 5, 1);
    line-height: 51px;
    letter-spacing: 0px;
  }

  .one_money p span {
    opacity: 1;
    font-size: 15px;
    color: rgba(252, 72, 37, 1);
    line-height: 21px;
    letter-spacing: 0px;
  }

  .one_btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #F8B54D;
    border-radius: 20px;
    opacity: 1;
    font-size: 18px;
    color: rgba(23, 3, 5, 1);
    line-height: 28px;
    letter-spacing: 0px;
    margin-top: 25%;
    padding: 6px;
  }

  .DownBottom {
    background: url("../../assets/xiaodian.png");
    width: 100%;
    background-size: 100% 100%;
    height: 20rem;
    margin-top: -4px;
  }

  /*活动规则*/
  .activityRule {
    background: #CF342D;
    background-size: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px 10px;
  }

  .rules {
    background: #f44336;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 18px 10px;
  }

  .rules h4 {
    color: #ffffff;
  }

  .rules p {
    margin-bottom: 20px;
    margin-top: 10px;
    opacity: 1;
    font-size: 13px;
    color: #F1F1F1;
    line-height: 21px;
    letter-spacing: 0px;
  }

  .rules_btn {
    width: 95%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: #F8B54D;
    border-radius: 20px;
    opacity: 1;
    font-size: 18px;
    color: rgba(23, 3, 5, 1);
    line-height: 28px;
    letter-spacing: 0px;
    padding: 6px;
    margin-top: 10px;
    position: fixed;
    bottom: 4px;
  }

  .rules_btn img {
    width: 20px;
    margin-left: 10px;
  }
</style>

