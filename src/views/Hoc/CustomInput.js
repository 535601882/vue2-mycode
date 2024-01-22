import BaseInput from "./BaseInput";
// import Console from "./Console";
// export default Console(BaseInput);
console.log("BaseInput", BaseInput);
export default {
  name: "CustomInput",
  components: {
    BaseInput,
  },
  props: BaseInput.props,
  render(h) {
    console.log("this.$scopedSlots 1", this.$scopedSlots, this.$slots);
    return h(
      BaseInput,
      {
        attrs: this.$attrs,
        on: this.$listeners,
        props: this.$props,
        scopedSlots: this.$scopedSlots,
      },
      Object.keys(this.$slots).map((slotName) => {
        return h(
          "template",
          {
            slot: slotName,
          },
          this.$slots[slotName]
        );
      })
    );
  },
};
