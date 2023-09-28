<template>
  <el-header>
    <div class="navigation-bar">
      <div class="left">
        <i :class="[collapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']" @click="handleClickCollapse"></i>
      </div>
      <div class="right">
        <error-log class="cheng-mr-10"></error-log>
        <el-dropdown>
          <div class="avatar-wrap">
            <el-avatar size="medium" :src="`@/assets/logo.png`"></el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item disabled>双皮奶</el-dropdown-item>
            <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script>
export default {
  name: "TopNavigationBar",
  components: {},
  props: {
    // 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
    collapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    // 切换
    handleClickCollapse() {
      this.$emit("update:collapse", !this.collapse);
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
@mixin flex-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.navigation-bar {
  @include flex-center;
  .right {
    @include flex-center;
    .avatar-wrap {
      @include flex-center;
    }
  }
}
</style>
