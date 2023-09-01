<template>
  <div id="maps" :style="{ width: width + 'px', height: height + 'px' }"></div>
</template>

<script>
import mapsJson from "../../d3Demo/components/maps";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as d3 from "d3";
import * as THREE from "three";
export default {
  name: "ChinaMaps",
  components: {},
  data() {
    return {
      width: 1300,
      height: 1300,
    };
  },
  computed: {},
  created() {},
  methods: {
    initData() {
      // 场景
      const scene = new THREE.Scene();
      // scene.background = null
      // 相机
      const camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
      camera.position.set(0, 0, 70);
      camera.lookAt(0, 0, 0);
      // 渲染器
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.setPixelRatio(window.devicePixelRatio);
      // 清除背景色
      // renderer.setClearColor(0xffffff,0)
      renderer.setSize(this.width, this.height);
      document.getElementById("maps").appendChild(renderer.domElement);
      // 轨道控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.update();
      // 辅助
      const helper = new THREE.CameraHelper(camera);
      scene.add(helper);

      // 墨卡托投影转换
      const projection = d3.geoMercator().center([104.0, 37.5]).scale(80).translate([0, 0]);

      // 初始化一个地图对象
      const map = new THREE.Object3D();
      // 将GeoJson坐标转换为THree.js中的几何体
      const shape = new THREE.Shape();

      // const COLOR_ARR = [0x3C6EAB, 0x2F75AC, '#0465BD', '#4350C1', '#008495']
      const COLOR_ARR = d3.schemePastel1;
      mapsJson.features.forEach((item, index) => {
        const color = COLOR_ARR[index % COLOR_ARR.length];
        // 定义一个省份
        const province = new THREE.Object3D();
        map.add(province);
        // 每个的 坐标 数组
        const coordinates = item.geometry.coordinates;
        // 循环坐标数组
        coordinates.forEach((multiPolygon) => {
          // 再套一层
          if (["内蒙古", "十段线"].includes(item.properties.name)) {
            multiPolygon = [multiPolygon];
          }
          multiPolygon.forEach((polygon) => {
            const shape = new THREE.Shape();
            for (let i = 0; i < polygon.length; i++) {
              // 将经纬度转换为坐标
              let [x, y] = projection(polygon[i]);
              y = -y;
              if (i === 0) {
                shape.moveTo(x, y);
              }
              shape.lineTo(x, y);
            }
            const geometry = new THREE.ExtrudeGeometry(shape, {
              depth: 4,
              bevelEnabled: true,
              bevelSgements: 1,
              bevelThickness: 0.2,
            });

            // 平面材质
            const material = new THREE.MeshStandardMaterial({
              metalness: 1,
              color: color,
            });

            // 拉高部分材质
            const material1 = new THREE.MeshStandardMaterial({
              metalness: 1,
              roughness: 1,
              color: color,
            });

            const mesh = new THREE.Mesh(geometry, [material, material1]);
            // 设置高度将省份区分开
            if (index % 2 === 0) {
              mesh.scale.set(1, 1, 1.2);
            }
            // 给mesh开启阴影
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh._color = color;
            province.add(mesh);
          });
        });
      });
      scene.add(map);

      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(20, 20, 25);

      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      scene.add(light);

      // 光照辅助
      {
        const helper = new THREE.DirectionalLightHelper(light, 5);
        scene.add(helper);
      }
      {
        const size = 10;
        const divisions = 10;

        const gridHelper = new THREE.GridHelper(size, divisions);
        scene.add(gridHelper);
      }
      {
        const plane = new THREE.Plane(new THREE.Vector3(1, 1, 0.2), 3);
        const helper = new THREE.PlaneHelper(plane, 1, 0xffff00);
        scene.add(helper);
      }
      {
        const axesHelper = new THREE.AxesHelper(1000);
        scene.add(axesHelper);
      }

      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }
      animate();
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped lang="scss"></style>
