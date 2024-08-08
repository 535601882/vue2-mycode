export default {
  props: {
    prop: {
      type: String,
    },
  },
  data() {
    return {
      propConfig: null,
    };
  },
  computed: {
    isShow() {
      return this.propConfig && this.propConfig.isShow;
    },
  },
  created() {
    // 根据prop获取父级里对应的label值
    let parentVm = this.findParentByComponentName("AppTable");
    let item = parentVm.copyQueryMap[this.prop];
    console.log("parentVm", parentVm, item);
    this.propConfig = item;
  },
  methods: {
    findParentByComponentName(name) {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.name === name) {
          return parent;
        } else {
          parent = parent.$parent;
        }
      }
      return null;
    },
  },
  render(h) {
    return this.isShow
      ? h(
          "el-form-item",
          {
            props: {
              prop: this.prop,
              label: this.propConfig && this.propConfig.label,
            },
          },
          this.$scopedSlots.default()
        )
      : null; // 创建一个空的
  },
};
