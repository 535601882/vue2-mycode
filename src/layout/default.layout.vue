<template>
  <el-container class="full-height">
    <el-aside :width="isCollapse ? '64px' : '200px'" style="overflow: visible">
      <recursive-menu :menu-items="menus" :active-index="activeIndex" @onSelect="handleSelectMenu" :collapse="isCollapse"></recursive-menu>
    </el-aside>
    <el-container direction="vertical">
      <TopNavigationBar :collapse.sync="isCollapse"></TopNavigationBar>
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
import TopNavigationBar from "./component/TopNavigationBar";
import menu from "./menu";
export default {
  components: {
    RecursiveMenu,
    tabs,
    TopNavigationBar,
  },
  data() {
    return {
      menus: menu,
      activeIndex: "/",
      isCollapse: false, // 是否折叠
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
