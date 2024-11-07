<template>
  <div v-for="sourcing in sourcingList" :key="sourcing.SourcingId">
    <SourcingCard
      v-if="sourcing.SourcingType == 1&&sourcing.SourcingObj"
      :sourcing="sourcing.SourcingObj"
      style="margin-bottom: 20px"
    >
      <template #cardHeader>
        <div class="card-header">
          <div class="card-header">
            <el-image
              style="width: 35px; height: 35px; margin-right: 20px"
              :src="hotel_icon"
            />
            <span v-if="headerType == 1"> 乐住需求 </span>
            <span v-else-if="headerType == 2">
              {{
                "乐住需求 [服务经理" + sourcing.SourcingObj.ManagerName + "]"
              }}
            </span>
          </div>

          <el-button
            round
            @click="handleCancel(sourcing.SourcingId)"
            v-if="sourcing.SourcingStatus != -1"
          >
            取消发布
          </el-button>
        </div>
      </template>

      <template #operationButton>
        <el-button
          @click="sourcing.IsShowResponse = !sourcing.IsShowResponse"
          type="primary"
          size="large"
          style="width: 100%; height: 35.6px"
          v-if="sourcing.SourcingStatus == 1 || sourcing.SourcingStatus == 4"
        >
          查看应答
          <el-icon>
            <ArrowRight />
          </el-icon>
        </el-button>

        <el-button
          disabled
          type="primary"
          size="large"
          style="width: 100%; height: 35.6px"
          v-if="sourcing.SourcingStatus == 0"
        >
          暂无应答
        </el-button>
      </template>

      <template #managerRes>
        <ManagerResponse
          v-if="sourcing.IsShowResponse"
          :isShowBtn="true"
          :sourcingId="sourcing.SourcingId"
        >
        </ManagerResponse>
      </template>
    </SourcingCard>
   
    <SourcingPlayCard
      v-if="sourcing.SourcingType == 2&&sourcing.SourcingObj"
      :sourcing="sourcing.SourcingObj"
      style="margin-bottom: 20px"
    >
      <template #cardHeader>
        <div class="card-header">
          <div class="card-header">
            <el-image
              style="width: 35px; height: 35px; margin-right: 20px"
              :src="play_icon"
            />
            <span v-if="headerType == 1"> 乐玩需求 </span>
            <span v-else-if="headerType == 2">
              {{
                "乐玩需求 [服务经理" + sourcing.SourcingObj.ManagerName + "]"
              }}
            </span>
          </div>
          <el-button
            round
            @click="handleCancel(sourcing.SourcingId)"
            v-if="sourcing.SourcingStatus != -1"
          >
            取消发布
          </el-button>
        </div>
      </template>

      <template #operationButton>
        <el-button
          @click="sourcing.IsShowResponse = !sourcing.IsShowResponse"
          type="primary"
          size="large"
          style="width: 100%; height: 35.6px"
          v-if="sourcing.SourcingStatus == 1 || sourcing.SourcingStatus == 4"
        >
          查看应答
          <el-icon>
            <ArrowRight />
          </el-icon>
        </el-button>

        <el-button
          disabled
          type="primary"
          size="large"
          style="width: 100%; height: 35.6px"
          v-if="sourcing.SourcingStatus == 0"
        >
          暂无应答
        </el-button>
      </template>

      <template #managerRes>
        <PlayResponse
          v-if="sourcing.IsShowResponse"
          :sourcing-id="sourcing.SourcingId"
          :sourcing-time="[
            sourcing.SourcingObj.BeginTime,
            sourcing.SourcingObj.EndTime,
          ]"
        ></PlayResponse>
      </template>
    </SourcingPlayCard>
   
    <SourcingEatCard
      v-if="sourcing.SourcingType == 3&&sourcing.SourcingObj"
      :sourcing="sourcing.SourcingObj"
      style="margin-bottom: 20px"
    >
      <template #cardHeader>
        <div class="card-header">
          <div class="card-header">
            <el-image
              style="width: 35px; height: 35px; margin-right: 20px"
              :src="eat_icon"
            />
            <span v-if="headerType == 1"> 乐食需求 </span>
            <span v-else-if="headerType == 2">
              {{
                "乐食需求 [服务经理" + sourcing.SourcingObj.ManagerName + "]"
              }}
            </span>
          </div>
          <el-button
            round
            @click="handleCancel(sourcing.SourcingId)"
            v-if="sourcing.SourcingStatus != -1"
          >
            取消发布
          </el-button>
        </div>
      </template>

      <template #operationButton>
        <el-button
          @click="sourcing.IsShowResponse = !sourcing.IsShowResponse"
          type="primary"
          size="large"
          style="width: 100%; height: 35.6px"
          v-if="sourcing.SourcingStatus == 1 || sourcing.SourcingStatus == 4"
        >
          查看应答
          <el-icon>
            <ArrowRight />
          </el-icon>
        </el-button>

        <el-button
          disabled
          type="primary"
          size="large"
          style="width: 100%; height: 35.6px"
          v-if="sourcing.SourcingStatus == 0"
        >
          暂无应答
        </el-button>
      </template>

      <template #managerRes>
        <EatResponse
          v-if="sourcing.IsShowResponse"
          :sourcing-id="sourcing.SourcingId"
          :sourcing-time="[
            sourcing.SourcingObj.BeginTime,
            sourcing.SourcingObj.EndTime,
          ]"
        ></EatResponse>
      </template>
    </SourcingEatCard>
   
  </div>
  <el-pagination
    background
    layout="prev, pager, next, total"
    :total="total"
    v-model:current-page="page.CurrentPage"
    v-model:page-size="page.PageSize"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :hide-on-single-page="true"
  />

  <BaseEmpty v-show="total <= 0" description="暂无需求"></BaseEmpty>

  <RoomPicDialog
    :dialog-visible="dialogVisible"
    :is-sourcing-room="true"
    :room-id="sourcingRoomId"
    @closeDialog="dialogVisible = false"
  >
  </RoomPicDialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, provide, onUnmounted } from "vue";
import { getSourcingList } from "@/api/sourcing.js";
import type { Sourcing } from "@/types/sourcing";
import { cancelPostingBase } from "@/api/sourcing";
import ManagerResponse from "./ManagerResponse.vue";
import SourcingCard from "../../components/sourcing/SourcingCard.vue";
import SourcingPlayCard from "../../components/sourcing/SourcingPlayCard.vue";
import SourcingEatCard from "../../components/sourcing/SourcingEatCard.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import { SourcingStatus, ManagerType } from "@/utils/enums.js";
import RoomPicDialog from "@/components/RoomPicDialog.vue";
import BaseEmpty from "@/components/BaseEmpty.vue";
import { usePageStore } from "@/stores/counter";
import type { PageRequest } from "@/types/page-request";
import play_icon from "@/assets/images/乐玩@2x.png";
import eat_icon from "@/assets/images/乐食.png";
import hotel_icon from "@/assets/images/乐住@2x.png";
import PlayResponse from "./PlayResponse.vue";
import EatResponse from "./EatResponse.vue";

interface SourcingPageRequest extends PageRequest {
  IsOrientation?: boolean;
  SourcingStatus?: number;
  SourcingId?: number;
  SourcingType?: number;
}

const page: SourcingPageRequest = reactive({
  PastPage: 0,
  CurrentPage: 1,
  PageSize: 10,
});

const dialogVisible = ref(false);
const sourcingRoomId = ref(0);
function updateDialog(vis: boolean, id: number) {
  dialogVisible.value = vis;
  sourcingRoomId.value = id;
}
provide("dialog", { updateDialog });

const sourcingList = ref<any[]>([]);
const router = useRouter();
const headerType = ref(0);

onMounted(() => {
  clearStore();
  getSourcingListByStatus();
});

onUnmounted(() => {
  clearStore();
});

// watch(router.currentRoute, () => {
//   clearStore();
//   getSourcingListByStatus();
// });

const pageStore = usePageStore();
const getPageStore = () => {
  if (pageStore.Page.CurrentPage > 0) {
    page.CurrentPage = pageStore.Page.CurrentPage;
    page.PageSize = pageStore.Page.PageSize;
  }
};
const clearStore = () => {
  pageStore.Page.CurrentPage = 1;
  pageStore.Page.PageSize = 10;
};

const handleCurrentChange = (val: number) => {
  pageStore.Page.CurrentPage = val;
  getSourcingListByStatus();
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};

const total = ref(0);
const getSourcingListByStatus = () => {
  const routerValue = router.currentRoute.value;
  if (!routerValue.meta || !routerValue.meta.status) return;
  const { status } = routerValue.meta;
  switch (status) {
    case "posted":
      headerType.value = 1;
      page.SourcingStatus = SourcingStatus.Pending;
      page.IsOrientation = false;
      break;
    case "canceled":
      headerType.value = 1;
      page.SourcingStatus = SourcingStatus.Canceled;

      break;
    case "assigned":
      headerType.value = 2;
      page.SourcingStatus = SourcingStatus.Pending;
      page.IsOrientation = true;
      break;
    default:
      return;
  }
  getPageStore();
  getSourcingList(page).then((res: any) => {
    if (res) {
      total.value = res.data.count;
      sourcingList.value = [...res.data.data];
      console.log("s", sourcingList.value);
    }
  });
};

const handleCancel = (sourcingId: any) => {
  if (!sourcingId) {
    return;
  }
  ElMessageBox.confirm("确认取消发布此需求吗?", "取消需求", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      cancelPostingBase({ sourcingId })
        .then((res: any) => {
          if (res.code === 1) {
            ElMessage({
              type: "success",
              message: "取消成功",
            });
            setTimeout(() => {
              getSourcingListByStatus();
            }, 300);
          } else {
            ElMessage({
              type: "error",
              message: "失败",
            });
          }
        })
        .catch(() => {});
    })
    .catch(() => {
      // catch error
    });
};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  height: 10px;
}

.el-button {
  --el-text-color-regular: #27ae60;
  --el-font-weight-primary: 500;
}
</style>
