<template>
  <div ref="lineChart"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "lineChart",
  components: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    init() {
      const width = 300;
      const height = 300;
      var svg = d3.select(this.$refs.lineChart).append("svg").attr("width", width).attr("height", height);
      console.log("svg", svg);
      var dataset = [250, 210, 170, 130, 90];
      var rectHeight = 25;

      //有数据，而没有足够图形元素的时候，使用此方法可以添加足够的元素。
      svg
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", 20)
        .attr("y", function (d, i) {
          return i * rectHeight;
        })
        .attr("width", function (d) {
          return d;
        })
        .attr("height", rectHeight - 2)
        .attr("fill", "steelblue");
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped lang="scss"></style>
