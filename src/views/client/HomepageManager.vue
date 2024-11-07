<template>
  <div class="common-layout">
    <el-scrollbar>
      <el-container>
        <el-header style="padding: 0">
          <BaseHeader :show-logo="true" />
        </el-header>

        <el-main style="padding: 0">
          <el-row justify="center">
            <el-col :span="16">
              <el-row justify="center">
                <el-col :span="24">
                  <ManagerDetail
                    v-if="managerType == 1"
                    :manager-id="managerId"
                    :manager-type="1"
                  />
                  <PlayManagerDetail
                    v-if="managerType == 2"
                    :manager-id="managerId"
                    :manager-type="2"
                  ></PlayManagerDetail>
                  <EatManagerDetail
                    v-if="managerType == 3"
                    :manager-id="managerId"
                    :manager-type="3"
                  ></EatManagerDetail>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-main>

        <el-footer style="padding: 0; margin-top: 20px">
          <BaseFooter />
        </el-footer>
      </el-container>
    </el-scrollbar>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, onBeforeMount } from "vue";
import { useElementSize } from "@vueuse/core";
import BaseFooter from "@/components/BaseFooter.vue";
import BaseHeader from "@/components/BaseHeader.vue";
import ManagerDetail from "@/views/client/components/ManagerDetail.vue";
import PlayManagerDetail from "./manager/PlayManagerDetail.vue";
import { computed } from "@vue/reactivity";
import { useRoute, useRouter } from "vue-router";
import EatManagerDetail from "./manager/EatManagerDetail.vue";

const route = useRoute();
const router = useRouter();

const imageRef = ref();
const imageSize = useElementSize(imageRef);
const carouselHeight = computed(() => {
  return imageSize.height.value;
});
const managerId = ref();
const managerType = ref();
onBeforeMount(() => {
  managerId.value = Number(route.query.managerId);
  managerType.value = Number(route.query.managerType);
});
</script>

<style>
.common-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* .el-space :last-child {
    margin-right: 0 !important
  } */
</style>
