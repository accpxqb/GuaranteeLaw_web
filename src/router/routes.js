import i18n from "../i18n";
const t = i18n.global.t;

export const routes = [];

 

routes.push({
  path: "/map",
  name: "map",
  component: () => import("../views/map/map.vue"),
  onMenu: "false",
});

 
 

 
routes.push({
  path: "/",
  name: "index",
  component: () => import("../layouts/BaseLayout.vue"),
  children: [
    {
      path: "regulations",
      name: "regulations",
      component: () => import("../views/regulations/Regulations.vue"),
      onMenu: "false",
    },
    {
      path: "theory",
      name: "theory",
      component: () => import("../views/theory/Theory.vue"),
      onMenu: "false",
    },
    {
      path: "case",
      name: "case",
      component: () => import("../views/case/Case.vue"),
      onMenu: "false",
    },
    {
      path: "",
      name: "HomePage",
      component: () => import("../views/homepage/Homepage.vue"),
      onMenu: "false",
    },
    
    {
      path: "404",
      name: "error",
      component: () => import("@/components/ErrorPage.vue"),
    },
 
    
 
  ],
});
