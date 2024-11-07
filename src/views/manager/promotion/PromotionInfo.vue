<template>
  <div
    style="
      border-top-right-radius: 8px;
      border-top-left-radius: 8px;
      border: 1px solid #b7b7b7;
    "
  >
    <div
      style="
        display: flex;
        background-color: #3bbf59;
        align-items: center;
        border-top-right-radius: 8px;
        border-top-left-radius: 8px;
      "
    >
      <div style="width: 100px; height: 100px">
        <el-image style="width: 100px; height: 100px" :src="pic" />
      </div>
      <div style="color: white">
        <div>收益中心</div>
        <!-- <div style="margin-top: 0.5em; font-size: small">用户名：123123123</div> -->
      </div>
    </div>
    <div
      style="
        display: flex;
        justify-content: space-around;
        padding: 1em;
        align-items: center;
      "
    >
      <div>
        <div>
          我的收入
          <el-button type="success" link @click="showRebateRecord">
            收入记录
          </el-button>
        </div>
        <div style="font-size: large">{{ promotionInfo.income }}元</div>
      </div>
      <el-divider direction="vertical" style="height: 2em"></el-divider>
      <div>
        <div>
          累计收益
          <el-button type="success" link @click="showPromotionRebate">
            收益记录
          </el-button>
        </div>
        <div style="font-size: large">{{ promotionInfo.gain }}元</div>
      </div>
      <el-divider direction="vertical" style="height: 2em"></el-divider>
      <div>
        <div>
          推广人数
          <el-button type="success" link @click="showPromotionDetail">
            查看明细
          </el-button>
        </div>
        <div style="font-size: large">{{ promotionInfo.peopleNum }}人</div>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="promotionDetailVisible"
    title="推广明细"
    destroy-on-close
    center
  >
    <PromotionDetail></PromotionDetail>
  </el-dialog>
  <el-dialog
    v-model="promotionRebateVisible"
    title="累计收益"
    destroy-on-close
    center
  >
    <UnsettledRecords></UnsettledRecords>
  </el-dialog>
  <el-dialog
    v-model="rebateRecordVisible"
    title="我的收入"
    destroy-on-close
    center
  >
    <IncomeRecords></IncomeRecords>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import pic from "@/assets/images/推广收益.png";
import PromotionDetail from "./PromotionDetail.vue";
import IncomeRecords from "./IncomeRecords.vue";
import UnsettledRecords from "./UnsettledRecords.vue";
import { getRevenue } from "@/api/promotion";
import { ElMessage } from "element-plus";

const promotionInfo = reactive({
  peopleNum: 0,
  income: 0,
  gain: 0,
});

onMounted(() => {
  getRevenue().then((res: any) => {
    // console.log("re-res", res);
    if (res.code === 1) {
      // console.log("res", res);
      promotionInfo.gain = res.data.AccumulatedGain;
      promotionInfo.peopleNum = res.data.Number;
      promotionInfo.income = res.data.AccumulatedIncome;
    } else {
      // ElMessage.info(res.msg);
    }
  });
});

const promotionDetailVisible = ref(false);
const promotionRebateVisible = ref(false);
const rebateRecordVisible = ref(false);
//显示推广人数
const showPromotionDetail = () => {
  promotionDetailVisible.value = true;
};

//显示未结算
const showPromotionRebate = () => {
  promotionRebateVisible.value = true;
};

//显示已结算
const showRebateRecord = () => {
  rebateRecordVisible.value = true;
};
</script>
<style scoped></style>
