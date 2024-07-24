<template>
  <PageContainer>
    <div class="home" @click="handleClick">home {{ $t("hello") }} {{ $t("demo") }}</div>
    <el-button @click="handleToggle">切换语言 {{ $i18n.locale }}</el-button>
    <el-button @click="handleSetLang">设置语言</el-button>
    <el-button @click="handleMargeLang">合并语言</el-button>
    <el-button @click="handleToggleLayout">切换layout</el-button>
    <hr />
    <app-table :table="table" :paging="paging"></app-table>
    <hr />
    <p>高阶组件</p>
    <CustomInput v-model="model" placeholder="测试" ref="CustomInput">
      <template v-slot:prefix="config">前{{ config }}</template>
      <!-- <template v-slot:prefix>前</template> -->
      <template v-slot:suffix>后</template>
      <!-- <template v-slot:default="config">默认{{ config }}</template> -->
      <template v-slot:default><div id="app1" class="app-main">默认</div></template>
    </CustomInput>
    <div id="demo"></div>
    <div id="haha"></div>
  </PageContainer>
</template>

<script>
import Vue from "vue";
import api from "@/api";
import CustomInput from "./Hoc/CustomInput";
import HelloWorld from "@cp/HelloWorld";
export default {
  name: "Home",
  components: {
    CustomInput,
  },
  data() {
    return {
      table: {
        columns: [
          { prop: "name", label: "姓名" },
          { prop: "birthday", label: "生日" },
          { prop: "address", label: "地址" },
          { prop: "date", label: "修改日期" },
        ],
        data: [],
      },
      paging: {
        pageSize: 3,
        total: null,
        currentPage: 1,
      },
      model: null,
    };
  },
  mounted() {
    console.log(this.$refs.CustomInput.componentInstance);
    console.log("created", this.$i18n, this.$i18n.messages);
    this.handleSearchClick();
    this.getComponentInsertDom();
  },
  methods: {
    handleClick() {
      console.log("handleClick", this.$t("world"));
    },
    handleToggle() {
      this.$i18n.locale = this.$i18n.locale === "zh" ? "en" : "zh";
      console.log(this.$i18n.locale, this.$i18n.messages);
    },
    handleSetLang() {
      // 将原有的合并
      this.$i18n.setLocaleMessage("en", { ...this.$i18n.messages["en"], ...{ demo: "demo" } });
      this.$i18n.setLocaleMessage("zh", { ...this.$i18n.messages["zh"], ...{ demo: "测试" } });
      console.log(this.$i18n.locale, this.$i18n.messages);
    },
    handleMargeLang() {
      this.$i18n.mergeLocaleMessage("en", { ...{ demo: "demo" } });
      this.$i18n.mergeLocaleMessage("zh", { ...{ demo: "测试" } });
      console.log(this.$i18n.locale, this.$i18n.messages);
    },
    handleToggleLayout() {
      if (this.$store.state.layout === "defaultLayout") {
        this.$store.dispatch("setLayout", "verticalLayout");
      } else {
        this.$store.dispatch("setLayout", "defaultLayout");
      }
    },
    // 查询
    handleSearchClick() {
      let obj = {
        pageNumber: this.paging.currentPage,
        pageSize: this.paging.pageSize,
      };
      api.clientApi.getUsers(obj).then((res) => {
        this.table.data = res.result;
        this.paging.total = res.totalCount;
      });
    },
    getComponentInsertDom() {
      let Hello = Vue.extend(HelloWorld);
      let helloDom = new Hello({
        props: {
          msg: "1111111111111",
        },
      }).$mount();

      helloDom.$on("input", (payload) => {
        console.log("HelloWorld emit input事件 event:", payload);
      });

      document.getElementById("demo").appendChild(helloDom.$el);
    },
  },
  watch: {
    "$i18n.locale": function (val) {
      console.log("$i18n.locale", val);
    },
  },
};
</script>
<style lang="scss">
.home {
  color: $color-brand;
}
</style>
