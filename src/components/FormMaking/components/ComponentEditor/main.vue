<template>
  <div class="widget-tools" :class="{ active }">
    <div class="widget-view-action" v-if="active">
      <i class="iconfont icon-icon_clone el-icon-document-copy" @click.stop="emitAction('clone')"></i>
      <i class="iconfont icon-trash el-icon-delete" @click.stop="emitAction('delete')"></i>
    </div>

    <div class="widget-view-drag" v-if="active">
      <i class="iconfont icon-drag drag-widget el-icon-rank"></i>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ComponentEditor",
  props: {
    index: {
      type: Number,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    emitAction(actionName) {
      this.$emit("action", {
        name: actionName,
        data: {
          index: this.index,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.widget-tools {
  position: relative;
  border: 1px dashed rgba(170, 170, 170, 0.7);
  background-color: rgba(236, 245, 255, 0.3);
  margin: 2px;
  .widget-view-action {
    position: absolute;
    right: 0;
    bottom: 0;
    height: 28px;
    line-height: 28px;
    background: $primary-color;
    z-index: 9;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: pointer;
    }
  }

  .widget-view-drag {
    position: absolute;
    left: -2px;
    top: -2px;
    bottom: -18px;
    height: 28px;
    line-height: 28px;
    background: $primary-color;
    z-index: 9;
    // display: none;

    i {
      font-size: 14px;
      color: #fff;
      margin: 0 5px;
      cursor: move;
    }
  }

  &:after {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: block;
  }

  &:hover {
    background: $primary-background-color;
    outline: 1px solid $primary-color;
    outline-offset: 0px;

    &.active {
      outline: 2px solid $primary-color;
      border: 1px solid $primary-color;
      outline-offset: -1px;
    }

    .widget-view-drag {
      display: block;
    }
  }

  &.active {
    outline: 2px solid $primary-color;
    border: 1px solid $primary-color;
    outline-offset: -1px;
  }

  &.ghost {
    background: #f56c6c;
    border: 2px solid #f56c6c;
    outline-width: 0;
    height: 3px;
    box-sizing: border-box;
    font-size: 0;
    content: "";
    overflow: hidden;
    padding: 0;
  }
  &:deep .el-form-item {
    margin-bottom: 0;
  }
}
</style>
