<!--d3Demo页面-->
<template>
  <PageContainer>
    <geoMap></geoMap>
    <lineChart></lineChart>
    <barchart></barchart>
    <interactive></interactive>
    <pieChart></pieChart>
  </PageContainer>
</template>
<script>
import lineChart from "./components/lineChart";
import barchart from "./components/barchart";
import interactive from "./components/interactive";
import pieChart from "./components/pieChart";
import geoMap from "./components/geoMap";
export default {
  name: "d3Demo",
  props: {},
  components: {
    lineChart,
    barchart,
    interactive,
    pieChart,
    geoMap,
  },
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
<style lang="scss" scope></style>
