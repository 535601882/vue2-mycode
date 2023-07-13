<template>
  <el-submenu v-if="item.children && item.children.length" :index="item.path" :key="item.path" :popper-append-to-body="false">
    <template slot="title">
      <!-- 显示菜单项的标题 -->
      <span>{{ item.title }}</span>
    </template>
    <!-- 递归渲染子菜单项 -->
    <RecursiveMenuItem v-for="item in item.children" :item="item" :key="item.path" :active-index="activeIndex" />
  </el-submenu>
  <el-menu-item v-else :index="item.path">
    <!-- 显示菜单项的标题 -->
    <span>{{ item.title }}</span>
  </el-menu-item>
</template>

<script>
export default {
  name: "RecursiveMenuItem",
  props: {
    item: {
      type: Object,
      required: true,
    },
    activeIndex: {
      type: String,
      default: "",
    },
  },
  components: {},
};
</script>
