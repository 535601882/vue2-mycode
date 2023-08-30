<!--交互-->
<template>
  <div ref="svg"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "interactive",
  components: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    initData() {
      const svg = d3.select(this.$refs.svg).append("svg").attr("width", 300).attr("height", 300);
      const circle = svg.append("circle");
      circle.on("click", function () {
        console.log("点击");
      });
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped lang="scss"></style>
