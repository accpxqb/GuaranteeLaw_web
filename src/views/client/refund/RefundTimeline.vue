<template>
  <el-timeline v-loading="loading">
    <el-timeline-item
      v-if="completedTime"
      :color="getItemColor('completed')"
      :timestamp="completedTime"
    >
      <el-row>
        <el-text> 退款成功 </el-text>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-text size="small"> 退款金额已退回原支付账户 </el-text>
      </el-row>
    </el-timeline-item>

    <el-timeline-item
      v-if="reviewTime"
      :color="getItemColor('review')"
      :timestamp="reviewTime"
    >
      <el-row>
        <el-text> {{ reviewResult.title }} </el-text>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-text size="small"> {{ reviewResult.msg }}</el-text>
      </el-row>
    </el-timeline-item>

    <el-timeline-item
      v-if="interventionTime"
      :color="getItemColor('intervention')"
      :timestamp="interventionTime"
    >
      <el-row>
        <el-text> 客服介入 </el-text>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-text size="small"> 请等待客服与您联系 </el-text>
      </el-row>
    </el-timeline-item>

    <el-timeline-item
      v-if="approvedTime"
      :color="getItemColor('approved')"
      :timestamp="approvedTime"
    >
      <template
        v-if="
          refundStatus == RefundStatusEnums.Approved ||
          refundStatus == RefundStatusEnums.Success
        "
      >
        <el-row>
          <el-text> 经理已同意 </el-text>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-text size="small"> 经理已接受您的退款申请 </el-text>
        </el-row>
      </template>
      <template v-else>
        <el-text> 经理已拒绝 </el-text>
        <el-row style="margin-top: 5px">
          <el-text size="small"> 经理拒绝了您的退款申请 </el-text>
        </el-row>
        <el-row style="margin-top: 5px">
          <el-text size="small">原因:{{ rejectReason }} </el-text>
        </el-row>
      </template>
    </el-timeline-item>

    <el-timeline-item :timestamp="requestTime" :color="getItemColor('request')">
      <el-row>
        <el-text>发起退款申请</el-text>
      </el-row>
      <el-row style="margin-top: 5px">
        <el-text size="small"> 经理审核通过后将为您退款 </el-text>
      </el-row>
    </el-timeline-item>
  </el-timeline>
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue";
import { getRefundByOrderId } from "@/api/refund";
import { RefundStatus as RefundStatusEnums } from "@/utils/enums";

const props = defineProps<{ orderId: number }>();

const loading = ref(false);

const requestTime = ref();
const approvedTime = ref();
const completedTime = ref();
const reviewTime = ref();
const interventionTime = ref();
const refundStatus = ref();
const rejectReason = ref();
const reviewResult = reactive({ title: "", msg: "" });

const isGreen = ref<string | undefined>(undefined);
const getItemColor = (status: string) => {
  return isGreen.value == status ? "green" : "gray";
};
onMounted(() => {
  loading.value = true;
  getRefundByOrderId({ orderId: props.orderId })
    .then((res) => {
      const {
        RequestTime,
        ApprovedTime,
        FinishTime,
        RefundStatus,
        InterventionTime,
        ReviewTime,
        RejectReason,
      } = res.data;
      refundStatus.value = RefundStatus;
      rejectReason.value = RejectReason;
      if (FinishTime) {
        completedTime.value = formatDate(FinishTime);
        isGreen.value ??= "completed";
      }
      if (ReviewTime) {
        reviewTime.value = formatDate(ReviewTime);
        console.log(RefundStatus);
        if (
          RefundStatus == RefundStatusEnums.InterventionApproved ||
          RefundStatus == RefundStatusEnums.InterventionSuccess
        ) {
          reviewResult.title = "客服介入同意退款";
          reviewResult.msg = "客服同意了您的退款申请";
        } else if (RefundStatus == RefundStatusEnums.InterventionRejected) {
          reviewResult.title = "客服介入拒绝退款";
          reviewResult.msg = "客服拒绝了您的退款申请";
        }
        isGreen.value ??= "review";
      }
      if (InterventionTime) {
        interventionTime.value = formatDate(InterventionTime);
        isGreen.value ??= "intervention";
      }
      if (ApprovedTime) {
        approvedTime.value = formatDate(ApprovedTime);
        isGreen.value ??= "approved";
      }
      requestTime.value = formatDate(RequestTime);
      isGreen.value ??= "request";
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 300);
    });
});

function formatDate(timeStr: string) {
  return timeStr.replace("T", " ");
}
</script>
