<template>
  <PageContainer>
    <img src="http://www.baidu.com/a.jpg" alt="" />
  </PageContainer>
</template>
<script>
export default {
  name: "log",
  props: {},
  data() {
    return {};
  },
  created() {
    console.log(this.$i18n);
  },
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scope></style>
