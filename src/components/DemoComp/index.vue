<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import HelloWorld from "../HelloWorld";
let exendHelloWorld = { ...HelloWorld };
delete exendHelloWorld.created;
console.log("HelloWorld", exendHelloWorld, HelloWorld);
export default {
  name: `DemoComp`,
  extends: exendHelloWorld,
  props: {},
  data() {
    return {};
  },
  created() {
    console.log("Demo Comp creaeted");
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
