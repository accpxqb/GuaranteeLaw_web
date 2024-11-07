<template>
  <template
    v-for="(sourcing, index) in sourcingList"
    :key="sourcing.SourcingId"
  >
    <SourcingEatCard
      :sourcing="sourcing.SourcingEatInfo"
      style="margin-bottom: 20px"
    >
      <template #cardHeader>
        <div class="card-header">
          <span>
            {{
              "发布时间" +
              ": " +
              formatTime(sourcing.SourcingEatInfo.CreateTime)
            }}
          </span>
          <el-button link>
            <el-icon
              size="30"
              color="white"
              @click="abandonDeal(sourcing.DealId)"
              v-if="sourcing.DealStatus == 0"
            >
              <Close />
            </el-icon>
          </el-button>
        </div>
      </template>

      <template #operationButton>
        <el-button
          size="large"
          type="success"
          style="width: 100%; height: 88%"
          @click="takeOrder(sourcing)"
          v-if="sourcing.DealStatus == 0"
        >
          抢单
        </el-button>
        <template
          v-if="sourcing.IsModification == 0 && sourcing.DealStatus == 1"
        >
          <el-button
            size="large"
            type="success"
            style="width: 100%; height: 88%"
            :disabled="true"
          >
            已回复
          </el-button>
        </template>

        <template
          v-if="sourcing.IsModification >= 1 && sourcing.DealStatus == 1"
        >
          <el-button
            @click="takeOrder(sourcing)"
            size="large"
            type="danger"
            style="width: 100%; height: 88%"
          >
            待改单
          </el-button>
        </template>
      </template>
    </SourcingEatCard>
  </template>
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
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import SourcingEatCard from "../../components/sourcing/SourcingEatCard.vue";
import { SourcingStatus } from "../../../utils/enums.js";
import { getEatDealList } from "../../../api/deal";
import type { Deal } from "../../../types/sourcing";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import { getManagerInfo } from "../../../api/user.js";
import { useUserDataStore } from "@/stores/counter";

const { t } = useI18n();
interface DealPageRequest {
  AbandonDealId?: number;
  Status: number;
  PastPage: number;
  CurrentPage: number;
  PageSize: number;
}

const page: DealPageRequest = reactive({
  Status: SourcingStatus.Pending,
  PastPage: 0,
  CurrentPage: 1,
  PageSize: 10,
});

const total = ref(0);
const handleCurrentChange = (val: number) => {
  page.CurrentPage = val;
  getPendingSourcingList();
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};

const sourcingList = ref<any[]>([]);

onMounted(() => {
  getPendingSourcingList();
});

const abandonDeal = (dealId: any) => {
  if (!dealId) {
    return;
  }
  page.AbandonDealId = dealId;
  getPendingSourcingList();
};

const getPendingSourcingList = () => {
  getEatDealList(page).then((res: any) => {
    if (res) {
      console.log("eatres", res);
      total.value = res.data.count;
      sourcingList.value = [...res.data.data];
    }
  });
};

const formatTime = (time: any) => {
  if (!time) {
    return;
  }
  return time.toString().substring(0, 16).replace("T", " ");
};

const router = useRouter();

const takeOrder = (sourcing: any) => {
  getManagerInfo().then((res: any) => {
    if (res.data) {
      //localStorage.setItem("userData", JSON.stringify(res.data));
      if (!res.data.Mobile) {
        ElMessage.error("请先填写联系电话");
        router.push({ name: "SecuritySetting" });
        return;
      }
    }
  });
  router.push({
    name: "EditEatProperty",
    query: {
      sourcingId: sourcing.SourcingId,
      IsModification: sourcing.IsModification,
    },
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
</style>
