<template>
  <PageContainer>
    <FormulaEditor></FormulaEditor>
  </PageContainer>
</template>
<script>
export default {
  name: "log",
  props: {},
  created() {
    console.log(this.$i18n);
  },
};
</script>
<style lang="scss" scope></style>
