import { createI18n } from "vue-i18n";

const modules = import.meta.glob("./locales/*/*.json");
let en = {};
let zh_cn = {};

for (const path in modules) {
  modules[path]().then((mod) => {
    let pathArr = path.split("/");
    if (pathArr[2] == "en") {
      //en[pathArr[3].split(".")[0]] = mod.default;
      en = Object.assign(en, mod.default);
    }
    if (pathArr[2] == "zh-CN") {
      //zh[pathArr[3].split(".")[0]] = mod.default;
      zh_cn = Object.assign(zh_cn, mod.default);
    }
  });
}

const messages = {
  en: en,
  "zh-CN": zh_cn,
};

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  // locale: localStorage.getItem("lang") || "zh-CN",
  locale:  "zh-CN",
  messages,
});

export default i18n;
