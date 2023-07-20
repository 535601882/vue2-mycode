<template>
  <div>
    <el-radio-group :value="value" @input="(v) => $emit('input', v)">
      <el-radio-button :label="option" v-for="(option, key) in options" :key="key"></el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>
export default {
  props: ["options", "value"],
};
</script>
