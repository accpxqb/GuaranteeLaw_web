import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
//import 'element-plus/dist/index.css'
import "element-plus/theme-chalk/src/message.scss";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./styles/index.scss";
import "./styles/element/index.scss";
import "./styles/element/element-plus-reset.scss";
import "./styles/element/style.css";
import i18n from "./i18n";
import "./assets/main.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/owl.carousel.min.css";
import "./assets/css/slicknav.css";
import "./assets/css/flaticon.css";
import "./assets/css/animate.min.css";
import "./assets/css/magnific-popup.css";
import "./assets/css/fontawesome-all.min.css";
import "./assets/css/themify-icons.css";
import "./assets/css/slick.css";
import "./assets/css/nice-select.css";
import "./assets/css/style.css";
import "./assets/css/style_about.css";
import "./assets/css/style_db.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import VueAMap, { initAMapApiLoader } from "@vuemap/vue-amap";
import "@vuemap/vue-amap/dist/style.css";
 initAMapApiLoader({
  key: "9b9285489faed4d892db9438b432af7e",
  securityJsCode: "0837961ce9347bbcb27de97744d1b909", // 新版key需要配合安全密钥使用
  plugin: [
    "AMap.Autocomplete", // 输入提示插件
    "AMap.PlaceSearch", // POI搜索插件
    "AMap.Scale", // 右下角缩略图插件 比例尺
    "AMap.OverView", // 地图鹰眼插件
    "AMap.ToolBar", // 地图工具条
    "AMap.Geolocation", // 定位控件，用来获取和展示用户主机所在的经纬度位置
    "AMap.Geocoder",
    "AMap.MapType",
  ],

  //Loca:{
  //  version: '2.0.0'
  //} // 如果需要使用loca组件库，需要加载Loca
});

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.config.globalProperties.$t = i18n.global.t;
app.use(i18n);
app.use(VueAMap);
// app.config.errorHandler = (err, vm, info) => {
//     console.log('全局捕获 err >>>', err)
//     console.log('全局捕获 vm >>>', vm)
//     console.log('全局捕获 info >>>', info)

// }
 app.mount("#app");
