<template>
  <div>
    <el-button type="primary" @click="handleRest">取消</el-button>
    <el-button type="primary" @click="handleSave">保存</el-button>
    <el-button type="primary" @click="handleClick">添加</el-button>
    <div class="">
      <grid-layout
        :layout.sync="items"
        :col-num="12"
        :row-height="30"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :preventCollision="false"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
        <grid-item v-for="item in items" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.i">
          {{ item.name }}
          <component :is="item.name" />
        </grid-item>
      </grid-layout>

      <hr />
      <form-config-provider></form-config-provider>
    </div>
  </div>
</template>
<script>
import VueGridLayout from "vue-grid-layout";

const comp1 = {
  template: `<div>组件1</div>`,
};
const comp2 = {
  template: `<div>组件2</div>`,
};
const comp3 = {
  template: `<div>组件3</div>`,
};
export default {
  name: "GridDashBoard",
  props: {},
  components: {
    comp1,
    comp2,
    comp3,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
  data() {
    return {
      grid: null,
      items: [
        {
          i: "0",
          w: 2,
          name: "comp1",
          x: 0,
          y: 0,
          h: 1,
        },
        {
          i: "1",
          w: 2,
          name: "comp2",
          x: 2,
          y: 0,
          h: 1,
          isDraggable: false,
        },
        {
          i: "2",
          w: 2,
          name: "comp3",
          x: 4,
          y: 0,
          h: 1,
          isResizable: false,
        },
        {
          i: "3",
          w: 2,
          name: "comp1",
          x: 6,
          y: 0,
          h: 1,
        },
        {
          i: "4",
          w: 2,
          name: "comp2",
          x: 8,
          y: 0,
          h: 1,
        },
        {
          i: "5",
          w: 2,
          name: "comp3",
          x: 10,
          y: 0,
          h: 1,
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    handleClick() {},
    handleRest() {},
    handleSave() {},
  },
};
</script>
<style lang="scss" scope>
.vue-grid-layout {
  background: #eee;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}

.vue-grid-item .resizing {
  opacity: 0.9;
}

.vue-grid-item .static {
  background: #cce;
}

.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}

.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}

.vue-grid-item .minMax {
  font-size: 12px;
}

.vue-grid-item .add {
  cursor: pointer;
}

.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
    no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
