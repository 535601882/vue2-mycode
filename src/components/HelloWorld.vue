<template>
  <div class="hello">
    测试hello
    <h1 class="cheng-mb-30">{{ msg }} | {{ model }}</h1>
    <input type="text" :value="model" @input="(e) => hanleChange(e.target.value)" />
    {{ $options.list }}

    <!--    利用requestAnimationFrame来优化展示-->
    <div style="display: flex; flex-wrap: wrap">
      <template v-for="num in max">
        <list v-if="deferItem(num)" :key="num" style="width: 100px; height: 100px; border: 1px solid #ccc"></list>
      </template>
    </div>
  </div>
</template>

<script>
import api from "@/api";
const list = {
  created() {
    api.clientApi
      .getUserId({
        id: "60a381092625181b045c82c0",
      })
      .then((res) => {
        console.log(res);
        setTimeout(() => {
          console.log("重新发起请求");
          api.clientApi
            .getUserId({
              id: "60a381092625181b045c82c0",
            })
            .then((res) => {
              console.log("重新发起请求成功", res);
            });
        }, 10000);
      });
  },
  render(h) {
    const child = new Array(1000).fill("").map(() => {
      return h("div", "");
    });
    return h("div", child);
  },
};
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  components: {
    list,
  },
  data() {
    return {
      // list: null
      model: null,
      max: 10,
      renderedCount: 0,
    };
  },
  created() {},
  list: null,
  mounted() {
    this.getList();
    this.initRequestAnimationFrame();
  },
  methods: {
    getList() {
      if (this.$options.list) {
        return;
      }
      this.$options.list = [1, 2, 3, 4, 5];
      console.log("$options", this.$options.list);
    },
    hanleChange(val) {
      this.model = val;
      this.$emit("input", val);
    },
    initRequestAnimationFrame() {
      if (this.renderedCount < this.max) {
        let min = Math.min(this.max - this.renderedCount, 10);
        this.renderedCount += min;
        requestAnimationFrame(this.initRequestAnimationFrame);
      }
    },
    deferItem(num) {
      return this.renderedCount >= num;
    },
  },
};
</script>
