<template>
  <data-driven-transition :isNext="formState.isNext">
    <el-form-item v-if="active" :key="fieldId" class="field-group" :label="label" :prop="prop" :required="required" :rules="rules">
      <slot></slot>
    </el-form-item>
  </data-driven-transition>
</template>

<script>
import DataDrivenTransition from "../Transitions/DataDrivenTransition.vue";
export default {
  name: "FieldGroup",
  components: { DataDrivenTransition },
  props: ["fieldId", "label", "required", "rules", "prop"],
  inject: ["formState"],
  data() {
    return {};
  },
  computed: {
    active() {
      return this.formState.activeField === this.fieldId;
    },
  },
  created() {},
  methods: {},
  mounted() {},
};
</script>

<style scoped lang="scss">
.field-group {
  position: absolute;
}
</style>
