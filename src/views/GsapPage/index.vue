<template>
  <PageContainer>
    <div class="circle block">DEMO1</div>
    <!--    <svg id="svg" viewBox="0 0 100 100">-->
    <!--      <rect class="svgBox" fill="#28a92b" x="0" y="35" width="30" height="30" rx="2" />-->
    <!--    </svg>-->

    <canvas id="canvas" width="300" height="300"></canvas>

    <!--    Staggers 错开（依次）动画-->
    <div class="box-wrap" id="box">
      <div class="box green"></div>
      <div class="box purple"></div>
      <div class="box orange"></div>
      <div class="box purple"></div>
      <div class="box green"></div>
    </div>
    <!--时间线-->
    <div id="timeLine">
      <div class="box green">no delay</div>
      <div class="box purple">delay: 1</div>
      <div class="box orange">delay: 2</div>
    </div>

    <!--    控制动画-->
    <div id="control" class="box">控制</div>
    <div>
      <el-button type="primary">play</el-button>
      <el-button type="primary" @click="tween.pause()">pause</el-button>
      <el-button type="primary" @click="tween.resume()">resume</el-button>
      <el-button type="primary" @click="tween.reverse()">reverse</el-button>
      <el-button type="primary">restart</el-button>
      <el-button type="primary" @click="tween.progress(0.25)">progress 0.25</el-button>
      <el-button type="primary" @click="tween.seek(0.5)">seek 0.5</el-button>
      <el-button type="primary" @click="tween.timeScale(0.5)">timeScale 0.5</el-button>
      <el-button type="primary" @click="tween.kill()">kill</el-button>
    </div>
  </PageContainer>
</template>
<script>
import gsap from "gsap";
export default {
  name: "GsapPage",
  props: {},
  data() {
    return {
      tween: null,
    };
  },
  created() {},
  async mounted() {
    await this.$nextTick();
    // gsap.to(".circle", { x: 200,duration: 3,backgroundColor: '#8d3dae',yoyo:true ,repeat: -1,ease: "power1.inOut"})
    gsap.to(".circle", {
      keyframes: [
        { duration: 1, x: 100 },
        { duration: 1, backgroundColor: "#f38630", delay: 0.5 },
        { duration: 1, x: 0, rotation: -360, delay: 0.5 },
      ],
    });
    await this.$nextTick();
    // gsap.from(".circle", { x: -240, fill: 'blue', });
    // gsap.from(".circle", { x: 100 ,duration: 8 })
    // gsap.set(".circle", { x: 240, fill: 'blue', rotation: 45,duration: 2});
    setTimeout(() => {
      // gsap.to(".svgBox", { x: 50,duration: .3,xPercent: -50,rotation: 360,scale: 2,backgroundColor: '#8d3dae',})
      // gsap.fromTo( ".circle",{ x: 0, fill: 'blue',duration: 8 }, { x: 680, fill: 'green' ,rotation: 215,duration: 8});
    }, 5000);
    let obj = { myNum: 10, myColor: "red" };
    gsap.to(obj, {
      myNum: 200,
      myColor: "blue",
      onUpdate: () => console.log(obj.myNum, obj.myColor),
    });

    // Staggers 错开（依次）动画
    gsap.from("#box .box", {
      // duration: 2,
      scale: 0.5,
      opacity: 0,
      delay: 0.5,
      stagger: 0.2,
      ease: "elastic",
      force3D: true,
    });
    document.querySelectorAll("#box .box").forEach(function (box) {
      box.addEventListener("click", function () {
        gsap.to(".box", {
          duration: 0.5,
          opacity: 0,
          y: -100,
          stagger: 0.1,
          ease: "back.in",
        });
      });
    });

    var canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#28a92b";
    let position = { x: 0, y: 0 };
    function draw() {
      ctx.clearRect(0, 0, 300, 300);
      ctx.fillRect(position.x, position.y, 100, 100);
    }

    gsap.to(position, {
      x: 200,
      y: 200,
      duration: 4,
      onUpdate: draw,
    });

    // 时间线
    // 创建Timeline类型的实例
    let tl = gsap.timeline();

    // 把tween动画添加到timeline实例上，然后我们这里用tl.to去驱动动画，而不是gsap.to
    tl.to("#timeLine .green", { x: 600, duration: 2 }, 1);
    tl.to("#timeLine .purple", { x: 600, duration: 1 }, "<");
    tl.to("#timeLine .orange", { x: 600, duration: 1 }, "+=1");

    // 控制
    // 通过一个变量保存对Tween或者Timeline实例的引用
    this.tween = gsap.to("#control", { duration: 5, x: 1000 });
  },
  methods: {},
};
</script>
<style lang="scss" scope>
.block,
.box {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
}
svg {
  height: 90vh;
  max-height: 300px;
  border: solid 2px white;
  overflow: visible;
}
#canvas {
  height: 80vh;
  max-height: 300px;
  overflow: visible;
  border: solid 2px white;
}
.box-wrap {
  display: flex;
}
</style>
