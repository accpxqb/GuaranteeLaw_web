import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes.js";
// import { useUserDataStore } from "@/stores/counter";

// const userStore = useUserDataStore();
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.afterEach((to, from, next) => {
  if (to.meta.title) {
    document.title = t(to.meta.title);
  }
});

router.beforeEach(async (to, from) => {
  // console.log("to", to);
  // console.log("from", from);
  if (!to.name) return { name: "error" };
  if (to.name.trim() == "selectBusiness") {
    // console.log("in selectBusiness");
    // console.log("sessionStorage", sessionStorage.smsExpirationTime);
    const timeNum = Number.parseInt((sessionStorage.smsExpirationTime ??= 0));
    if (new Date().getTime() >= timeNum) {
      return { name: "mobileSignup" };
    }
  }
});
export default router;
