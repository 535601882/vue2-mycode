<!--axios测试-->
<template>
  <PageContainer>
    <water-mark inputDestroy></water-mark>
    <el-button type="primary" @click="handleClick">发送请求</el-button>
    <el-button type="primary" @click="handleTimeOut">失效</el-button>
    <hr />
    <h1>router</h1>
    <el-button type="primary" @click="handleAddRouterClick">添加一个新路由</el-button>
    <el-button type="primary" @click="handleGetRouterClick">获取当前路由列表</el-button>
    <hr />
    <DemoComp>112</DemoComp>
    <el-button type="primary" @click="goPage(1)">跳转1</el-button>
    <el-button type="primary" @click="goPage(2)">跳转2</el-button>
    <HelloWorld msg="axios hello world"></HelloWorld>
  </PageContainer>
</template>

<script>
export default {
  name: "axios",
  components: {},
  data() {
    return {};
  },
  props: ["params"],
  computed: {},
  created() {
    this.handleClick();
    console.log("axios page created", this.params);
  },
  methods: {
    handleClick() {
      this.$api.baseApi.getApiSuccess({ name: 1 }).then(() => {
        console.log("getApiSuccess 1 成功");
      });
      this.$api.baseApi.getApiSuccess({ name: 2 }).then(() => {
        console.log("getApiSuccess 2 成功");
      });
      this.$api.baseApi.getApiSuccess({ name: 3 }).then(() => {
        console.log("getApiSuccess 3 成功");
      });
      this.$api.baseApi.getApiSuccess({ name: 4 }).then(() => {
        console.log("getApiSuccess 4 成功");
      });
    },
    handleTimeOut() {
      this.$store.commit("auth/setToken");
      this.handleClick();
    },
    // router
    handleAddRouterClick() {
      this.$router.addRoute("Layout", {
        path: "/router",
        name: "Router",
        component: () => import("@/views/Router/index"),
      });
    },
    handleGetRouterClick() {
      console.log(this.$router.getRoutes(), this.$router);
    },
    goPage(num) {
      this.$router.push({
        name: "Axios",
        query: {
          name: num,
        },
      });
    },
  },
  mounted() {},
  watch: {
    $route(e, t) {
      console.log("axios watch $route", e, t);
    },
  },
  beforeRouteEnter(to, from, next) {
    console.log("axios beforeRouteEnter", to, from);
    next();
  },
  beforeRouteUpdate(to, from, next) {
    console.log("axios beforeRouteUpdate", to, from);
    next();
  },
  beforeRouteLeave(to, from, next) {
    console.log("axios beforeRouteLeave", to, from);
    next();
  },
};
</script>

<style scoped lang="scss"></style>
