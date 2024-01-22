<template>
  <div>
    <el-table :data="table.data" v-bind="table.attrs" style="width: 100%">
      <el-table-column v-for="item in columnsFilter" :key="item.prop || item.label" v-bind="item">
        <template v-if="$slots[item.prop]" slot-scope="scope">
          <slot :index="scope.$index" :name="item.prop" :row="scope.row"> </slot>
        </template>
        <template v-else-if="item.prop === '__control'" slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
        <!--操作-->
        <template v-else-if="item.prop === '__control'" slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
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
          columns: [],
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
    return {
      columnsCheck: [], // 选中的数据
    };
  },
  computed: {
    // 筛选展示的字段
    columnsFilter() {
      if (!this.columnsCheck?.length) {
        return this.table.columns;
      } else {
        return this.table.columns.filter((item) => {
          return this.columnsCheck.includes(item.prop || item.type);
        });
      }
    },
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
