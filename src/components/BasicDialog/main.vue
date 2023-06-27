<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" @close="handleCloseDialogCallback" :custom-class="customClass">
    <slot></slot>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "basic-dialog",
  data() {
    return {
      dialogVisible: this.visible,
    };
  },
  props: {
    title: {
      type: String,
      default: "title",
    },
    customClass: {
      type: String,
      default: "small-dialog",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    //取消事件
    handleCancel() {
      this.dialogVisible = false;
      this.$emit("on-close");
    },
    //确定事件
    handleSubmit() {
      let closeDialogFlag = true;
      this.$emit("on-submit");
      if (closeDialogFlag) {
        this.dialogVisible = false;
      }
    },
    //关闭dialog的回调函数
    handleCloseDialogCallback() {
      this.updateDialogVisible();
    },
    //更新父组件的值
    updateDialogVisible() {
      this.$emit("update:visible", false);
    },
  },
  watch: {
    visible() {
      this.dialogVisible = this.visible;
    },
  },
};
</script>
