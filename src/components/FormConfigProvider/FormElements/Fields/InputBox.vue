<template>
  <el-input type="input" :value="value" @input="(v) => $emit('input', v)"></el-input>
</template>
<script>
export default {
  props: ["value"],
};
</script>
