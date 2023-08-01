import Vue from "vue";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import enUS from "@/lang/en-US";
import zhCN from "@/lang/zh-CN";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "zh", // 默认语言
  fallbackLocale: "zh", // 默认语言环境。如果locale中无匹配项则采用该项值
  messages: {
    en: {
      ...enLocale,
      ...enUS,
    },
    zh: {
      ...zhLocale,
      ...zhCN,
    },
  },
  silentTranslationWarn: true, //避免一些警告 (同时保留那些完全没有翻译给定关键字的警告)，需初始化 VueI18n 实例时设置
});

export default i18n;
