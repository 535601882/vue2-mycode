import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

export default function (Vue, { i18n }) {
  Vue.use(ElementUI, {
    size: "small",
    i18n: (key, value) => i18n.t(key, value),
  });
}
