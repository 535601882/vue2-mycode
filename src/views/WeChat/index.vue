<template>
  <div>
    {{ $route.query }}

    {{ res }}
  </div>
</template>

<script>
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

          setTimeout(() => {
            this.$api.weChatApi.getWeixinUserinfo(res).then((res) => {
              console.log(res);
            });
          }, 10000);
        }
        this.res = res;
      });
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss"></style>
