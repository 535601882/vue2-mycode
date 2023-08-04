<template>
  <div class="error-log-list__expand" :class="className">
    <p class="error-log-list__expand-title">{{ title }}</p>
    <p class="error-log-list__expand-value">{{ value === "" ? "无数据" : value }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      default: "log",
    },
    title: {
      default: "",
    },
    value: {
      default: "",
    },
  },
  computed: {
    className() {
      return this.type === "log" ? "error-log-list__expand--log" : "error-log-list__expand--error";
    },
  },
};
</script>
<style lang="scss" scoped>
.error-log-list__expand {
  padding-left: 20px;
  margin-bottom: 10px;

  &:last-child {
    margin-bottom: 0px;
  }

  .error-log-list__expand-title {
    font-size: 16px;
    font-weight: bold;
    margin-top: 0px;
    margin-bottom: 10px;
  }

  .error-log-list__expand-value {
    font-size: 12px;
    margin-top: 0px;
    margin-bottom: 0px;
  }
}
.error-log-list__expand--log {
  border-left: 4px solid $color-warning;
}

.error-log-list__expand--error {
  border-left: 4px solid $color-danger;
}
</style>
