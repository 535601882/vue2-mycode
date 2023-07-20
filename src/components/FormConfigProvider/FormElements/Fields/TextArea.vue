<template>
  <el-input type="textarea" :value="value" @input="(v) => $emit('input', v)"></el-input>
</template>
<script>
export default {
  props: ["value"],
};
</script>
