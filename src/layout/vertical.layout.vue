<template>
  <el-container>
    <el-header>
      <recursive-menu :menu-items="menus" :active-index="activeIndex" @onSelect="handleSelectMenu" mode="horizontal"></recursive-menu>
    </el-header>
    <el-main>
      <slot></slot>
    </el-main>
  </el-container>
</template>
<script>
import RecursiveMenu from "./component/RecursiveMenu.vue";
export default {
  components: {
    RecursiveMenu,
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
      ],
      activeIndex: "/",
    };
  },
  created() {
    console.log("vertical.layout");
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
