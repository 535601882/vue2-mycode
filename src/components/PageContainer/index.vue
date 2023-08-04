<template>
  <div class="container-full">
    <div v-if="$slots.header" class="container-full__header" ref="header">
      <slot name="header" />
    </div>
    <div class="container-full__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="container-full__footer" ref="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: `PageContainer`,
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
// 填充式布局组件
.container-full {
  width: 100%;
  position: absolute;
  top: 0px;
  right: 20px;
  bottom: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .container-full__header {
    padding: 20px;
  }
  .container-full__body {
    flex-grow: 1;
    // padding: 20px 20px;
    overflow: auto;
    position: relative;
  }
  .container-full__footer {
    padding: 20px;
  }
}
</style>
