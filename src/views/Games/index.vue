<template>
  <div class="container">
    <canvas id="game" width="375" height="375" ref="canvas"></canvas>
    <div id="score"></div>
    <button id="restart">RESTART</button>
    <input type="number" v-model="model" />
    <el-input-number v-model="model1"></el-input-number>
  </div>
</template>

<script>
import game from "./game";
export default {
  name: "index",
  components: {},
  data() {
    return {
      model: null,
      model1: null,
    };
  },
  computed: {},
  created() {},
  methods: {},
  mounted() {
    let canvas = this.$refs.canvas;
    const scoreElement = document.getElementById("score");
    const restartButton = document.getElementById("restart");
    game.init({ canvas, scoreElement, restartButton, vm: this });
  },
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  position: relative;
  font-family: Helvetica;
}

canvas {
  border: 1px solid;
}

#score {
  position: absolute;
  top: 30px;
  right: 30px;
  font-size: 2em;
  font-weight: 900;
}

#restart {
  position: absolute;
  display: none;
}
</style>
