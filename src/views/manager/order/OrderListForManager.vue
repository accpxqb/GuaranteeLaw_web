<template>
  <template v-for="(order, index) in orderList" :key="order.Id">
    <SourcingCard
      :sourcing="order.OrderObject.SourcingInfo"
      style="margin-bottom: 10px"
    >
      <template #cardHeader>
        <el-row justify="space-between">
          <el-col :span="12" style="text-align: left">
            <!-- <div class="card-header"> -->
            <el-button
              v-if="pageRequest.OrderStatus != OrderStatus.Completed"
              @click="showCustomerContacts(order)"
            >
              联系客户
            </el-button>
            <el-text v-else style="color: white">
              {{ order.IsSettlement == 2 ? "本单佣金" : "未结算佣金" }}:
              {{
                order.ManagerRevenueLogInfo
                  ? order.ManagerRevenueLogInfo.Amount + "元"
                  : "处理中"
              }}
            </el-text>
            <!-- </div> -->
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-text style="color: white">
              订单编号：{{ order.OrderNO }}
            </el-text>
          </el-col>
        </el-row>
      </template>
      <template #managerRes>
        <el-card
          shadow="never"
          :body-style="{ padding: '0px' }"
          style="margin-top: 10px"
        >
          <SourcingRoomRow
            v-for="room in order.OrderObject.OrderRooms"
            :key="room.Id"
            :hotel-name="order.OrderObject.HotelInfo.Name"
            :room="room"
          >
          </SourcingRoomRow>
          <el-divider style="margin: 0" />
          <el-row class="row-margin">
            <el-col :span="24" style="text-align: right">
              <el-text tag="b" size="large">客户支付:</el-text>
              <el-text type="danger" size="large">
                {{ order.TotalAmount }}元
              </el-text>
              <template
                v-if="
                  order.RefundAmount &&
                  order.RefundAmount > 0 &&
                  order.RefundStatus == OrderRefundStatus.Refunded
                "
              >
                <el-text tag="b" size="large" style="margin-left: 10px">
                  {{ $t("AddSourcing.RefundedAmount") }}:</el-text
                >
                <el-text type="danger" size="large"
                  >{{ order.RefundAmount }}元</el-text
                >
              </template>
            </el-col>
          </el-row>
        </el-card>
        <el-row style="margin-top: 10px">
          <el-col
            :span="24"
            style="text-align: right"
            v-if="pageRequest.OrderStatus == OrderStatus.Paid"
          >
            <el-button @click="btnCheckIn(order.Id)" type="success">
              开始入住
            </el-button>
          </el-col>
        </el-row>
        <el-card
          :body-style="{ padding: '10px' }"
          shadow="never"
          style="margin-top: 10px"
          v-if="
            order.RefundStatus == OrderRefundStatus.Refunding &&
            order.RefundInfo?.RefundStatus == RefundStatus.Pending &&
            order.OrderStatus != OrderStatus.Completed
          "
          v-loading="refunding && refundId == order.RefundInfo.Id"
        >
          <el-row align="middle" justify="space-between">
            <el-col :span="3" style="text-align: center; align-items: center">
              <el-row justify="center">
                <el-text size="large" tag="b">申请</el-text>
              </el-row>
              <el-row justify="center">
                <el-text size="large" tag="b">退款</el-text>
              </el-row>
            </el-col>
            <el-divider direction="vertical" style="margin: 0; height: 100px" />
            <el-col :span="16">
              <el-row>
                <el-text tag="b">退款原因及描述:&nbsp;</el-text>
                <el-text>{{
                  `${order.RefundInfo?.RefundReason}/${order.RefundInfo?.Notes}`
                }}</el-text>
              </el-row>
              <el-row
                style="margin-top: 10px"
                v-if="order.RefundInfo?.Pictures[0]"
              >
                <el-image
                  style="width: 50px; height: 50px"
                  :src="order.RefundInfo?.Pictures[0]"
                  :zoom-rate="1.2"
                  :preview-src-list="order.RefundInfo?.Pictures"
                  :initial-index="1"
                  fit="cover"
                />
              </el-row>
              <el-row style="margin-top: 10px">
                <el-text tag="b">退款金额:&nbsp;</el-text>
                <el-text size="large" type="warning">{{
                  order.RefundInfo?.RefundAmount
                }}</el-text>
              </el-row>
            </el-col>
            <el-col :span="4">
              <el-row justify="end">
                <el-button
                  type="danger"
                  @click="rejectRefund(order.RefundInfo)"
                >
                  拒绝
                </el-button>
              </el-row>
              <el-row justify="end">
                <el-button
                  type="success"
                  style="margin-top: 10px"
                  @click="refundAgreed(order.RefundInfo, true)"
                >
                  同意
                </el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-card>
      </template>
    </SourcingCard>
  </template>
  <el-pagination
    background
    layout="prev, pager, next, total"
    :total="total"
    v-model:current-page="pageRequest.CurrentPage"
    v-model:page-size="pageRequest.PageSize"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :hide-on-single-page="true"
  />

  <RoomPicDialog
    :dialog-visible="dialogVisible"
    :is-sourcing-room="true"
    :room-id="sourcingRoomId"
    @closeDialog="dialogVisible = false"
  >
  </RoomPicDialog>

  <BaseEmpty v-show="total <= 0" description="暂无订单"></BaseEmpty>

  <!-- 联系方式 -->
  <el-dialog
    v-model="contactDialogVisible"
    title="客户联系方式"
    width="20%"
    destroy-on-close
    center
  >
    <div>
      <span style="font-weight: bold">姓名：</span>{{ contactsInfo.name }}
    </div>
    <div style="margin-top: 8px">
      <span style="font-weight: bold">手机：</span>{{ contactsInfo.phone }}
    </div>
    <div style="margin-top: 8px">
      <span style="font-weight: bold">邮箱：</span>{{ contactsInfo.email }}
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="contactDialogVisible = false">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 拒绝退款原因 -->
  <el-dialog
    v-model="rejectReasonDialogVisible"
    title="拒绝退款原因"
    width="20%"
    destroy-on-close
    v-if="curRefundInfo"
    @close="curRefundInfo = undefined"
  >
    <el-input
      type="textarea"
      :autosize="{ minRows: 4, maxRows: 8 }"
      :maxlength="200"
      show-word-limit
      v-model="curRefundInfo.RejectReason"
    >
    </el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="rejectReasonDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="refundAgreed(curRefundInfo, false)"
          :disabled="(curRefundInfo.RejectReason ??= '').trim() === ''"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref, provide, watch, onUnmounted, reactive } from "vue";
import { useRouter } from "vue-router";
import SourcingCard from "../../components/sourcing/SourcingCard.vue";
import type { PageRequest } from "@/types/page-request";
import type { Order } from "@/types/sourcing";
import { getOrderListForManager } from "@/api/order";
import { checkIn, completed, getOrderList } from "@/api/orderbase";

import SourcingRoomRow from "../../components/SourcingRoomRow.vue";
import RoomPicDialog from "@/components/RoomPicDialog.vue";
import BaseEmpty from "@/components/BaseEmpty.vue";
import { OrderStatus, OrderRefundStatus, RefundStatus } from "@/utils/enums";
import { ElMessageBox, ElMessage } from "element-plus";
import { usePageStore } from "@/stores/counter";
import config from "@/utils/config";
import { agreeRefund } from "@/api/refund";
import type { Refund } from "@/types/refund";
import { ManagerType } from "@/utils/enums";

interface OrderPageRequest extends PageRequest {
  OrderStatus?: number;
  UserId?: number;
  OrderId?: number;
  ManagerType: number;
}

const pageRequest: OrderPageRequest = reactive({
  OrderStatus: 1,
  UserId: 0,
  PastPage: 0,
  CurrentPage: 1,
  PageSize: 10,
  ManagerType: ManagerType.乐住, //乐住
});

const total = ref(0);
const orderList = ref<any[]>([]);
const pageStore = usePageStore();
const getPageStore = () => {
  if (pageStore.Page.CurrentPage > 0) {
    pageRequest.CurrentPage = pageStore.Page.CurrentPage;
    pageRequest.PageSize = pageStore.Page.PageSize;
  }
};
const clearStore = () => {
  pageStore.Page.CurrentPage = 1;
  pageStore.Page.PageSize = 10;
};
onMounted(() => {
  getOrders();
});

onUnmounted(() => {
  clearStore();
});

const router = useRouter();
watch(router.currentRoute, () => {
  clearStore();
  getOrders();
});

const handleCurrentChange = (val: number) => {
  pageStore.Page.CurrentPage = val;
  getOrders();
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};

const getOrders = () => {
  const routerValue = router.currentRoute.value;
  if (!routerValue.meta || !routerValue.meta.status) return;
  const { status } = routerValue.meta;
  switch (status) {
    /**
     * 待服务对应客户已付款
     */
    case "notService":
      pageRequest.OrderStatus = OrderStatus.Paid;
      break;
    /**
     * 服务中对应客户已入住
     */
    case "inService":
      pageRequest.OrderStatus = OrderStatus.CheckIn;
      break;
    /**
     * 已完成
     */
    case "completed":
      pageRequest.OrderStatus = OrderStatus.Completed;
      break;
    default:
      return;
  }
  getPageStore();
  getOrderList(pageRequest).then((res: any) => {
    total.value = res.data.count;
    orderList.value = res.data.data;
    orderList.value.forEach((order) => {
      console.log(order);
      if (!order.RefundInfo) return;
      if (!order.RefundInfo.Pictures.length) return;
      order.RefundInfo.Pictures = order.RefundInfo?.Pictures.map((url: any) => {
        //给url加上域名
        return config.CONFIG_IMGURL + url;
      });
      //console.log(order.RefundInfo?.Pictures);
    });
  });
};

const btnCheckIn = (orderId: number) => {
  ElMessageBox.confirm("确认客户已入住吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      checkIn({ orderId: orderId }).then((res: any) => {
        //跳转到服务中
        if (res.code === 1) {
          ElMessage({
            message: "成功!",
            type: "success",
          });
          setTimeout(() => {
            router.push({ name: "InService" });
          }, 300);
        } else {
          ElMessage.error(res.data.msg);
        }
      });
    })
    .catch(() => {
      // ElMessage({
      //     type: 'info',
      //     message: '已取消',
      // })
    });
};

const btnComplete = (orderId: number) => {
  ElMessageBox.confirm("确认完成此订单吗?", "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      completed({ orderId: orderId }).then((res: any) => {
        if (res.code === 1) {
          ElMessage({
            message: "成功!",
            type: "success",
          });
          setTimeout(() => {
            router.push({ name: "Completed" });
          }, 300);
        } else {
          ElMessage.error(res.data.msg);
        }
      });
    })
    .catch(() => {
      // ElMessage({
      //     type: 'info',
      //     message: '已取消',
      // })
    });
};

const dialogVisible = ref(false);
const sourcingRoomId = ref(0);
function updateDialog(vis: boolean, id: number) {
  dialogVisible.value = vis;
  sourcingRoomId.value = id;
}
provide("dialog", { updateDialog });

const refunding = ref(false);
const refundId = ref(0);
const refundAgreed = (refundInfo: Refund | undefined, isApproved: boolean) => {
  if (!refundInfo || !refundInfo.Id) {
    ElMessage.error("refundInfo is null");
    return;
  }
  if (refunding.value) {
    ElMessage.error("正在处理中");
    return;
  }
  if (!isApproved && refundInfo.RejectReason?.trim() === "") {
    ElMessage.error("请填写拒绝原因");
    return;
  }
  //弹窗提醒
  let str = isApproved ? "确认同意退款吗?" : "确认拒绝退款吗?";
  ElMessageBox.confirm(str, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      rejectReasonDialogVisible.value = false;
      refundInfo.IsApproved = isApproved;
      refunding.value = true;
      refundId.value = refundInfo.Id as number;
      agreeRefund(refundInfo)
        .then((res: any) => {
          if (res.code === 1) {
            ElMessage({
              message: "成功!",
              type: "success",
            });
            setTimeout(() => {
              getOrders();
            }, 300);
          } else {
            ElMessage.error(res.msg);
          }
        })
        .finally(() => {
          refunding.value = false;
          curRefundInfo.value = undefined;
        });
    })
    .catch(() => {});
};

const contactDialogVisible = ref(false);
const contactsInfo = reactive({
  name: "",
  phone: "",
  email: "",
});

const showCustomerContacts = (order: Order) => {
  contactsInfo.name = order.CustomerName ??= "";
  contactsInfo.phone = order.CustomerMobile ??= "未绑定";
  contactsInfo.email = order.CustomerEmail ??= "";
  contactDialogVisible.value = true;
};

const curRefundInfo = ref<Refund>();
//弹出拒绝原因对话框
const rejectReasonDialogVisible = ref(false);
//拒绝退款
const rejectRefund = (refundInfo: Refund) => {
  curRefundInfo.value = refundInfo;
  rejectReasonDialogVisible.value = true;
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

.row-margin {
  margin: 10px 10px 10px 10px;
}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  /* width: 100%; */
}
</style>
