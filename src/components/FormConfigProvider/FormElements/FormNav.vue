<template>
  <div>
    <form-progress />
    <div class="nav">
      <el-button type="primary" @click="$emit('back')" :disabled="formState.activeField === 0">&lt; Previous</el-button>
      <el-button type="primary" @click="$emit('next')" :disabled="formState.isComplete">Next &gt; </el-button>
    </div>
  </div>
</template>

<script>
import FormProgress from "./FormProgress.vue";
export default {
  name: "form-nav",
  components: {
    "form-progress": FormProgress,
  },
  inject: ["formState", "formData"],
};
</script>

<style scoped lang="scss"></style>
