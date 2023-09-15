<template>
  <div class="game-wrap">
    <div id="scoreboard">HEALTH: 3 &emsp; SCORE: 0</div>
    <div id="gameover"></div>
    <canvas ref="box" width="600" height="400"></canvas>
    <el-button type="primary" id="blocker">开始游戏</el-button>
  </div>
</template>

<script>
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
// eslint-disable-next-line no-unused-vars
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const SceneManager = function (canvas) {
  const screenDimensions = {
    width: canvas.width,
    height: canvas.height,
  };
  const scene = buildScene(); // 场景
  const renderer = buildRender(screenDimensions); // 渲染器
  const camera = buildCamera(screenDimensions); // 相机
  const ambientLight = new THREE.AmbientLight("#FFFFFF", 1.5);
  scene.add(ambientLight);

  var dynamicSubjects = [];
  createSceneSubjects();
  var theMissiles = []; // 子弹

  var keyMap = [];

  var score = 0;
  var health = 3;
  var gameEnded = false;

  /*用于简单模拟3个坐标轴的对象.
    红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.*/
  const axesHelper = new THREE.AxesHelper(5000);
  scene.add(axesHelper);
  // 用于模拟相机视锥体的辅助对象
  const helper = new THREE.CameraHelper(camera);
  scene.add(helper);
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.update();
  // 第一人称控制器
  // let firstPersonControls = new FirstPersonControls(camera,renderer.domElement)
  // scene.add(firstPersonControls)
  // 指针锁定控制器
  const controls = new PointerLockControls(camera, canvas);
  scene.add(controls.getObject());
  // controls.addEventListener( 'lock', function () {
  //   console.log("lock")
  // });
  //
  // controls.addEventListener( 'unlock', function () {
  //   console.log("unlock")
  // });
  // 设置锁定解锁事件：
  const blocker = document.getElementById("blocker");
  blocker.addEventListener(
    "click",
    function () {
      controls.lock();
    },
    false
  );

  // eslint-disable-next-line no-unused-vars
  var theSpaceship, theBackground, theCoins, theEnemies;
  // 场景
  function buildScene() {
    const scene = new THREE.Scene();
    return scene;
  }
  // 渲染器
  function buildRender({ width, height }) {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setClearColor("#222222");
    renderer.setSize(width, height);
    return renderer;
  }
  // 相机
  function buildCamera({ width, height }) {
    const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000);
    camera.position.z = 10;
    return camera;
  }
  // 创建飞船
  function createSceneSubjects() {
    theBackground = new Background(scene);
    theSpaceship = new Spaceship(scene);
    theCoins = placeCoins(scene);
    theEnemies = placeEnemies(scene);

    dynamicSubjects.push(theSpaceship);
  }

  // 更新
  this.update = function () {
    orbitControls.update();
    if (camera.position.y < 2000 && health > 0) {
      camera.position.y += 1;
      for (let i = 0; i < dynamicSubjects.length; i++) {
        dynamicSubjects[i].update();
      }
      [theCoins, theEnemies, theMissiles, score, health] = checkCollisions(scene, theSpaceship, theCoins, theEnemies, theMissiles, score, health);
      theMissiles = destroyMissiles(scene, theMissiles);
      // -----------------------------------------
      theSpaceship.handeleInput(keyMap, camera);
      if (keyMap[32]) {
        console.log("空格");
        var x = theSpaceship.model.position.x;
        var y = theSpaceship.model.position.y + theSpaceship.height / 2;
        const m = new Missile(scene, x, y);
        dynamicSubjects.push(m);
        theMissiles.push(m);
        keyMap[32] = false;
      }
      renderer.render(scene, camera);
    } else if (!gameEnded) {
      gameEnded = true;
      if (health > 0) {
        document.getElementById("gameover").innerHTML = "GAME OVER";
      } else {
        document.getElementById("gameover").innerHTML = "YOU LOST";
      }
    }
  };

  this.handleInput = function (keyCode, isDown) {
    keyMap[keyCode] = isDown;
  };
};

// 背景
// eslint-disable-next-line no-unused-vars
function Background(scene, height) {
  var geometry = new THREE.PlaneGeometry(3000, 3000);
  const textureLoader = new THREE.TextureLoader();
  var material = new THREE.MeshBasicMaterial({
    map: textureLoader.load(
      "/imgs/bg.png",
      (textture) => {
        // 纹理加载完成
        console.log("纹理加载完成", textture);
      },
      undefined,
      (error) => {
        // 加载出错时的操作
        console.error("An error occurred while loading the texture:", error);
      }
    ),
  });
  var bg = new THREE.Mesh(geometry, material);
  bg.rotation.z = -Math.PI / 2;
  bg.position.z = -900;
  bg.position.y = 1000;
  scene.add(bg);
}
// 飞船
function Spaceship(scene) {
  var modelLoader = new OBJLoader();

  const textureLoader = new THREE.TextureLoader();
  const textMap = textureLoader.load("/imgs/spaceship.png");
  const modelMaterial = new THREE.MeshBasicMaterial({ map: textMap });
  this.model;
  this.height;
  this.width;

  modelLoader.load(
    "/obj/spaceship.obj",
    function (obj) {
      console.log("obj", obj);
      this.model = obj;
      this.model.traverse(function (child) {
        if (child.isMesh) {
          child.material = modelMaterial;
        }
      });
      this.model.rotation.x = -Math.PI / 2;
      scene.add(this.model);

      //创建一个包围盒
      var planeBndBox = new THREE.Box3();
      planeBndBox = planeBndBox.setFromObject(this.model);
      console.log("planeBndBox", planeBndBox);
      let boxSize = new THREE.Vector3();
      this.height = planeBndBox.getSize(boxSize).y;
      this.width = planeBndBox.getSize(boxSize).x;
    }.bind(this),
    null,
    function (error) {
      console.log("An error happened", error);
    }
  );

  this.update = function () {
    if (this.model) {
      this.model.position.y += 1;
    }
  };
  // 更新
  this.handeleInput = function (keyMap, camera) {
    if (keyMap[87] && this.model.position.y + this.height / 2 < camera.position.y + camera.top) {
      this.model.position.y += 5;
    }
    if (keyMap[83] && this.model.position.y - this.height / 2 < camera.position.y + camera.bottom) {
      this.model.position.y -= 5;
    }
    if (keyMap[68] && this.model.position.x + this.width / 2 < camera.right) {
      this.model.position.x += 5;
    }
    if (keyMap[65] && this.model.position.x - this.width / 2 > camera.left) {
      this.model.position.x -= 5;
    }
  };
}

// 金币
function Coin(scene, x, y) {
  const radius = 20;
  const geometry = new THREE.CircleGeometry(radius, 16);
  const material = new THREE.MeshBasicMaterial({ color: 0xfbb000 });
  this.model = new THREE.Mesh(geometry, material);
  this.model.position.set(x, y, -500);
  scene.add(this.model);
  this.height = 2 * radius;
  this.width = 2 * radius;
}

// 创建金币
function placeCoins(scene) {
  const theCoins = [];
  [...Array(10).keys()].map((y) => {
    getRandomPosition().map((x) => {
      const c = new Coin(scene, 100 * (x - 7), 200 * (y + 1));
      theCoins.push(c);
    });
  });
  return theCoins;

  // 洗牌算法
  function getRandomPosition() {
    var noCoins = Math.floor(Math.random() * 6);
    var arr = [...Array(15).keys()];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr.slice(0, noCoins);
  }
}

// 子弹
function Missile(scene, x, y) {
  var modelLoader = new GLTFLoader();
  // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/");
  dracoLoader.setDecoderConfig({ type: "js" }); //使用js方式解压
  dracoLoader.preload(); //初始化_initDecoder 解码器
  modelLoader.setDRACOLoader(dracoLoader);

  this.model;
  this.height;
  this.width;

  modelLoader.load(
    "/models/missile/missile.gltf",
    function (obj) {
      console.log("missile.gltf 获取成功");
      this.model = obj.scene;
      this.model.rotation.y = -Math.PI;
      this.model.position.set(x, y, -100);
      this.model.scale.set(0.5, 0.5, 0.5);
      scene.add(this.model);

      var missileBndBox = new THREE.Box3().setFromObject(this.model);
      let boxSize = new THREE.Vector3();
      this.height = missileBndBox.getSize(boxSize).y;
      this.width = missileBndBox.getSize(boxSize).x;
    }.bind(this),
    null,
    function (e) {
      console.log("missile 加载出错", e);
    }
  );

  this.update = function () {
    if (this.model) {
      this.model.position.y += 10;
    }
  };
}

// 敌机
function Enemy(scene, x, y) {
  var modelLoader = new GLTFLoader();
  this.model;
  this.height;
  this.width;

  modelLoader.load(
    "/models/enemy/enemy.gltf",
    function (obj) {
      this.model = obj.scene;
      this.model.rotation.x = Math.PI / 2;
      this.model.rotation.y = -Math.PI / 2;

      this.model.position.set(x, y, -100);
      this.model.scale.set(0.2, 0.2, 0.2);

      scene.add(this.model);
      var enemyBndBox = new THREE.Box3().setFromObject(this.model);
      this.height = enemyBndBox.getSize(new THREE.Vector3()).y;
      this.width = enemyBndBox.getSize(new THREE.Vector3()).x;
    }.bind(this)
  );
}
// 敌机
function placeEnemies(scene) {
  const thisEnemies = [];
  // 动态分布位置
  [...Array(5).keys()].map((y) => {
    getRandomPositions().map((x) => {
      let e = new Enemy(scene, 200 * (x - 4), 400 * (y + 1));
      thisEnemies.push(e);
    });
  });
  return thisEnemies;
  // 创建函数
  function getRandomPositions() {
    let noEnemies = Math.floor(Math.random() * 4);
    var arr = [...Array(9).keys()];
    for (let i = arr.length - 1; i > 0; i--) {
      // 小于i
      let j = Math.floor(Math.random() * i);
      let temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr.slice(0, noEnemies);
  }
}

/**
 * 碰撞检测
 * @param scene 场景
 * @param theSpacesship 飞船
 * @param theCoins  金币
 * @param theEnemies  子弹
 * @param theMissiles 敌机
 */

function checkCollisions(scene, theSpacesship, theCoins, theEnemies, theMissiles, score, health) {
  var i = theCoins.length; // 金币数量
  while (i--) {
    if (isCollision(theSpacesship, theCoins[i])) {
      score += 1; // 撞到金币加一分
      scene.remove(theCoins[i].model);
      theCoins.splice(i, 1);
      document.getElementById("scoreboard").innerHTML = "HEALTH: " + health + " &emsp; SCORE: " + score;
    }
  }

  i = theEnemies.length;
  while (i--) {
    // 验证飞机跟敌机是否相撞
    if (isCollision(theSpacesship, theEnemies[i])) {
      health -= 1;
      scene.remove(theEnemies[i].model);
      theEnemies.splice(i, 1);
      document.getElementById("scoreboard").innerHTML = "HEALTH: " + health + " &emsp; SCORE: " + score;
    }
    // 验证子弹跟敌机是否相撞
    var j = theMissiles.length;
    while (j--) {
      if (isCollision(theMissiles[j], theEnemies[i])) {
        score += 2;
        scene.remove(theEnemies[i].model);
        theEnemies.splice(i, 1);
        scene.remove(theMissiles[j].model);
        theMissiles.splice(j, 1);
        document.getElementById("scoreboard").innerHTML = "HEALTH: " + health + " &emsp; SCORE: " + score;
      }
    }
  }

  return [theCoins, theEnemies, theMissiles, score, health];
}
// 检测物体是否碰撞
function isCollision(m1, m2) {
  if (m1.model && m2.model) {
    // m1 的边界框的四个角的坐标
    let minX1 = m1.model.position.x - m1.width / 2; // 左
    let maxX1 = m1.model.position.x + m1.width / 2; // 右
    let minY1 = m1.model.position.y - m1.height / 2; // 下
    let maxY1 = m1.model.position.y + m1.height / 2; // 上
    // m2 的边界框的四个角的坐标
    let minX2 = m2.model.position.x - m2.width / 2; // 左
    let maxX2 = m2.model.position.x + m2.width / 2; // 右
    let minY2 = m2.model.position.y - m2.height / 2; // 下
    let maxY2 = m2.model.position.y + m2.height / 2; // 上

    if (minX1 <= maxX2 && maxX1 >= minX2 && minY1 <= maxY2 && maxY1 >= minY2) {
      return true;
    } else {
      return false;
    }
  } else return false;
}
// 销毁子弹
function destroyMissiles(scene, theMissiles) {
  var j = theMissiles.length;
  while (j--) {
    if (theMissiles[j].model && theMissiles[j].model.position.z < -2400) {
      scene.remove(theMissiles[j].model);
      theMissiles.splice(j, 1);
    }
  }
  return theMissiles;
}

export default {
  name: "PieChar",
  components: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    initData() {
      const canvas = this.$refs.box;
      const sceneManager = new SceneManager(canvas);

      bindEventListeners();
      render();
      function render() {
        requestAnimationFrame(render);
        sceneManager.update();
      }
      //
      function bindEventListeners() {
        window.onkeydown = handleKeyDown;
        window.onkeyup = handleKeyUp;
      }
      // 键盘down
      function handleKeyDown(event) {
        var keyCode = event.which;
        sceneManager.handleInput(keyCode, true);
      }
      // 键盘UP
      function handleKeyUp(event) {
        var keyCode = event.which;
        sceneManager.handleInput(keyCode, false);
      }
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped lang="scss">
.game-wrap {
  position: relative;
}
#scoreboard {
  position: absolute;
  top: 10px;
  width: 100%;
  z-index: 100;
  font-size: 40px;
  color: white;
  display: block;
}
#gameover {
  z-index: 100;
  color: white;
  font-size: 120px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
