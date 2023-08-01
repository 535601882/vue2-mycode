import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import sphericalTexture from "@/assets/images/spherical_texture.jpg";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';

// class ColorGUIHelper {
//   constructor(object, prop) {
//     this.object = object;
//     this.prop = prop;
//   }
//   get value() {
//     return `#${this.object[this.prop].getHexString()}`;
//   }
//   set value(hexString) {
//     this.object[this.prop].set(hexString);
//   }
// }

class ThreeDemo {
  constructor() {
    this.scene = null; // 场景
    this.camera = null; //相机
    this.renderer = null; // 渲染器
    this.controls = null; // 控制器
    this.model = null; // 选中的物品（旋转用的）
    this.width = 1024;
    this.height = 768;
  }
  init() {
    /*****************1. 场景*******************/
    this.scene = new THREE.Scene();
    /*****************3. 摄像机*******************/
    // 透视摄像机
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 10;
    this.camera.position.y = 5;
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
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity, 300);
    light.position.set(0, 5, 6);
    this.scene.add(light);

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(6, 6, 6);
    directionalLight.target.position.set(-5, 0, 0);
    this.scene.add(directionalLight);
    this.scene.add(directionalLight.target);

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
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: true, roughness: 0.5 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
    // 添加圆
    const circleGeometry = new THREE.CircleGeometry(1, 24);
    const meshDepthMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cube1 = new THREE.Mesh(circleGeometry, meshDepthMaterial);
    cube1.position.x = 3;
    this.scene.add(cube1);
    //
    const dodecahedronGeometry = new THREE.DodecahedronGeometry(1);
    const cube2 = new THREE.Mesh(dodecahedronGeometry, material);
    cube2.position.x = -3;
    this.scene.add(cube2);
    //
    const geometry3 = new THREE.TorusGeometry(2, 1, 10, 16);
    const cube3 = new THREE.Mesh(geometry3, material);
    cube3.position.x = -6;
    this.scene.add(cube3);

    /*** 添加线段***/
    const points = [];
    points.push(new THREE.Vector3(-4, 0, 0));
    points.push(new THREE.Vector3(0, 4, 0));
    points.push(new THREE.Vector3(4, 0, 0));

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

    const line = new THREE.Line(lineGeometry, lineMaterial);
    this.scene.add(line);

    this.addBg();
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
        this.model = gltfObject;
        gltfObject.position.set(10, 11, -3);
        this.scene.add(gltfObject); // 将模型引入three

        createMarker(0, 0, 6, "Marker 1", "Details of Marker 1");
      },
      undefined,
      (e) => {
        console.log("gltf错误", e);
      }
    );

    const createMarker = (x, y, z, label, detail) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const width = 64;
      const height = 64;
      canvas.width = width;
      canvas.height = height;
      // 绘制
      context.beginPath();
      context.arc(width / 2, height / 2, 10, 0, Math.PI * 2);
      context.fillStyle = "red";
      context.fill();
      context.textAlign = "center";
      context.font = "12px Arial";
      context.fillStyle = "white";
      context.fillText(label, width / 2, height / 2 + 20);

      // 创建Sprite
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(x, y, z);
      sprite.scale.set(0.5, 0.5, 0.5);
      this.scene.add(sprite);

      sprite.onClick = () => {
        alert(detail);
      };
    };

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
    // this.model.rotation.x += 0.01
    // this.model.rotation.y += 0.01
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  addBg() {
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load("/imgs/checker.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;

    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    this.scene.add(mesh);
    {
      const cubeSize = 4;
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
      const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
      const mesh = new THREE.Mesh(cubeGeo, cubeMat);
      mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
      this.scene.add(mesh);
    }
    {
      const sphereRadius = 3;
      const sphereWidthDivisions = 32;
      const sphereHeightDivisions = 16;
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
      const sphereMat = new THREE.MeshPhongMaterial({ color: "#CA8" });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
      this.scene.add(mesh);
    }
  }

  // 渲染到指定目标
  renderTarget() {
    // 创建自定义渲染目标
    const renderTarget = new THREE.WebGLRenderTarget(this.width, this.height);

    // 渲染到自定义渲染目标
    this.renderer.setRenderTarget(renderTarget);

    // 将渲染结果作为纹理应用到其他对象
    const resultTexture = renderTarget.texture;
    const resultMaterial = new THREE.MeshBasicMaterial({ map: resultTexture });
    const resultGeometry = new THREE.PlaneGeometry(2, 2);
    const resultMesh = new THREE.Mesh(resultGeometry, resultMaterial);
    this.scene.add(resultMesh);

    // 设置渲染目标为默认的屏幕画布
    this.renderer.setRenderTarget(null);
    return this;
  }
}

export default new ThreeDemo();
