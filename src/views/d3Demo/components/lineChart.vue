<template>
  <div ref="lineChart"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "lineChart",
  components: {},
  data() {
    return {
      dataset: [2.5, 2.1, 1.7, 1.3, 0.9],
      svg: null,
      xscale: null, // 比例
    };
  },
  computed: {},
  created() {},
  methods: {
    init() {
      const width = 300;
      const height = 300;
      const rectHeight = 25;

      this.svg = d3.select(this.$refs.lineChart).append("svg").attr("width", width).attr("height", height);

      // 数值过小，增加比例尺
      this.xscale = d3
        .scaleLinear()
        .domain([0, d3.max(this.dataset)])
        .range([0, 250]);

      let axis = this.getAxis();
      //有数据，而没有足够图形元素的时候，使用此方法可以添加足够的元素。
      this.svg
        .selectAll("rect")
        .data(this.dataset)
        .enter()
        .append("rect")
        .attr("x", 20)
        .attr("y", (d, i) => i * rectHeight)
        .attr("width", (d) => this.xscale(d))
        .attr("height", rectHeight - 2)
        .attr("fill", "steelblue");
      this.svg
        .append("g") //在 SVG 中添加坐标轴
        .attr("class", "axis")
        .attr("transform", `translate(20,${rectHeight * this.dataset.length})`)
        .call(axis);
      return this;
    },
    // 线性比例尺
    scaleLinear() {
      //这两个函数能够求数组的最大值和最小值
      const min = d3.min(this.dataset);
      const max = d3.max(this.dataset);
      // domain() 和 range() 分别设定比例尺的定义域和值域
      const linear = d3.scaleLinear().domain([min, max]).range([0, 300]);
      //linear返回值，是可以当做函数来使用的
      console.log(min, max, linear(90), linear(100), linear(50));
    },
    // 序数比例尺
    scaleOrdinal() {
      const index = [0, 1, 2, 3, 4];
      const color = ["red", "blue", "green", "yellow", "black"];
      const ordinal = d3.scaleOrdinal().domain(index).range(color);
      console.log(ordinal(1), ordinal(3));
    },
    // 定义坐标轴
    getAxis() {
      return d3
        .axisBottom(this.xscale) //D3 中坐标轴的组件，能够在 SVG 中生成组成坐标轴的元素
        .ticks(7); //指定刻度的数量
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
.axis path,
.axis line {
  fill: none;
  stroke: black;
  shape-rendering: crispEdges;
}

.axis text {
  font-family: sans-serif;
  font-size: 11px;
}
</style>
