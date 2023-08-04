<template>
  <div id="app">
    <commponent :is="layout">
      <transition name="fade-transverse">
        <keep-alive :include="keepAlive">
          <router-view :params="$route.query" :key="routerViewKey" />
        </keep-alive>
      </transition>
      <!--      <RouterView name="LeftSidebar" class="view order-1 w-full"></RouterView>-->
      <!--      <RouterView name="RightSidebar" class="view order-3 w-full"></RouterView>-->
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
    ...mapState({
      keepAlive: (state) => state.page.keepAlive,
    }),
    /**
     * @description 用来实现带参路由的缓存
     */
    routerViewKey() {
      // 默认情况下 key 类似 __transition-n-/foo
      // 这里的字符串操作是为了最终 key 的格式和原来相同 类似 __transition-n-__stamp-time-/foo
      const stamp = this.$route.meta[`__stamp-${this.$route.path}`] || "";
      return `${stamp ? `__stamp-${stamp}-` : ""}${this.$route.path}`;
    },
  },
  components: {
    defaultLayout,
    verticalLayout,
  },
};
</script>
