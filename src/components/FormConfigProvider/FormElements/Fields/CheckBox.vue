<template>
  <div>
    <el-checkbox-group v-model="internalValue" @change="(v) => $emit('input', v)">
      <el-checkbox v-for="(option, key) in options" :label="option" :key="key">{{ option }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      required: true,
    },
    value: {
      required: false,
      default: () => [],
    },
  },
  computed: {
    internalValue: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit("input", newValue);
      },
    },
  },
};
</script>
