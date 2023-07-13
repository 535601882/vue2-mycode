<template>
  <div id="app">
    <commponent :is="layout">
      <router-view />
      <RouterView name="LeftSidebar" class="view order-1 w-full"></RouterView>
      <RouterView name="RightSidebar" class="view order-3 w-full"></RouterView>
    </commponent>
  </div>
</template>
<script>
import defaultLayout from "@/layout/default.layout";
import verticalLayout from "@/layout/vertical.layout";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["layout"]),
  },
  components: {
    defaultLayout,
    verticalLayout,
  },
};
</script>
