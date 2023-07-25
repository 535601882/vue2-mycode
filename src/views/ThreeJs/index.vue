<!--全景图-->
<template>
  <PageContainer>
    <div id="panorama-container"></div>
  </PageContainer>
</template>
<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import sphericalTexture from "@/assets/images/spherical_texture.jpg";
import demo1 from "./demo1";
let camera, scene, renderer, controls;
export default {
  name: "ThreeJs",
  props: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    // demo1.init().createGltf();
    demo1.init().createGltf().render();
    // this.initData()
    this.autoRotate = true; // 设置自动旋转标志为 true
    this.angle = 0; // 设置初始角度为 0
  },
  methods: {
    // 初始化场景
    initData() {
      // 1.创建一个新的场景对象
      scene = new THREE.Scene();

      // 2.创建一个新的相机对象
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      // 设置相机位置
      camera.position.set(0, 0, 0.1);

      // 加载全景图像
      const loader = new THREE.TextureLoader();
      const texture = loader.load(sphericalTexture);

      // 设置纹理环绕和翻转选项
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.x = -1;

      // 创建一个新的球体几何体来保存全景图像
      const geometry = new THREE.SphereGeometry(500, 60, 40);

      // 将几何体内部翻转，使图像显示在球体内部
      geometry.scale(-1, 1, 1);

      // 使用加载的纹理创建一个新材质
      const material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      // 使用几何体和材质创建一个新网格
      const mesh = new THREE.Mesh(geometry, material);
      // 将网格物体添加到场景中
      scene.add(mesh);

      // 3.创建一个新的 WebGL 渲染器对象
      renderer = new THREE.WebGLRenderer();

      // 将渲染器大小设置为渲染器窗口大小
      renderer.setSize(window.innerWidth, window.innerHeight);
      // 将渲染器附加到文档主体
      document.getElementById("panorama-container").appendChild(renderer.domElement);

      // 创建一个新的 OrbitControls 对象以启用鼠标拖动控件
      controls = new OrbitControls(camera, renderer.domElement);
      // 禁用缩放和平移
      controls.enableZoom = false;
      controls.enablePan = false;

      // 设置控件围绕全景图像
      controls.rotateSpeed = -0.25;

      // 设置渲染循环
      this.render();
      // renderer.setAnimationLoop(() => {
      //   // 更新 OrbitControls
      //   controls.update()
      //   // 自动旋转相机
      //   // this.rotateCamera();
      //   // 使用相机和渲染器渲染场景
      //   renderer.render(scene,camera)
      // })
    },
    render() {
      controls.update();
      requestAnimationFrame(this.render);
      renderer.render(scene, camera);
    },
    // 添加自动旋转方法
    rotateCamera() {
      if (this.autoRotate) {
        this.angle += 0.005; // 控制旋转速度，你可以根据需要调整
        camera.position.x = Math.cos(this.angle) * 250;
        camera.position.z = Math.sin(this.angle) * 250;
        camera.lookAt(scene.position);
      }
    },
  },
};
</script>
