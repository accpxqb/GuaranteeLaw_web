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
      path: "regulationsdetails",
      name: "regulationsdetails",
      component: () => import("../views/regulations/Regulations_Details.vue"),
      onMenu: "false",
    },
    {
      path: "theory",
      name: "theory",
      component: () => import("../views/theory/Theory.vue"),
      onMenu: "false",
    },
    {
      path: "theorydetails",
      name: "theorydetails",
      component: () => import("../views/theory/details.vue"),
      onMenu: "false",
    },
    {
      path: "case",
      name: "case",
      component: () => import("../views/case/Case.vue"),
      onMenu: "false",
    },
    {
      path: "casedetails",
      name: "casedetails",
      component: () => import("../views/case/details.vue"),
      onMenu: "false",
    },
    {
      path: "expert",
      name: "expert",
      component: () => import("../views/expert/expert.vue"),
      onMenu: "false",
    },
    {
      path: "expertdetails",
      name: "expertdetails",
      component: () => import("../views/expert/details.vue"),
      onMenu: "false",
    },
    {
      path: "news",
      name: "news",
      component: () => import("../views/news/news.vue"),
      onMenu: "false",
    },
    {
      path: "newsdetails",
      name: "newsdetails",
      component: () => import("../views/news/details.vue"),
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
