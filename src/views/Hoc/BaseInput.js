export default {
  name: "BaseInput",
  props: ["value", "placeholder"],
  data() {
    return {
      config: {
        name: "名称",
      },
    };
  },
  directives: {
    focus: {
      // 指令的定义
      inserted: function (el, binding, vnode) {
        console.log("el, binding, vnode", el, binding, vnode, vnode.context);
        el.focus();
        setTimeout(() => {
          vnode.context.$emit("input", "222");
        }, 5000);

        let unwatch = vnode.context.$watch(binding.expression, function (newVal, oldVal) {
          console.log(newVal, oldVal);
          //Do something
        });
        if (!vnode.context["unwatch"]) vnode.context["unwatch"] = unwatch;

        // el.addEventListener("hello", function (event) {
        //   alert(event.detail.name);
        // });

        // let eventFn = new CustomEvent("hello", {
        //   detail: {
        //     name: "John",
        //   },
        // });

        // el.addEventListener("click", function (event) {
        //   console.log(event);

        //   el.dispatchEvent(eventFn);
        // });
      },
      // unbind: function (el, binding, vnode) {
      //   vnode.context.unwatch();
      // },
    },
  },
  render(h) {
    console.log("this.$scopedSlots 2", this.$scopedSlots, this.$slots);
    return h(
      "div",
      {
        class: "base-input",
      },
      [
        h(
          "span",
          {
            class: "prefix",
          },
          this.$scopedSlots.prefix
            ? this.$scopedSlots.prefix({
                config: this.config,
              })
            : null
        ),
        h("input", {
          attrs: {
            value: this.value,
            placeholder: this.placeholder,
          },
          on: {
            input: (e) => this.$emit("input", e.target.value),
          },
          directives: [
            {
              name: "focus",
              value: this.value,
              expression: "value",
              arg: "foo",
              modifiers: {
                bar: true,
              },
            },
          ],
        }),
        h(
          "span",
          {
            class: "suffix",
          },
          this.$scopedSlots.suffix ? this.$scopedSlots.suffix() : null
        ),
        h(
          "span",
          null,
          this.$scopedSlots.default
            ? this.$scopedSlots.default({
                config: this.config,
              })
            : null
        ),
      ]
    );
  },
};
