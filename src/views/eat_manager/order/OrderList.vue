<template>
  <template v-for="(order, index) in orderList" :key="order.Id">
    <SourcingEatCard
      :sourcing="order.OrderObject.SourcingEatInfo"
      style="margin-bottom: 20px"
    >
      <template #cardHeader>
        <el-row justify="space-between">
          <el-col :span="12" style="text-align: left">
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
          style="margin-top: 1em"
          body-style="padding:1em"
        >
          <template v-for="proPackage in order.OrderObject.Packages">
            <EatInfo :eat="proPackage"></EatInfo>
            <el-divider style="margin-top: 1em" />
            <EatDetails :details="proPackage.PackageDetails"></EatDetails>
          </template>
        </el-card>
        <el-row style="margin-top: 10px">
          <el-col
            :span="24"
            style="text-align: right"
            v-if="pageRequest.OrderStatus == OrderStatus.Paid"
          >
            <el-button @click="btnCheckIn(order.Id)" type="success">
              开始服务
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
        <template v-if="order.OrderStatus == OrderStatus.Completed">
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
                  >{{ order.RefundAmount }}元
                </el-text>
              </template>
            </el-col>
          </el-row>
        </template>
      </template>
    </SourcingEatCard>
  </template>

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
import { ref, reactive, onMounted, toRefs, provide, watch } from "vue";
import SourcingEatCard from "../../components/sourcing/SourcingEatCard.vue";
import EatInfo from "../../components/eat/EatInfo.vue";
import EatDetails from "../../components/eat/EatDetails.vue";
import { checkIn, getOrderList } from "../../../api/orderbase";
import type { PageRequest } from "@/types/page-request";
import { ManagerType } from "@/utils/enums";
import type { Refund } from "@/types/refund";
import { ElMessage, ElMessageBox } from "element-plus";
import { agreeRefund } from "@/api/refund";
import { OrderStatus, OrderRefundStatus, RefundStatus } from "@/utils/enums";
import config from "@/utils/config";
import BaseEmpty from "@/components/BaseEmpty.vue";
import { useRouter } from "vue-router";

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
  ManagerType: ManagerType.乐食,
});

const total = ref(0);
const orderList = ref<any>([]);

const router = useRouter();
watch(
  () => router.currentRoute.value,
  (val) => {
    const name = String(val.name);
    initRequest(name);
    getOrders();
  }
);

const initRequest = (name: string) => {
  switch (name) {
    case "NotServiceEatOrders":
      pageRequest.OrderStatus = 1;
      break;
    case "InServiceEatOrders":
      pageRequest.OrderStatus = 5;
      break;
    case "CompletedEatOrders":
      pageRequest.OrderStatus = 2;
      break;
    default:
      break;
  }
};
onMounted(() => {
  initRequest(String(router.currentRoute.value.name));
  getOrders();
});

const getOrders = () => {
  getOrderList(pageRequest).then((res: any) => {
    if (res.code == 1) {
      total.value = res.data.count;
      orderList.value = res.data.data;
      orderList.value.forEach((order: any) => {
        if (order.RefundInfo && order.RefundInfo.Pictures.length) {
          order.RefundInfo.Pictures = order.RefundInfo?.Pictures.map(
            (url: any) => {
              //给url加上域名
              return config.CONFIG_IMGURL + url;
            }
          );
        }
        order.OrderObject.Packages.forEach((p: any) => {
          p.PackageAmenitys = p.PackageAmenitys.split(",");
          p.PackageDetails = JSON.parse(p.PackageDetails);
          p.PackagePicList = JSON.parse(p.PackagePicList);
          p.Banquet = order.OrderObject.Banquet;
        });
      });
    }
  });
};
const dialogVisible = ref(false);
const sourcingRoomId = ref(0);
function updateDialog(vis: boolean, id: number) {
  dialogVisible.value = vis;
  sourcingRoomId.value = id;
}
provide("dialog", { updateDialog });

/**退款 */
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

/**
 * 联系客户
 */
const contactDialogVisible = ref(false);
const contactsInfo = reactive({
  name: "",
  phone: "",
  email: "",
});

const showCustomerContacts = (order: any) => {
  console.log(order);
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

const btnCheckIn = (orderId: number) => {
  ElMessageBox.confirm("确认开始服务吗?", "提示", {
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
            router.push({ name: "InServiceEatOrders" });
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
</script>
<style scoped></style>
