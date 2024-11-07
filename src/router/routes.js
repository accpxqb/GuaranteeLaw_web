import i18n from "../i18n";
const t = i18n.global.t;

export const routes = [];

routes.push({
  path: "/apppay",
  name: "apppay",
  component: () => import("../views/client/pay/AppPay.vue"),
  onMenu: "false",
});

routes.push({
  path: "/homepageManager",
  name: "homepageManager",
  component: () => import("../views/client/HomepageManager.vue"),
  onMenu: "false",
});

routes.push({
  path: "/map",
  name: "map",
  component: () => import("../views/map/map.vue"),
  onMenu: "false",
});

routes.push({
  path: "/AddHotelMap",
  name: "AddHotelMap",
  component: () => import("../views/map/AddHotelMap.vue"),
  onMenu: "false",
});

routes.push({
  path: "/registerMobile",
  name: "registerMobile",
  component: () => import("../views/login/RegisterMobile.vue"),
  meta: { title: "Titles.RegisterMobileTitle" },
});

routes.push({
  path: "/managerVerify",
  name: "managerVerify",
  component: () => import("../views/login/ManagerVerify.vue"),
});

routes.push({
  path: "/login",
  name: "login",
  component: () => import("../views/login/Login.vue"),
  // meta: { title: "Titles.LoginTitle" },
});

routes.push({
  path: "/register",
  name: "register",
  component: () => import("../views/login/Register.vue"),
  meta: { title: "Titles.RegisterTitle" },
});

routes.push({
  path: "/ForgetPwd",
  name: "ForgetPwd",
  component: () => import("../views/login/ForgetPwd.vue"),
});

export const customer = {
  path: "customer",
  name: "customer",
  component: () => import("../views/customer/CustomerLayout.vue"),
  children: [
    {
      path: "home",
      name: "CustomerHome",
      onMenu: true,
      component: () => import("../views/customer/CustomerHome.vue"),
    },
    {
      path: "sourcing",
      name: "MySourcing",
      children: [
        {
          path: "posted",
          name: "PostedSourcingList",
          onMenu: true,
          meta: { status: "posted" },
          component: () => import("../views/client/sourcing/SourcingList.vue"),
        },
        {
          path: "assigned",
          name: "AssignedSourcingList",
          onMenu: true,
          meta: { status: "assigned" },
          component: () => import("../views/client/sourcing/SourcingList.vue"),
        },
        {
          path: "canceled",
          name: "CanceledSourcingList",
          onMenu: true,
          meta: { status: "canceled" },
          component: () => import("../views/client/sourcing/SourcingList.vue"),
        },
      ],
    },
    {
      path: "order",
      name: "MyOrder",
      children: [
        {
          path: "pending",
          name: "PendingOrders",
          onMenu: true,
          meta: { status: "pending" },
          component: () => import("../views/client/order/OrderList.vue"),
        },
        {
          path: "paid",
          name: "PaidOrders",
          onMenu: true,
          meta: { status: "paid" },
          component: () => import("../views/client/order/OrderList.vue"),
        },
        {
          path: "checkIn",
          name: "CheckInOrders",
          onMenu: true,
          meta: { status: "checkIn" },
          component: () => import("../views/client/order/OrderList.vue"),
        },
        {
          path: "completed",
          name: "ClientCompleted",
          onMenu: true,
          meta: { status: "completed" },
          component: () => import("../views/client/order/OrderList.vue"),
        },
      ],
    },
    {
      path: "addComment",
      name: "AddComment",
      component: () => import("../views/customer/comment/CommentForm.vue"),
    },
    // {
    //   path: "followUp",
    //   name: "FollowUp",
    //   component: () => import("../views/client/comment/FollowUpForm.vue"),
    // },
    {
      path: "addPlayComment",
      name: "AddPlayComment",
      component: () => import("../views/customer/comment/PlayCommentForm.vue"),
    },
    {
      path: "addEatComment",
      name: "AddEatComment",
      component: () => import("../views/customer/comment/EatCommentForm.vue"),
    },
    {
      path: "customerProfile",
      name: "CustomerProfile",
      onMenu: true,
      component: () => import("../views/customer/CustomerProfile.vue"),
    },
    {
      path: "SecuritySetting",
      name: "UserSecuritySetting",
      onMenu: true,
      component: () => import("../views/manager/SecuritySetting.vue"),
    },
    {
      path: "SecuritySetting_SetLoginPwd",
      name: "UserSecuritySetting_SetLoginPwd",
      component: () =>
        import("../views/manager/SecuritySetting_SetLoginPwd.vue"),
    },
    {
      path: "SecuritySetting_ResetLoginPwd",
      name: "UserSecuritySetting_ResetLoginPwd",
      component: () =>
        import("../views/manager/SecuritySetting_ResetLoginPwd.vue"),
    },
    {
      path: "SecuritySetting_EditLoginPwd",
      name: "UserSecuritySetting_EditLoginPwd",
      component: () =>
        import("../views/manager/SecuritySetting_EditLoginPwd.vue"),
    },
    {
      path: "SecuritySetting_SetPayPwd",
      name: "UserSecuritySetting_SetPayPwd",
      component: () => import("../views/manager/SecuritySetting_SetPayPwd.vue"),
    },
    {
      path: "SecuritySetting_EditMobile",
      name: "UserSecuritySetting_EditMobile",
      component: () =>
        import("../views/manager/SecuritySetting_EditMobile.vue"),
    },
    {
      path: "SecuritySetting_BindEmail",
      name: "UserSecuritySetting_BindEmail",
      component: () => import("../views/manager/SecuritySetting_BindEmail.vue"),
    },
    {
      path: "SecuritySetting_EditEmail",
      name: "UserSecuritySetting_EditEmail",
      component: () => import("../views/manager/SecuritySetting_EditEmail.vue"),
    },
    {
      path: "SecuritySetting_BindMobile",
      name: "UserSecuritySetting_BindMobile",
      component: () =>
        import("../views/manager/SecuritySetting_BindMobile.vue"),
    },
    {
      path: "myComment",
      name: "MyComment",
      onMenu: true,
      component: () => import("../views/customer/comment/CommentList.vue"),
    },
    {
      path: "idCardVerification",
      name: "IDCardVerification",
      meta: { type: "client" },
      component: () => import("../views/verification/IDCardVerification.vue"),
    },
  ],
};

const hotel = {
  path: "hotel",
  name: "HotelRoutes",
  onMenu: true,
  managerType: 1,
  children: [
    {
      path: "home",
      name: "HotelHome",
      onMenu: true,
      meta: { type: "hotel" },
      component: () => import("../views/manager/ManagerHome.vue"),
    },
    {
      path: "profile",
      name: "HotelProfile",
      onMenu: true,
      component: () => import("../views/manager/ManagerProfile.vue"),
    },

    {
      path: "hotellist",
      name: "HotelList",
      onMenu: true,
      component: () => import("../views/hotel/HotelList.vue"),
    },
    {
      path: "addHotel",
      name: "AddHotel",
      component: () => import("../views/hotel/AddHotel.vue"),
    },
    {
      path: "addHotelRoom",
      name: "AddHotelRoom",
      component: () => import("../views/hotel/AddHotelRoom.vue"),
    },
    {
      path: "grabSourcing",
      name: "GrabSourcing",
      component: () =>
        import("../views/manager/sourcingproperty/GrabSourcing.vue"),
    },
    {
      path: "addresslist",
      name: "AddressList",
      onMenu: true,
      component: () =>
        import("../views/manager/serviceaddress/AddressList.vue"),
    },
    {
      path: "order",
      name: "AllSourcing",
      onMenu: true,
      children: [
        {
          path: "dealList",
          name: "DealList",
          onMenu: true,
          component: () => import("../views/manager/deal/DealList.vue"),
        },
        {
          path: "order/notService", //未服务
          name: "NotService",
          onMenu: true,
          meta: { status: "notService" },
          component: () =>
            import("../views/manager/order/OrderListForManager.vue"),
        },
        {
          path: "order/inService", //服务中
          name: "InService",
          onMenu: true,
          meta: { status: "inService" },
          component: () =>
            import("../views/manager/order/OrderListForManager.vue"),
        },
        {
          path: "order/completed", //已完成
          name: "Completed",
          onMenu: true,
          meta: { status: "completed" },
          component: () =>
            import("../views/manager/order/OrderListForManager.vue"),
        },
      ],
    },
    {
      path: "commentList",
      name: "CommentList",
      onMenu: true,
      component: () => import("../views/manager/comment/CommentList.vue"),
    },
  ],
};

const play = {
  path: "play",
  name: "PlayRoutes",
  onMenu: true,
  managerType: 2,
  children: [
    {
      path: "home",
      name: "PlayHome",
      onMenu: true,
      meta: { type: "play" },
      component: () => import("../views/manager/ManagerHome.vue"),
    },
    {
      path: "profile",
      name: "PlayProfile",
      onMenu: true,
      component: () => import("../views/manager/ManagerProfile.vue"),
    },
    {
      path: "playServices",
      name: "PlayServices",
      onMenu: true,
      component: () => import("../views/play_manager/PlayList.vue"),
    },
    {
      path: "addPlay",
      name: "AddPlay",
      component: () => import("../views/play_manager/PlayServiceForm.vue"),
    },
    {
      path: "editPlay",
      name: "EditPlay",
      component: () => import("../views/play_manager/PlayServiceForm.vue"),
    },
    {
      path: "addItems",
      name: "addItems",
      onMenu: true,
      component: () => import("../views/play_manager/items/AddItems.vue"),
    },
    {
      path: "editPlayProperty",
      name: "EditPlayProperty",
      component: () => import("../views/play_manager/SourcingProperty.vue"),
    },
    {
      path: "order",
      name: "PlayOrder",
      onMenu: true,
      children: [
        {
          path: "dealList",
          name: "PlayDealList",
          onMenu: true,
          component: () => import("../views/play_manager/deal/DealList.vue"),
        },
        {
          path: "notService",
          name: "NotServicePlayOrders",
          onMenu: true,
          component: () => import("../views/play_manager/order/OrderList.vue"),
        },
        {
          path: "inService",
          name: "InServicePlayOrders",
          onMenu: true,
          component: () => import("../views/play_manager/order/OrderList.vue"),
        },
        {
          path: "completed",
          name: "CompletedPlayOrders",
          onMenu: true,
          component: () => import("../views/play_manager/order/OrderList.vue"),
        },
      ],
    },
    {
      path: "commentList",
      name: "PlayCommentList",
      onMenu: true,
      component: () =>
        import("../views/play_manager/comment/PlayCommentList.vue"),
    },
  ],
};

const eat = {
  path: "eat",
  name: "EatRoutes",
  onMenu: true,
  managerType: 3,
  children: [
    {
      path: "home",
      name: "EatHome",
      onMenu: true,
      meta: { type: "eat" },
      component: () => import("../views/manager/ManagerHome.vue"),
    },
    {
      path: "profile",
      name: "EatProfile",
      onMenu: true,
      component: () => import("../views/manager/ManagerProfile.vue"),
    },
    {
      path: "restaurantList",
      name: "RestaurantList",
      onMenu: true,
      component: () =>
        import("../views/eat_manager/restaurant/RestaurantList.vue"),
    },
    {
      path: "addRestaurant",
      name: "AddRestaurant",
      component: () =>
        import("../views/eat_manager/restaurant/RestaurantForm.vue"),
    },
    {
      path: "addPackage",
      name: "AddPackage",
      component: () => import("../views/eat_manager/package/PackageForm.vue"),
    },
    {
      path: "eataddresslist",
      name: "EatAddressList",
      onMenu: true,
      component: () =>
        import("../views/eat_manager/serviceaddress/AddressList.vue"),
    },
    {
      path: "order",
      name: "EatOrder",
      onMenu: true,
      children: [
        {
          path: "dealList",
          name: "EatDealList",
          onMenu: true,
          component: () => import("../views/eat_manager/deal/DealList.vue"),
        },
        {
          path: "editEatProperty",
          name: "EditEatProperty",
          component: () => import("../views/eat_manager/SourcingProperty.vue"),
        },
        {
          path: "notService",
          name: "NotServiceEatOrders",
          onMenu: true,
          component: () => import("../views/eat_manager/order/OrderList.vue"),
        },
        {
          path: "inService",
          name: "InServiceEatOrders",
          onMenu: true,
          component: () => import("../views/eat_manager/order/OrderList.vue"),
        },
        {
          path: "completed",
          name: "CompletedEatOrders",
          onMenu: true,
          component: () => import("../views/eat_manager/order/OrderList.vue"),
        },
      ],
    },
    {
      path: "commentList",
      name: "EatCommentList",
      onMenu: true,
      component: () =>
        import("../views/eat_manager/comment/EatCommentList.vue"),
    },
  ],
};

export const manager = {
  path: "manager",
  name: "manager",
  component: () => import("../views/manager/components/ManagerLayout.vue"),
  children: [
    hotel,
    play,
    eat,
    {
      path: "money",
      name: "MyEarnings",
      onMenu: true,
      children: [
        {
          path: "ManagerRevenue",
          name: "ManagerRevenue",
          onMenu: true,
          component: () => import("../views/manager/ManagerRevenue.vue"),
        },
        {
          path: "CashoutSetting",
          name: "CashoutSetting",
          onMenu: true,
          component: () => import("../views/manager/CashoutSetting.vue"),
        },
        {
          path: "PromotionInfo",
          name: "PromotionInfo",
          onMenu: true,
          component: () =>
            import("../views/manager/promotion/PromotionInfo.vue"),
        },
      ],
    },
    {
      path: "SecuritySetting",
      name: "SecuritySetting",
      onMenu: true,
      component: () => import("../views/manager/SecuritySetting.vue"),
    },
    {
      path: "SecuritySetting_SetPayPwd",
      name: "SecuritySetting_SetPayPwd",
      component: () => import("../views/manager/SecuritySetting_SetPayPwd.vue"),
    },
    {
      path: "SecuritySetting_ResetPayPwd",
      name: "SecuritySetting_ResetPayPwd",
      component: () =>
        import("../views/manager/SecuritySetting_ResetPayPwd.vue"),
    },
    {
      path: "SecuritySetting_EditPayPwd",
      name: "SecuritySetting_EditPayPwd",
      component: () =>
        import("../views/manager/SecuritySetting_EditPayPwd.vue"),
    },
    {
      path: "SecuritySetting_SetLoginPwd",
      name: "SecuritySetting_SetLoginPwd",
      component: () =>
        import("../views/manager/SecuritySetting_SetLoginPwd.vue"),
    },
    {
      path: "SecuritySetting_ResetLoginPwd",
      name: "SecuritySetting_ResetLoginPwd",
      component: () =>
        import("../views/manager/SecuritySetting_ResetLoginPwd.vue"),
    },
    {
      path: "SecuritySetting_EditLoginPwd",
      name: "SecuritySetting_EditLoginPwd",
      component: () =>
        import("../views/manager/SecuritySetting_EditLoginPwd.vue"),
    },

    {
      path: "SecuritySetting_EditMobile",
      name: "SecuritySetting_EditMobile",
      component: () =>
        import("../views/manager/SecuritySetting_EditMobile.vue"),
    },
    {
      path: "SecuritySetting_BindEmail",
      name: "SecuritySetting_BindEmail",
      component: () => import("../views/manager/SecuritySetting_BindEmail.vue"),
    },
    {
      path: "SecuritySetting_EditEmail",
      name: "SecuritySetting_EditEmail",
      component: () => import("../views/manager/SecuritySetting_EditEmail.vue"),
    },
    {
      path: "SecuritySetting_BindMobile",
      name: "SecuritySetting_BindMobile",
      component: () =>
        import("../views/manager/SecuritySetting_BindMobile.vue"),
    },
    {
      path: "idCardVerification",
      name: "IDCardVerification",
      meta: { type: "manager" },
      component: () => import("../views/verification/IDCardVerification.vue"),
    },
    {
      path: "licenseVerification",
      name: "LicenseVerification",
      component: () => import("../views/verification/LicenseVerification.vue"),
    },
  ],
};

routes.push({
  path: "/",
  name: "index",
  component: () => import("../layouts/BaseLayout.vue"),
  children: [
    {
      path: "",
      name: "HomePage",
      component: () => import("../views/client/Homepage.vue"),
      onMenu: "false",
    },
    {
      path: "moreneeds",
      name: "MoreNeeds",
      component: () => import("../views/client/MoreNeeds.vue"),
      onMenu: "false",
    },
    {
      path: "search",
      name: "SearchManager",
      component: () => import("../views/client/SearchManager.vue"),
      // meta: { title: "Titles.LoginTitle" },
    },
    {
      path: "404",
      name: "error",
      component: () => import("@/components/ErrorPage.vue"),
    },
    {
      path: "selectBusiness",
      name: "selectBusiness ",
      component: () => import("../views/manager/signup/SelectBusiness.vue"),
    },
    {
      path: "mobileSignup",
      name: "mobileSignup",
      component: () => import("../views/manager/signup/Signup.vue"),
    },
    {
      path: "uploadInfo/:type",
      name: "uploadInfo",
      component: () => import("../views/manager/signup/UploadInfo.vue"),
    },
    {
      path: "/contactUs",
      name: "ContactUs",
      component: () => import("../views/client/ContactUs.vue"),
    },
    manager,
    customer,
  ],
});
