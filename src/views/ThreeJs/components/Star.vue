<template>
  <div ref="loader"></div>
</template>

<script>
import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import ThreeModel from "../ThreeModel";
export default {
  name: "Star",
  components: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
  mounted() {
    this.threeModel = new ThreeModel({
      width: 600,
      height: 400,
      parent: this.$refs.loader,
      helperStatus: true,
    });

    // 要更新旋转角度的对象数组
    const objects = [];
    // 一球多用
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

    //添加一个空的场景图节点
    const solarSystem = new THREE.Object3D();
    this.threeModel.sceneAdd(solarSystem);
    objects.push(solarSystem);

    // 添加纹理
    let loader = new THREE.TextureLoader();
    // eslint-disable-next-line no-unused-vars
    const texture = loader.load("/imgs/plank.jpg");
    // texture.wrapS = THREE.RepeatWrapping
    // texture.wrapT = THREE.RepeatWrapping
    // texture.repeat.set( 4, 4 )

    // 太阳
    const sunMaterial = new THREE.MeshPhongMaterial({
      // color: "red",
      map: texture,
      // emissive: 0xffff00
    });
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);
    solarSystem.add(sunMesh);
    objects.push(sunMesh);

    {
      const color = 0xffffff;
      const intensity = 3;
      const light = new THREE.PointLight(color, intensity);
      this.threeModel.sceneAdd(light);
    }
    this.threeModel.camera.position.set(0, 50, 0);
    this.threeModel.camera.up.set(0, 0, 1);

    // 空场景
    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    solarSystem.add(earthOrbit);
    objects.push(earthOrbit);
    // 地球
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2233ff,
      emissive: 0x112244, //材质的放射（光）颜色，基本上是不受其他光照影响的固有颜色。默认为黑色。
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    // earthMesh.position.x = 10
    // this.threeModel.sceneAdd(earthMesh)
    // solarSystem.add(earthMesh)
    earthOrbit.add(earthMesh);
    objects.push(earthMesh);

    // 月亮
    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    earthOrbit.add(moonOrbit);

    const moonMaterial = new THREE.MeshPhongMaterial({
      color: 0x888888,
      emissive: 0x222222,
    });

    const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
    moonMesh.scale.set(0.5, 0.5, 0.5);
    moonOrbit.add(moonMesh);
    objects.push(moonMesh);

    // 创建一个平面
    {
      let geometry = new THREE.PlaneGeometry(40, 40);
      let material = new THREE.MeshBasicMaterial({
        map: texture,
        color: 0xffff00,
        side: THREE.DoubleSide,
      });
      let plantMesh = new THREE.Mesh(geometry, material);
      this.threeModel.sceneAdd(plantMesh);
      plantMesh.rotation.x = Math.PI / 2;
      plantMesh.position.y = -10;
    }

    const keydownFn = function (e) {
      console.log(e.keyCode);
      let code = e.keyCode;
      switch (code) {
        case 38:
          this.threeModel.camera.position.z += 1;
          break;
        case 40:
          this.threeModel.camera.position.z -= 1;
          break;
      }
    };
    window.addEventListener("keydown", keydownFn.bind(this));

    this.threeModel.animate(() => {
      objects.forEach((obj) => {
        obj.rotation.y += 0.01;
      });
    });
  },
};
</script>

<style scoped lang="scss"></style>
