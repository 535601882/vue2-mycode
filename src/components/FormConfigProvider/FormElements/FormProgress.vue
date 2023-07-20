<template>
  <el-progress :percentage="percent"></el-progress>
</template>
<script>
export default {
  name: "form-progress",
  inject: ["formState"],
  computed: {
    percent() {
      return Math.floor((this.formState.activeField / this.formState.formLength) * 100);
    },
  },
};
</script>
