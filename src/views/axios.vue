<!--axios测试-->
<template>
  <div>
    <water-mark inputDestroy></water-mark>
    <el-button type="primary" @click="handleClick">发送请求</el-button>
    <el-button type="primary" @click="handleTimeOut">失效</el-button>
    <hr />
    <h1>router</h1>
    <el-button type="primary" @click="handleAddRouterClick">添加一个新路由</el-button>
    <el-button type="primary" @click="handleGetRouterClick">获取当前路由列表</el-button>
  </div>
</template>

<script>
export default {
  name: "axios",
  components: {},
  data() {
    return {};
  },
  computed: {},
  created() {
    this.handleClick();
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
  },
  mounted() {},
};
</script>

<style scoped lang="scss"></style>
