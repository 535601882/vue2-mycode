<template>
  <div class="home">
    <div class="home" @click="handleClick">home {{ $t("hello") }} {{ $t("demo") }}</div>
    <el-button @click="handleToggle">切换语言 {{ $i18n.locale }}</el-button>
    <el-button @click="handleSetLang">设置语言</el-button>
    <el-button @click="handleMargeLang">合并语言</el-button>
    <el-button @click="handleToggleLayout">切换layout</el-button>
    <hr />
    <app-table :table="table"></app-table>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
  data() {
    return {
      table: {
        data: [],
      },
    };
  },
  created() {
    console.log("created", this.$i18n, this.$i18n.messages);
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
