<template>
  <div>
    {{ $route.query }}

    {{ res }}
  </div>
</template>

<script>
import wx from "weixin-js-sdk";
export default {
  name: "index",
  components: {},
  data() {
    return {
      res: null,
    };
  },
  computed: {},
  created() {
    if (this.$utils.isInWeChat()) {
      /**
       * 为了避免刷新页面导致再次利用code请求AccessToken
       * 1.将首次获取到的access_token和openid进行缓存，刷新页面时先检查缓存中是否有值，有值直接返回不再进行调用
       * 2.获取成功之后将url中的code剔除
       */
      this.getWeixinAccessToken();
      this.getJsApiData();
    }
  },
  methods: {
    getWeixinAccessToken() {
      // eslint-disable-next-line no-unused-vars
      let { code, state } = this.$route.query;
      this.$api.weChatApi.getWeixinAccessToken({ code }).then((res) => {
        console.log(res);
        if (!res.errcode) {
          this.$api.weChatApi.getWeixinUserinfo(res).then((res) => {
            console.log(res);
          });
        }
        this.res = res;
      });
    },
    getJsApiData() {
      this.$api.weChatApi
        .getJsApiData({
          href: window.location.href,
        })
        .then((res) => {
          console.log("res", res);
          this.$message.success("getJsApiData 获取成功");
          wx.config({
            debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appId, // 必填，公众号的唯一标识
            timestamp: res.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.nonceStr, // 必填，生成签名的随机串
            signature: res.signature, // 必填，签名
            jsApiList: ["updateAppMessageShareData", "getLocation"], // 必填，需要使用的JS接口列表
          });

          wx.ready(function () {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            console.log("wx.config ready");

            wx.updateAppMessageShareData({
              title: "测试", // 分享标题
              desc: "描述", // 分享描述
              link: "http://192.168.14.254/wechat", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: "", // 分享图标
              success: function () {
                // 设置成功
                console.log("分享成功");
              },
            });

            wx.getLocation({
              type: "wgs84", // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
              success: function (res) {
                console.log("获取地理位置接口", res);
              },
            });
          });

          wx.error(function (res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            console.log("wx.config 报错", res);
          });
        });
    },
    // 获取支付信息
    callPay() {
      // 創建訂單
      let promise = this.$api.wechatPay.createOrder({});
      promise.then((res) => {
        this.wechatPay(res);
      });
    },
    // 微信公众号支付
    wechatPay(obj) {
      function onBridgeReady() {
        // eslint-disable-next-line no-undef
        WeixinJSBridge.invoke(
          "getBrandWCPayRequest",
          {
            appId: obj.appId, //公众号ID，由商户传入
            timeStamp: obj.timeStamp, //时间戳，自1970年以来的秒数
            nonceStr: obj.nonceStr, //随机串
            package: obj.package, // 订单详情扩展字符串
            signType: obj.signType, //微信签名方式：
            paySign: obj.paySign, //微信签名
          },
          function (res) {
            // eslint-disable-next-line no-undef
            WeixinJSBridge.log(res.err_msg);
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            }
          }
        );
      }
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
          document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss"></style>
