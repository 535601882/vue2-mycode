import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "three";

// 创建three
class ThreeModel {
  constructor(options) {
    this.width = options.width;
    this.height = options.height;
    this.parent = options.parent;
    this.helperStatus = options.helperStatus || false; // 是否开启帮助
    this.limitControls = options.limitControls || false; // 限制角度
    this.init();
    if (this.helperStatus) {
      this.initHelper();
    }
  }
  init() {
    this.createScene();
    this.createCamera();
    this.createAmbientLight();
    this.createRenderer();
    this.createHelps();
  }
  createHelps() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();
    if (this.limitControls) {
      this.controls.minDistance = 1; // 最小缩放距离
      this.controls.maxDistance = 5; // 最大缩放距离
      this.controls.minPolarAngle = 0; // 最小俯仰角度
      this.controls.maxPolarAngle = Math.PI / 2; // 最大俯仰角度，通常设置为 90 度，以确保不会看到天空
    }
  }
  initHelper() {
    this.sceneAdd(new THREE.AxesHelper(50));
    this.sceneAdd(new THREE.CameraHelper(this.camera));
  }
  // 创建场景
  createScene() {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0xAAAAAA); //清除并设置成略浅的灰色
  }
  // 创建相机
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 1, 5); // 设置摄像机位置在室内
    // this.camera.lookAt(0,0,0)
  }
  // 创建渲染器
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.parent.appendChild(this.renderer.domElement);
  }
  // 添加物体到场景
  sceneAdd(model) {
    this.scene.add(model);
    return this;
  }
  // 创建环境光
  createAmbientLight() {
    this.sceneAdd(new THREE.AmbientLight(0xffffff));
  }
  animate(cb) {
    cb && cb();
    requestAnimationFrame(() => this.animate(cb));
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}

export default ThreeModel;
