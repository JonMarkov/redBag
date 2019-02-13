<template>
  <div>

  </div>
</template>

<script>
  export default {
    name: 'ground',
    components: {},
    data() {
      return {}
    },
    // 进入页面开始调用 （async用于声明一个函数是异步的）
    created() {
      // 把获取到的code值写入本地缓存函数执行
      this.UrlCode()
      // 跳转授权函数执行
      this.goToJump()
    },
    methods: {
      // 获取url的Code值，并写入缓存定义
      UrlCode(){
        this.code = this.$route.query.code;
        this.referCode = this.$route.query.referCode || '';
      },
      // 跳转授权函数定义
      goToJump() {
        var currentDomain = this.getDomain();
        var appid = process.env.WECHAT_APPID;
        var wechatUrl = process.env.WECHAT_AUTH;
        var redirectUri = encodeURI(process.env.REDIRECT_URI);
        var end = "#wechat_redirect";
        var state = "";
        if(this.referCode!=""){
            state = currentDomain + "/index?code=" + this.code + "_" + this.referCode + '';
        }else{
            state = currentDomain + "/index?code=" + this.code;
        }
        state = encodeURI(state)
        const params = {
          "appid":appid,
          "redirect_uri":redirectUri,
          "response_type":"code",
          "scope":"snsapi_userinfo",
          "state":state,
        }
        var query = this.encodeSearchParams(params);
        var url = wechatUrl.concat("?",query,end)
        window.location.href = url;
      },
      getDomain(){
        var protocal = document.location.protocol;
        var host = document.location.host;
        return protocal+"//"+host
      },
      encodeSearchParams(obj) {
        const params = []
        Object.keys(obj).forEach((key) => {
          let value = obj[key]
          // 如果值为undefined我们将其置空
          if (typeof value === 'undefined') {
            value = ''
          }
          // 对于需要编码的文本（比如说中文）我们要进行编码
          params.push([key, encodeURIComponent(value)].join('='))
        })

        return params.join('&')
      }
    }
  }
</script>

<style scoped>

</style>
