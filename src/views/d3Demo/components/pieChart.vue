<template>
  <div ref="svg"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "pieChart",
  components: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    initData() {
      const width = 300,
        height = 300;
      const svg = d3.select(this.$refs.svg).append("svg").attr("width", 300).attr("height", 300);
      const dataset = [30, 10, 43, 55, 13];
      const pie = d3.pie();
      const piedata = pie(dataset);
      console.log("piedata", piedata, pie.value());

      const outerRadius = 150; // 外半径
      const innerRadius = 0; // 内半径

      const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

      const arcs = svg
        .selectAll("g")
        .data(piedata)
        .enter()
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const color = d3.scaleOrdinal().range(d3.schemeCategory10);
      arcs
        .append("path")
        .attr("fill", (d, i) => color(i))
        .attr("d", (d) => arc(d));

      arcs
        .append("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text((d) => d.data);
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped lang="scss"></style>
