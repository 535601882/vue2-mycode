<template>
  <div class="app-table">
    <div class="app-search">
      <div class="app-search-from-wrap">
        <el-form class="app-search-from" ref="form" :model="form" label-width="80px">
          <slot name="search" :queryForm="form">
            <!--搜索条件-->
          </slot>
        </el-form>
        <el-dropdown trigger="click" :hide-on-click="false">
          <span class="el-dropdown-link">
            <i class="el-icon-s-grid"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in copyQuery" :key="item.prop">
              <el-checkbox v-model="item.isShow">{{ item.label }}</el-checkbox>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="app-search-btn">
        <slot name="search-btn">
          <!--查询按钮-->
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="default" @click="handleReset">重置</el-button>
          <slot name="search-btn-suffix">
            <!--查询按钮-->
          </slot>
        </slot>
      </div>
    </div>
    <div class="tools">
      <div v-if="type">
        已选择 {{ selectLength }} 条
        <el-button type="primary" @click="handleClearSelect">清除选择</el-button>
      </div>
      <el-dropdown trigger="click" :hide-on-click="false">
        <span class="el-dropdown-link">
          <i class="el-icon-s-grid"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in copyColumns" :key="item.prop">
            <el-checkbox v-model="item.isShow">{{ item.label }}</el-checkbox>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table ref="table" :data="tableData" :row-key="rowKey" v-bind="tableAttrs" @selection-change="handleSelectionChange">
      <el-table-column v-if="type" :reserve-selection="true" type="selection" width="55"> </el-table-column>
      <!--操作-->
      <slot name="column_wrap__control">
        <el-table-column label="操作" v-if="$slots['column_wrap__control'] || $slots['column_inner__control']">
          <template slot-scope="scope">
            <slot name="column_inner__control" :index="scope.$index" :row="scope.row"></slot>
          </template>
        </el-table-column>
      </slot>
      <!--列-->
      <template v-for="item in columnsFilter">
        <slot :name="'column_wrap_' + item.prop">
          <el-table-column :key="item.prop || item.label" :prop="item.prop" :label="item.label" v-bind="item">
            <template slot-scope="scope">
              <slot v-if="$slots['column_inner_' + item.prop]" :index="scope.$index" :name="'column_inner_' + item.prop" :row="scope.row"></slot>
              <div v-else>{{ scope.row[item.prop] }}</div>
            </template>
          </el-table-column>
        </slot>
      </template>
    </el-table>
    <!--分页-->
    <slot name="pagination">
      <el-pagination v-if="paging" @size-change="handleSizeChange" @current-change="handleCurrentChange" v-bind="paging"> </el-pagination>
    </slot>
  </div>
</template>

<script>
export default {
  name: `AppTable`,
  props: {
    // 选择类型 checkbox 、 radio
    type: {
      type: String,
      default: null,
    },
    // 搜索条件
    query: {
      type: Array,
      default() {
        return [];
      },
    },
    // 表格字段
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    // 表格值
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    // 表格属性
    tableAttrs: {
      type: Object,
      default() {
        return {};
      },
    },
    // 分页
    paging: {
      type: Object,
      default() {
        // pageSize: null,
        // total: null,
        // currentPage: 1,
        return {};
      },
    },
    rowKey: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      // 重命名
      copyQuery: [],
      copyColumns: [],
      selectionData: [],
      form: {},
    };
  },
  computed: {
    // 已选择长度
    selectLength() {
      return this.selectionData.length;
    },
    // 筛选展示的字段
    columnsFilter() {
      return this.copyColumns.filter((item) => item.isShow === true);
    },
    // 定义query索引
    copyQueryMap() {
      return this.copyQuery.reduce((obj, item) => {
        obj[item.prop] = item;
        return obj;
      }, {});
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.paging.pageSize = val;
      this.$emit("pageChange", this.paging);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.paging.currentPage = val;
      this.$emit("pageChange", this.paging);
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.selectionData = val;
      this.$emit("selectionChange", val);
    },
    // 获取已选择数据
    getSelectedData() {
      return this.selectionData;
    },
    handleClearSelect() {
      this.$refs.table.clearSelection();
    },
    // 获取查询条件参数
    getQueryParames() {
      let obj = {};
      for (let key in this.form) {
        if (this.copyQueryMap[key].isShow) {
          obj[key] = this.form[key];
        }
      }
      return obj;
    },
    // 搜索
    handleSearch() {
      this.paging.currentPage = 1; // 重置为第一页
      this.$emit("pageChange", this.paging);
    },
    // 重置
    handleReset() {
      this.$refs.form.resetFields();
    },
  },
  watch: {
    columns: {
      handler(newColumns) {
        this.copyColumns = newColumns.map((item) => ({
          ...item,
          // eslint-disable-next-line no-prototype-builtins
          isShow: item.hasOwnProperty("isShow") ? item.isShow : true, // 默认展示
        }));
      },
      deep: true,
      immediate: true,
    },
    query: {
      handler(newQuery) {
        this.copyQuery = newQuery.map((item) => {
          this.$set(this.form, item.prop, item.value || null);
          return {
            ...item,
            // eslint-disable-next-line no-prototype-builtins
            value: item.hasOwnProperty("value") ? item.value : null, // 默认展示配置项自定义的值
            // eslint-disable-next-line no-prototype-builtins
            isShow: item.hasOwnProperty("isShow") ? item.isShow : true, // 默认展示
          };
        });
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.app-table {
  .tools {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .app-search {
    display: flex;
    flex-direction: column;
  }
  .app-search-from,
  .app-search-from-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
