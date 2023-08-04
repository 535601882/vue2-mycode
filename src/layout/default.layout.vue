<template>
  <el-container class="full-height">
    <el-aside width="200px">
      <recursive-menu :menu-items="menus" :active-index="activeIndex" @onSelect="handleSelectMenu"></recursive-menu>
    </el-aside>
    <el-container direction="vertical">
      <el-header>
        <error-log></error-log>
      </el-header>
      <div class="main-layout">
        <tabs></tabs>
        <el-main class="position-r overflow-hidden">
          <slot></slot>
        </el-main>
      </div>
    </el-container>
  </el-container>
</template>
<script>
import RecursiveMenu from "./component/RecursiveMenu.vue";
import tabs from "./component/tabs";
export default {
  components: {
    RecursiveMenu,
    tabs,
  },
  data() {
    return {
      menus: [
        {
          title: "首页1",
          path: "/",
          icon: "el-icon-location",
          children: [
            {
              title: "首页1 1",
              path: "/about11",
              icon: "el-icon-location",
              children: [],
            },
            {
              title: "首页1 2",
              path: "/about12",
              icon: "el-icon-location",
              children: [
                {
                  title: "首页1 2 1",
                  path: "/about121",
                  icon: "el-icon-location",
                  children: [
                    {
                      title: "首页1 2 1 1",
                      path: "/about1211",
                      icon: "el-icon-location",
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: "首页2",
          path: "/about",
          icon: "el-icon-location",
          children: [
            {
              title: "首页2 1",
              path: "/about21",
              icon: "el-icon-location",
              children: [],
            },
          ],
        },
        {
          title: "home",
          path: "/home",
          icon: "el-icon-location",
          children: [],
        },
        {
          title: "测试axios",
          path: "/axios",
          icon: "el-icon-location",
          children: [],
        },
        {
          title: "测试router",
          path: "/router",
          icon: "el-icon-location",
          children: [],
        },
        {
          title: "测试form",
          path: "/form",
          icon: "el-icon-location",
          children: [],
        },
        {
          title: "grid-dash-board",
          path: "/grid-dash-board",
          icon: "el-icon-location",
          children: [],
        },
        {
          title: "gsapPage",
          path: "/gsap-page",
          icon: "el-icon-location",
          children: [],
        },
        {
          title: "threeJs",
          path: "/three-js",
          icon: "el-icon-location",
          children: [],
        },
        {
          title: "log",
          path: "/log",
          icon: "el-icon-location",
          children: [],
        },
      ],
      activeIndex: "/",
    };
  },
  created() {
    console.log("default.layout");
  },
  methods: {
    handleSelectMenu(path) {
      this.$router.push({
        path,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
}
</style>
