<template>
  <el-table :data="logReverse" border stripe style="width: 100%" size="mini">
    <el-table-column type="expand">
      <div slot-scope="props" class="error-log-list__expand-group">
        <expand-item :type="props.row.type" title="类型" :value="props.row.type === 'log' ? '日志' : '异常'" />
        <expand-item :type="props.row.type" title="内容" :value="props.row.info" />
        <expand-item v-if="props.row.type === 'error'" type="error" title="报错组件" :value="get(props.row.vm, '$vnode.tag', '')" />
        <expand-item v-if="props.row.type === 'error'" type="error" title="错误名称" :value="get(props.row.err, 'name', '')" />
        <expand-item v-if="props.row.type === 'error'" type="error" title="错误信息" :value="get(props.row.err, 'message', '')" />
        <expand-item v-if="props.row.type === 'error'" type="error" title="错误堆栈" value="见下">
          <div style="overflow: auto">
            <pre>{{ stackBeautify(props.row.err) }}</pre>
          </div>
        </expand-item>
        <expand-item :type="props.row.type" title="用户名" :value="get(props.row.user, 'name', '')" />
        <expand-item :type="props.row.type" title="uuid" :value="props.row.uuid" />
        <expand-item :type="props.row.type" title="token" :value="props.row.token" />
        <expand-item :type="props.row.type" title="页面地址" :value="props.row.url" />
        <expand-item :type="props.row.type" title="时间" :value="props.row.time" />
      </div>
    </el-table-column>

    <el-table-column
      prop="type"
      label="类型"
      width="80px"
      align="center"
      :filters="[
        { text: '日志', value: 'log' },
        { text: '异常', value: 'error' },
      ]"
      :filter-multiple="false"
      :filter-method="filterType"
      filter-placement="bottom"
    >
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type === 'error'" size="mini" type="danger"> <i class="el-icon-error" /> Bug </el-tag>
        <el-tag v-else size="mini" type="info"> <i class="el-icon-warning" /> Log </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="地址" prop="url" width="140px" :show-overflow-tooltip="true"> </el-table-column>

    <el-table-column label="内容" prop="info" :show-overflow-tooltip="true"> </el-table-column>

    <el-table-column label="错误类型" width="140px" :show-overflow-tooltip="true">
      <template slot-scope="scope">
        {{ get(scope.row.err, "name", "") }}
      </template>
    </el-table-column>

    <el-table-column label="错误信息" width="300px">
      <template slot-scope="scope">
        {{ get(scope.row.err, "message", "") }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from "vuex";
import { get } from "lodash";
import ExpandItem from "./ExpandItem";
export default {
  name: "error-log-list",
  components: {
    ExpandItem,
  },
  computed: {
    ...mapState({
      logList: (state) => state.log.list,
    }),
    logReverse() {
      // 直接 reverse 的话有点问题
      const res = [];
      const loglength = this.logList.length;
      this.logList.forEach((log, index) => {
        res.push(this.logList[loglength - 1 - index]);
      });
      return res;
    },
  },
  methods: {
    get,
    filterType(value, row) {
      return row.type === value;
    },
    stackBeautify(err) {
      if (!err) {
        return "";
      }
      return err.stack;
    },
  },
};
</script>
