<template>
  <el-row justify="center" class="center-row">
    <el-col :span="16">
      <el-container>
        <el-aside width="200px" style="padding: 0">
          <!-- <el-affix :offset="65"> -->
          <el-card
            :body-style="{ padding: '0px' }"
            shadow="never"
            style="margin-top: 15px"
          >
            <el-menu
              @select="handleSelect"
              :router="true"
              class="manager-menu"
              :default-active="activeMenu"
              v-if="baseRouter"
            >
              <template v-for="item in baseRouter.children" :key="item.name">
                <RecursiveMenuItem
                  :item="item"
                  :parent-path="'/' + baseRouter.path"
                ></RecursiveMenuItem>
              </template>
            </el-menu>
          </el-card>
          <!-- </el-affix> -->
        </el-aside>
        <el-main style="padding-top: 0; padding-right: 0">
          <el-card
            :body-style="{ paddingTop: '10px', paddingBottom: '10px' }"
            v-if="currentBreadcrumbList.length > 0"
            class=".no-border-card"
            shadow="never"
            style="margin-top: 15px"
          >
            <el-breadcrumb :separator-icon="ArrowRight">
              <el-breadcrumb-item
                v-for="item in currentBreadcrumbList"
                :to="item.to"
                :key="item.title"
              >
                <el-text tag="b"> {{ $t(item.title) }}</el-text>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </el-card>
          <div style="margin-top: 20px">
            <router-view v-slot="{ Component, route }">
              <transition name="el-fade-in-linear">
                <div>
                  <component :is="Component" :key="route.name"></component>
                </div>
              </transition>
            </router-view>
          </div>
        </el-main>
      </el-container>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { customer, manager } from "@/router/routes.js";
import { useCounterStore, useUserDataStore } from "@/stores/counter";
import { BusinessType } from "@/utils/enums";
import RecursiveMenuItem from "@/components/RecursiveMenuItem.vue";

interface BreadcrumbItem {
  title: string;
  to: string;
  onMenu?: boolean;
}

interface RouterInfo {
  name: string;
  path: string;
  onMenu?: boolean;
  children?: RouterInfo[];
}

const props = defineProps<{
  menuSource: "manager" | "customer";
}>();

const useStore = useUserDataStore();

const counterStore: { [key: string]: any } = useCounterStore();
const router = useRouter();
const activeMenu = ref();
const baseRouter = ref();
const breadcrumbItemList: BreadcrumbItem[] = [];
const currentBreadcrumbList = ref<BreadcrumbItem[]>([]);

onMounted(() => {
  // console.log(router.currentRoute.value);
  baseRouter.value = { manager, customer }[props.menuSource];
  if (props.menuSource == "manager") {
    const retain = useStore.userExtends.filter(
      (item: any) => item.VerifyStatus == 1
    );
    baseRouter.value.children = baseRouter.value.children.filter(
      (element: any) => {
        return (
          !element.managerType ||
          retain.some((item: any) => item.ManagerType === element.managerType)
        );
      }
    );
  }
  if (!baseRouter.value) return;
  generateBreadcrumb(baseRouter.value.children, "/" + baseRouter.value.path);
  currentBreadcrumbList.value = counterStore[props.menuSource + "BcList"];
  currentBreadcrumbList.value.length
    ? (activeMenu.value = currentBreadcrumbList.value[0].to)
    : pushBreadcrumb(router.currentRoute.value.path);
});

onUnmounted(() => {
  counterStore.customerBcList = [];
  counterStore.managerBcList = [];
});

const generateBreadcrumb = (
  arr: RouterInfo[],
  parentPath: string,
  index: number = 0
) => {
  if (index >= arr.length) return;
  const router = arr[index];
  const to =
    parentPath !== router.path ? `${parentPath}/${router.path}` : parentPath;
  breadcrumbItemList.push({
    title: router.name,
    to: to,
    onMenu: router.onMenu,
  });
  if (router.children) generateBreadcrumb(router.children, to);
  generateBreadcrumb(arr, parentPath, index + 1);
};

watch(router.currentRoute, () => {
  let routeValue = router.currentRoute.value;
  let index: number = currentBreadcrumbList.value.findIndex(
    (e: { to: string }) => e.to == routeValue.path
  );
  if (index > -1) {
    currentBreadcrumbList.value.splice(index + 1);
    activeMenu.value = routeValue.path;
  } else {
    pushBreadcrumb(routeValue.path);
  }
});

const pushBreadcrumb = (path: string) => {
  let b = breadcrumbItemList.find((e) => e.to == path);
  if (b?.onMenu) {
    currentBreadcrumbList.value = [];
    activeMenu.value = path;
  }
  currentBreadcrumbList.value.push({
    title: b ? b.title : "获取失败",
    to: path,
  });
  counterStore[`${props.menuSource}BcList`] = currentBreadcrumbList.value;
};

const handleSelect = (
  index: any,
  indexPath: any,
  item: any,
  routeResult: any
) => {
  if (
    currentBreadcrumbList.value.length == 1 &&
    currentBreadcrumbList.value[0].to == item.route
  )
    return;
  currentBreadcrumbList.value = [];
};
</script>
<style scoped>
@import "@/styles/manager/menu-style.css";

.common-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* background-color: #F5F5F5; */
}

.manager-menu :deep(.el-menu-item.is-active) {
  background-color: #f2f8f3 !important;
}
</style>
