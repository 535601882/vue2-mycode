<template>
  <div ref="loader">
  </div>
</template>

<script>
  import * as THREE from "three";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
  import ThreeModel from "../ThreeModel";
  export default {
    name: "ArchitectModel",
    components: {},
    data() {
      return {}
    },
    computed: {},
    created() {
    },
    methods: {},
    mounted() {
      this.threeModel = new ThreeModel({
        width: 800,
        height: 500,
        parent: this.$refs.loader,
        helperStatus: true
      })
      const loader = new GLTFLoader()
      loader.load("/static/gltf/仓库大楼/scene.gltf",(gltf) => {
        console.log("gltf",gltf)
        let model = gltf.scene
        model.position.set(0, -0.1, 0);
        this.threeModel.sceneAdd(model)

      })
      // 创建灯光
      const light = new THREE.DirectionalLight( 0xffffff )
      this.threeModel.sceneAdd(light)
      this.threeModel.sceneAdd(new THREE.DirectionalLightHelper( light, 5 ))


      // const geometry =  new THREE.BoxGeometry(1,1,1)
      // const material = new THREE.MeshBasicMaterial({color: 0x00ff00})
      // const cube =  new THREE.Mesh(geometry,material)
      // this.threeModel.sceneAdd(cube)
      this.threeModel.animate()
    },
  }
</script>

<style scoped lang="scss">

</style>
