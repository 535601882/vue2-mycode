<template>
  <div :class="`pagination ${marginTop ? 'cheng-mt-10' : ''}`">
    <el-pagination
      background
      :pager-count="pagerCount"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      :total="total"
      :disabled="pageDisabled"
      :hide-on-single-page="hideSinglePage"
      :page-sizes="tuneUp ? [10, 20, 30] : []"
      :layout="tuneUp ? 'sizes, prev, pager, next' : 'prev, pager, next'"
      @size-change="doSizeChange"
      @current-change="doCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "pagination",
  props: {
    marginTop: {
      type: Boolean,
      default: false,
    },
    pagerCount: {
      type: Number,
      default: 5,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageDisabled: {
      type: Boolean,
      default: false,
    },
    hideSinglePage: {
      type: Boolean,
      default: true,
    },
    // 调整每页展示个数
    tuneUp: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    doCurrentChange(val) {
      this.$emit("doCurrentChange", val);
    },
    doSizeChange(val) {
      this.$emit("doSizeChange", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: flex-end;
}
.is-margin-top {
  margin-top: 15px;
}
</style>
<style>
.pagination.is-margin-top .el-pagination.is-background .el-pager li {
  margin: 0px;
}
</style>
