<template>
  <el-menu :default-active="activeIndex" class="recursive-menu" @select="handleSelect" :mode="mode" v-bind="$attrs" :collapse="collapse">
    <template v-for="item in menuItems">
      <recursive-menu-item :item="item" :key="item.path" :activeIndex="activeIndex"></recursive-menu-item>
    </template>
  </el-menu>
</template>

<script>
import RecursiveMenuItem from "./RecursiveMenuItem.vue";

export default {
  name: "RecursiveMenu",

  components: {
    RecursiveMenuItem,
  },
  props: {
    menuItems: {
      type: Array,
      required: true,
    },
    activeIndex: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      default: "vertical", //horizontal / vertical
    },
    // 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
    collapse: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);

      this.$emit("onSelect", key);
    },
  },
};
</script>
