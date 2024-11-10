<template>
  <div class="common-layout">
    <el-container>
      <el-header class="clear-padding" height="50px">
        <BaseHeader :show-logo="false" ref="baseHeader" />
      </el-header>
      <el-scrollbar
        :height="`${height - 50}px`"
        ref="scrollbarRef"
        @scroll="handleContentScroll"
      >
        <el-container>
          <el-main
            class="clear-padding"
            :style="{ minHeight: `${height - 50 - 260}px` }"
          >
            <router-view></router-view>
          </el-main>
          <el-footer class="clear-padding" style="height: 260px">
            <BaseFooter />
          </el-footer>
        </el-container>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { RouterView, useRouter } from "vue-router";
import BaseFooter from "@/components/BaseFooter.vue";
import BaseHeader from "@/components/NewBaseHeader.vue";
import { useWindowSize } from "@vueuse/core";
import { ref, watch } from "vue";
import type  ElScrollbar  from "element-plus";
const { width, height } = useWindowSize();

//监听router变化，跳转新的页面后让滚动条回到顶部
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const router = useRouter();
watch(router.currentRoute, () => {
  scrollbarRef.value!.setScrollTop(0);
});

const baseHeader = ref();
const handleContentScroll = (ev: any) => {
  if (
    router.currentRoute.value.name == "HomePage" ||
    router.currentRoute.value.name == "SearchManager"
  ) {
    baseHeader.value.showLogo = ev.scrollTop > 100;
  }
};
</script>

<style>
.common-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.clear-padding {
  padding: 0;
}
</style>
