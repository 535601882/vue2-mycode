<template>
  <div v-if="formState.isComplete">
    <div v-for="(value, name) in formData" :key="name">{{ name }} : {{ value }}</div>
  </div>
</template>

<script>
export default {
  name: "FormResult",
  components: {},
  inject: ["formState", "formData"],
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
  mounted() {},
};
</script>

<style scoped lang="scss"></style>
