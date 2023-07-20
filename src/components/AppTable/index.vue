<template>
  <div>
    <el-table :data="table.data" v-bind="table.attrs" style="width: 100%">
      <slot></slot>
    </el-table>
    <slot name="pagination">
      <el-pagination v-if="paging" @size-change="handleSizeChange" @current-change="handleCurrentChange" v-bind="paging"> </el-pagination>
    </slot>
  </div>
</template>

<script>
export default {
  name: `AppTable`,
  props: {
    table: {
      type: Object,
      default() {
        return {
          data: [],
          attrs: {},
        };
      },
    },
    paging: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    handleSizeChange() {},
    handleCurrentChange() {},
  },
};
</script>

<style lang="scss" scoped></style>
