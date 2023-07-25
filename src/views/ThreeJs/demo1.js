import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import sphericalTexture from "@/assets/images/spherical_texture.jpg";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class ThreeDemo {
  constructor() {
    this.scene = null; // 场景
    this.camera = null; //相机
    this.renderer = null; // 渲染器
    this.controls = null; // 控制器
    this.width = 1024;
    this.height = 768;
  }
  init() {
    /*****************1. 场景*******************/
    this.scene = new THREE.Scene();
    /*****************3. 摄像机*******************/
    // 透视摄像机
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 5;
    this.camera.lookAt(0, 0, 0);
    /*****************3. 渲染器*******************/
    this.renderer = new THREE.WebGLRenderer();
    //设置一个渲染器的尺寸
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x444444, 1.0);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.gammaFactor = 2.2;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.physicallyCorrectLights = true;
    document.getElementById("panorama-container").appendChild(this.renderer.domElement);

    /**** 将OrbitControls应用到相机 ***/
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    /**  增加光源   **/
    const light = new THREE.PointLight(0xffffff, 1, 300);
    light.position.set(0, 5, 6);
    light.castShadow = true;

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 60, 20);
    this.scene.add(directionalLight);

    /******添加一个辅助网格或线来表示相机的位置和朝向*******/
    const cameraHelper = new THREE.CameraHelper(this.camera);
    this.scene.add(cameraHelper);

    // 坐标轴(红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.)
    const axesHelper = new THREE.AxesHelper(10);
    this.scene.add(axesHelper);

    // 坐标格辅助对象
    const gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(gridHelper);

    //点光源 光照辅助
    const helper = new THREE.PointLightHelper(light, 1);
    this.scene.add(helper);

    //用于模拟平面 Plane 的辅助对象.
    const plane = new THREE.Plane(new THREE.Vector3(1, 1, 0.2), 3);
    const planeHelper = new THREE.PlaneHelper(plane, 1, 0xffff00);
    this.scene.add(planeHelper);
    // 平行光源 辅助
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    this.scene.add(directionalLightHelper);

    return this;
  }

  initData() {
    /*****************4 添加物体*******************/
    const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    /*** 添加线段***/
    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

    const line = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(line);
    return this;
  }

  createCircle() {
    /**-----------添加球-------------***/
    const geometry = new THREE.SphereGeometry(1);
    // 贴图
    const texture = new THREE.TextureLoader().load(sphericalTexture);
    texture.wrapS = THREE.RepeatWrapping;

    //纯颜色材质
    // const basicMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00})
    const deptMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, map: texture });
    // 带有光泽的材质
    const mesh = new THREE.Mesh(geometry, deptMaterial);
    this.scene.add(mesh);
    return this;
  }

  createGltf() {
    /** 加载gltf ***/
    const loader = new GLTFLoader();
    // ！！！留意gltf位置，放在public位置
    loader.load(
      "/free_1972_datsun_240k_gt/scene.gltf",
      (gltf) => {
        console.log("gltf.scene", gltf.scene);
        const gltfObject = gltf.scene; // 获取模型对象
        gltfObject.position.set(10, 11, -3);
        this.scene.add(gltfObject); // 将模型引入three
      },
      undefined,
      (e) => {
        console.log("gltf错误", e);
      }
    );

    // 设置相机的位置
    this.camera.position.set(-3, 1, 4);
    // 设置相机的观察点
    this.camera.lookAt(0, 0, 0); // 坐标原点
    return this;
  }

  render() {
    /*****************最后. 执行渲染*******************/
    this.animate();
  }

  animate() {
    console.log("相机坐标", this.camera.position);
    requestAnimationFrame(() => this.animate());
    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

export default new ThreeDemo();
