<template>
  <div ref="barchart"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "barchart",
  components: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    initData() {
      const width = 300;
      const height = 400;
      const svg = d3.select(this.$refs.barchart).append("svg").attr("width", width).attr("height", height);

      const padding = {
        left: 30,
        right: 30,
        top: 20,
        bottom: 20,
      };
      // 定义数据和比例尺
      const dataset = [10, 20, 30, 40, 33, 24, 12, 5];

      // x轴比例尺
      const xScale = d3.scaleBand(d3.range(dataset.length), [0, width - padding.left - padding.right]);
      // Y轴比例尺
      const yScale = d3.scaleLinear([0, d3.max(dataset)], [height - padding.top - padding.bottom, 0]);

      // 坐标轴
      var xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
      // 矩形之间空白
      let rectPadding = 4;
      // 添加矩形
      // eslint-disable-next-line no-unused-vars
      const rects = svg
        .selectAll(".MyRect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "MyRect")
        .attr("transform", `translate(${padding.left},${padding.top})`)
        .attr("x", (d, i) => xScale(i) + rectPadding / 2)
        .attr("y", (d) => yScale(d))
        .attr("width", xScale.bandwidth() - rectPadding)
        .attr("height", (d) => height - padding.top - padding.bottom - yScale(d))
        .attr("fill", "steelblue")
        // eslint-disable-next-line no-unused-vars
        .on("mouseover", function (d, i) {
          d3.select(this).attr("fill", "yellow");
        })
        // eslint-disable-next-line no-unused-vars
        .on("mouseout", function (d, i) {
          d3.select(this).transition().duration(500).attr("fill", "steelblue");
        });

      // 添加文字
      svg
        .selectAll(".MyText")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "MyText")
        .attr("transform", `translate(${padding.left},${padding.top})`)
        .attr("x", (d, i) => xScale(i) + rectPadding / 2)
        .attr("y", () => {
          const min = yScale.domain()[0];
          return yScale(min);
        })
        .transition()
        .delay((d, i) => i * 20)
        .duration(2000)
        .ease(d3.easeBounce)
        .attr("y", (d) => yScale(d))
        .attr("dx", () => (xScale.bandwidth() - rectPadding) / 2)
        .attr("dy", () => 20)
        .text((d) => d)
        .style("fill", "white");

      // 添加坐标轴
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${padding.left},${height - padding.bottom})`)
        .call(xAxis);
      svg.append("g").attr("class", "axis").attr("transform", `translate(${padding.left},${padding.top})`).call(yAxis);

      // svg.transition().duration(5000).delay(2000).ease(d3.easeLinear)
      //   .attr("fill", "red");

      setTimeout(() => {
        console.log("update");
        const updateBars = svg.selectAll(".MyRect").data([15, 25, 35, 45, 13]);

        updateBars.attr("height", (d) => height - padding.top - padding.bottom - yScale(d)).attr("y", (d) => yScale(d));

        // Exit 部分(删除无用的)
        updateBars.exit().remove();
      }, 3000);
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style lang="scss">
.MyText {
  color: #fff;
}
</style>
