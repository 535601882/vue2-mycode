<template>
  <div ref="svg"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  name: "geoMap",
  components: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    initData() {
      const width = 950,
        height = 900;
      // eslint-disable-next-line no-unused-vars
      const svg = d3.select(this.$refs.svg).append("svg").attr("width", width).attr("height", height);
      // 鼠标经过省份有提示详情
      const tooltip = d3.select(this.$refs.svg).append("div").attr("class", "tooltip");
      // 创建地理投影
      // eslint-disable-next-line no-unused-vars
      const projection = d3
        .geoMercator()
        .center([107, 31])
        .scale(800)
        .translate([width / 2, height / 2]);

      const path = d3.geoPath(projection);
      const data = require("./maps.json");
      console.log(data);
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      /***
       * 创建地图
       ***/
      svg
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("fill", (d, i) => color(i))
        .attr("d", path) //使用地理路径生成器
        // eslint-disable-next-line no-unused-vars
        .on("mouseover", function (event, d) {
          d3.select(this).attr("fill", "yellow");

          const [x, y] = d3.pointer(event);
          tooltip
            .html(d.properties.name)
            .transition()
            .duration(150)
            .style("left", x + "px")
            .style("top", y + "px")
            .style("opacity", 1)
            .style("font-size", "12px");
        })
        .on("mouseleave", function (event, d) {
          tooltip.transition().duration(150).style("opacity", 0);
          // 获取当前元素的数据（d）在整个数据集中的索引
          const dataIndex = data.features.findIndex((item) => item === d);
          d3.select(this).attr("fill", color(dataIndex));
        });

      /***
       * 创建 省份名称
       * **/
      svg
        .selectAll("text")
        .data(data.features)
        .enter()
        .append("text")
        // eslint-disable-next-line no-unused-vars
        .attr("x", (d) => path.centroid(d)[0]) // 设置text元素的x坐标
        // eslint-disable-next-line no-unused-vars
        .attr("y", (d) => path.centroid(d)[1]) // 设置text元素的y坐标
        // eslint-disable-next-line no-unused-vars
        .attr("dy", function (d, i) {
          //设置“澳门”文本的y轴偏移量，防止文字挤在一起
          if (d.properties.name === "澳门") {
            return 10;
          }
        })
        // eslint-disable-next-line no-unused-vars
        .attr("dx", function (d, i) {
          //设置“香港”文本的x轴偏移量，防止文字挤在一起
          if (d.properties.name === "香港") {
            return 15;
          }
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .text((d) => d.properties.name); // 使用地理特征中的名称属性

      /**
       * 创建渐变
       *
       * **/

      // 添加径向渐变到蒙版
      const radialGradient = svg.append("defs").append("radialGradient").attr("id", "grad").attr("cx", 0.5).attr("cy", 0.5).attr("r", 0.5);

      radialGradient.append("stop").attr("offset", "0%").attr("stop-color", "#fff").attr("stop-opacity", 1);

      radialGradient.append("stop").attr("offset", "100%").attr("stop-color", "#fff").attr("stop-opacity", 0);
      /***

         * 生成飞线 动画
         * @type {number[]}
         */
      // 计算飞线路径坐标（示例：直线路径）
      const start = [113.665412, 34.757975];
      const dataset = [
        {
          centroid: [113.429919, 23.334643],
        },
        {
          centroid: [102.693453, 30.674545],
        },
        {
          centroid: [122.604994, 41.299712],
        },
        {
          centroid: [120.109913, 29.181466],
        },
      ];
      //计算二阶贝塞尔曲线控制点的坐标
      function computeControlPoint(ps, pe, arc = 0.5) {
        const deltaX = pe[0] - ps[0];
        const deltaY = pe[1] - ps[1];
        const theta = Math.atan(deltaY / deltaX);
        const len = (Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 2) * arc;
        const newTheta = theta - Math.PI / 2;
        return [(ps[0] + pe[0]) / 2 + len * Math.cos(newTheta), (ps[1] + pe[1]) / 2 + len * Math.sin(newTheta)];
      }
      //生成贝塞尔曲线的绘制命令
      function transPath(point) {
        return (
          "M" +
          point.startPoint[0] +
          " " +
          point.startPoint[1] +
          " " +
          "Q" +
          point.controlPoint[0] +
          " " +
          point.controlPoint[1] +
          " " +
          point.endPoint[0] +
          " " +
          point.endPoint[1]
        );
      }
      const startPoint = projection(start);

      // 基础弧线组
      const baseLineGroups = svg.append("g").attr("class", "baseLineGroups");
      // 创建飞线组
      const lineGroups = svg.append("g").attr("class", "animationPath");

      //存储飞线点的坐标
      const pointData = [];
      for (let i = 0; i < dataset.length; i += 1) {
        // 计算飞线点坐标
        const endPoint = projection(dataset[i].centroid);
        pointData.push({
          startPoint,
          endPoint,
          controlPoint: computeControlPoint(startPoint, endPoint, 0.5), //计算贝塞尔曲线控制点的坐标
        });
        // 添加基础弧线
        baseLineGroups
          .append("path")
          .attr("stroke", "none")
          .attr("fill", "none")
          .attr("class", `line-path${i}`)
          .attr("d", () => transPath(pointData[i])); //绘制贝塞尔曲线的命令
      }
      // 绘制圆点在start
      svg
        .append("circle")
        .attr("cx", startPoint[0])
        .attr("cy", startPoint[1])
        .attr("r", 0)
        .attr("stroke", "blue")
        .transition()
        .duration(700)
        .ease(d3.easeBounceIn)
        .attr("r", 5);

      for (let i = 0; i < dataset.length; i += 1) {
        //向<defs>标签中添加蒙版，便于之后引用
        const defs = svg.select("defs");
        defs.append("mask").attr("id", `Mask${i}`).append("circle").attr("id", `circle${i}`).attr("r", "150").attr("fill", "url(#grad)"); //使用径向渐变的填充
      }

      /**
         * todo 扩大线条宽度

        let scale = d3.scale.linear()  //定义一个线性比例尺
          .domain([d3.min(dataset, function (d) {return d.num;}),
            d3.max(dataset, function (d) {return d.num;})])  //设置定义域为[毕业生人数最小值，毕业生人数最大值]
          .range([1, 10]);  //设置值域
         */

      // 动画
      const animate = () => {
        for (let i = 0; i < pointData.length; i += 1) {
          lineGroups.select(`#flyline-path${i}`).remove(); //先移除之前定义的飞线路径

          lineGroups
            .append("path")
            .attr("id", `flyline-path${i}`)
            .attr("stroke", "#FFCE00")
            .attr("stroke-width", 2) // //根据人数生成线条的宽度
            .attr("fill", "none")
            .attr("mask", `url(#Mask${i})`) //使用对应编号的蒙版
            .transition()
            .duration(2500)
            .ease(d3.easeLinear)
            .delay(1200)
            .attrTween("d", function () {
              const $path = d3.select(`.line-path${i}`).node();
              const l = $path.getTotalLength();
              const coord = $path
                .getAttribute("d")
                .replace(/(M|Q)/g, "")
                .match(/((\d|\.)+)/g);
              const x1 = +coord[0];
              const y1 = +coord[1]; // 起点
              const x2 = +coord[2];
              const y2 = +coord[3]; // 控制点
              return function (t) {
                const p = $path.getPointAtLength(t * l); // 新的终点
                const x = (1 - t) * x1 + t * x2;
                const y = (1 - t) * y1 + t * y2;
                d3.select(`#circle${i}`)
                  .attr("cx", p.x) //蒙版坐标
                  .attr("cy", p.y)
                  .attr("r", l / 2); //设置蒙版半径随路径长度变化
                return `M${x1},${y1} Q${x},${y} ${p.x},${p.y}`;
              };
            })
            .transition()
            .duration(2400)
            .style("opacity", 0);
        }
      };

      animate();
      setInterval(animate, 5700); //设置动画运行间隔为5700ms
    },
    // 创建蒙板
  },
  mounted() {
    this.initData();
  },
};
</script>

<style lang="scss">
.tooltip {
  position: absolute;
  opacity: 0;
  background: white;
  padding: 4px;
  border-radius: 6px;
}
</style>
