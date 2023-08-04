<template>
  <div>
    <el-tooltip effect="dark" :content="tooltipContent" placement="bottom">
      <el-button type="text" @click="handleClick">
        <el-badge v-if="logLength > 0" :max="99" :value="logLengthError" :is-dot="logLengthError === 0">
          <i :class="logLengthError === 0 ? 'el-icon-warning' : 'el-icon-error'" style="font-size: 20px" />
        </el-badge>
        <i class="el-icon-warning" v-else name="dot-circle-o" style="font-size: 20px" />
      </el-button>
    </el-tooltip>

    <el-dialog :title="tooltipContent" :fullscreen="true" :visible.sync="dialogVisible" :append-to-body="true">
      <div class="cheng-mb-10">
        <el-button type="danger" size="mini" @click="handleLogClean">
          <i class="el-icon-delete" />
          清空
        </el-button>
      </div>
      <error-log-list />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ErrorLogList from "./components";
export default {
  components: {
    ErrorLogList,
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      logLength: "log/length",
      logLengthError: "log/lengthError",
    }),
    tooltipContent() {
      return this.logLength === 0
        ? "没有日志或异常"
        : `${this.logLength} 条日志${this.logLengthError > 0 ? ` | 包含 ${this.logLengthError} 个异常` : ""}`;
    },
  },
  methods: {
    ...mapMutations("log", ["clean"]),
    handleClick() {
      if (this.logLength > 0) {
        this.dialogVisible = true;
      }
    },
    handleLogClean() {
      this.dialogVisible = false;
      this.clean();
    },
  },
};
</script>
