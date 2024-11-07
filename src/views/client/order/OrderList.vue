<template>
  <template v-for="(order, index) in orderList" :key="order.Id">
    <SourcingCard
      v-if="order.OrderType == ManagerType.乐住"
      :sourcing="order.OrderObject.SourcingInfo"
      style="margin-bottom: 10px"
    >
      <template #cardHeader>
        <div class="card-header">
          <el-space>
            <el-image style="width: 30px; height: 30px" :src="hotel_icon" />

            <el-text style="color: white">
              {{
                $t("ManagerResponseVue.Manager") +
                ":" +
                order.OrderObject.ManagerName
              }}
            </el-text>
            <el-popover placement="top-start" :width="250" trigger="hover">
              <el-row v-if="order.OrderObject.ManagerMobile">
                <el-col :span="8">联系电话:</el-col>
                <el-col :span="16">{{
                  order.OrderObject.ManagerMobile
                }}</el-col>
              </el-row>
              <el-row v-if="order.OrderObject.ManagerEmail">
                <el-col :span="8">联系邮箱:</el-col>
                <el-col :span="16">{{ order.OrderObject.ManagerEmail }}</el-col>
              </el-row>
              <template #reference>
                <el-icon><InfoFilled /></el-icon>
              </template>
            </el-popover>
          </el-space>

          <el-link
            style="color: white"
            :underline="false"
            @click="
              toManagerDetail(order.OrderObject.ManagerId, order.OrderType)
            "
          >
            <el-avatar
              style="margin-right: 8px"
              fit="fill"
              :size="30"
              :src="getAvatarNew(order.OrderObject.ManagerPhotoPath)"
            >
            </el-avatar>
            {{ $t("ManagerHome") }}>>
          </el-link>
        </div>
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
            <el-col :span="12"> 订单编号：{{ order.OrderNO }} </el-col>
            <el-col :span="12" style="text-align: right">
              <el-text tag="b" size="large"
                >{{ $t("AddSourcing.Total") }}:</el-text
              >
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
        <el-row style="margin-top: 10px" align="bottom" justify="end">
          <el-col
            :span="12"
            style="margin-top: 20px"
            v-if="
              pageRequest.OrderStatus != OrderStatus.Completed &&
              [
                OrderRefundStatus.Refunding,
                OrderRefundStatus.RefundPass,
                OrderRefundStatus.RefundReject,
                OrderRefundStatus.CsIntervention,
                OrderRefundStatus.CsReject,
              ].includes(order.RefundStatus)
            "
          >
            <el-text
              v-if="order.RefundStatus == OrderRefundStatus.Refunding"
              type="warning"
            >
              申请退款中，等待经理审核
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.RefundPass"
              type="warning"
            >
              经理审核通过，等待平台退款
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.RefundReject"
              type="warning"
            >
              经理拒绝退款
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.CsIntervention"
              type="warning"
            >
              请等待客服与您联系
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.CsReject"
              type="warning"
            >
              您的退款申请被驳回
            </el-text>
            <el-button @click="showTimeline(order.Id)" link>查看进度</el-button>
          </el-col>
          <el-col
            :span="12"
            v-if="
              pageRequest.OrderStatus == OrderStatus.Pending ||
              pageRequest.OrderStatus == OrderStatus.Progress
            "
          >
            <div style="font-size: 13px; line-height: 32px">
              请在<label style="color: red">{{
                timefilter(order.TimeExpire)
              }}</label
              >内支付，逾期订单将自动取消
            </div>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button
              type="success"
              @click="btnCheckIn(order.Id)"
              v-if="pageRequest.OrderStatus == OrderStatus.Paid"
            >
              <template v-if="order.OrderType == ManagerType.乐玩">
                开始服务
              </template>
              <template v-else> 开始入住 </template>
            </el-button>
            <el-button
              type="danger"
              @click="handleRefund(order.Id, order.TotalAmount, 'add')"
              v-if="order.RefundNum < 2
                                && [OrderStatus.Paid, OrderStatus.CheckIn].includes(pageRequest.OrderStatus as number)
                                && [OrderRefundStatus.NoRefund, OrderRefundStatus.RefundCancel].includes(order.RefundStatus)"
            >
              申请退款
            </el-button>
            <el-button
              type="danger"
              @click="toIntervention(order.Id)"
              v-if="order.RefundStatus == OrderRefundStatus.RefundReject"
            >
              客服介入
            </el-button>
            <template
              v-if="
                pageRequest.OrderStatus == OrderStatus.Pending ||
                pageRequest.OrderStatus == OrderStatus.Progress
              "
            >
              <el-button type="danger" @click="cancelOrder(order.Id)">
                重新下单
              </el-button>
              <el-button type="success" @click="btnDeal(order)">付款</el-button>
            </template>
            <template
              v-if="
                pageRequest.OrderStatus != OrderStatus.Completed &&
                [
                  OrderRefundStatus.Refunding,
                  OrderRefundStatus.RefundPass,
                  OrderRefundStatus.RefundReject,
                  OrderRefundStatus.CsIntervention,
                ].includes(order.RefundStatus)
              "
            >
              <!-- <el-button
                type="danger"
                @click="handleRefund(order.Id, order.TotalAmount, 'edit')"
              >
                修改申请
              </el-button> -->
              <el-button type="success" @click="handleCancel(order.Id)">
                撤销申请
              </el-button>
            </template>
            <el-button
              type="success"
              @click="btnCompleted(order)"
              v-if="pageRequest.OrderStatus == OrderStatus.CheckIn"
            >
              完成服务
            </el-button>
            <template v-if="pageRequest.OrderStatus == OrderStatus.Completed">
              <el-button type="danger" @click="handleDelete(order.Id)">
                删除订单
              </el-button>
              <el-button
                type="success"
                @click="toComment(order.Id, order.ManagerId, order.OrderType)"
                v-if="order.CommentStatus == CommentStatus.UnComment"
              >
                评价经理
              </el-button>
              <!-- <el-button
                type="success"
                @click="toFollowUp(order.Id)"
                v-if="order.CommentStatus == CommentStatus.Commented"
              >
                追评
              </el-button> -->
              <el-button
                v-if="order.RefundStatus == OrderRefundStatus.Refunded"
                type="success"
                @click="showTimeline(order.Id)"
              >
                查看退款信息
              </el-button>
            </template>
          </el-col>
        </el-row>
      </template>
    </SourcingCard>
    <SourcingPlayCard
      v-if="order.OrderType == ManagerType.乐玩"
      :sourcing="order.OrderObject.SourcingPlayInfo"
      style="margin-bottom: 10px"
    >
      <template #cardHeader>
        <div class="card-header">
          <el-space>
            <el-image style="width: 30px; height: 30px" :src="play_icon" />

            <el-text style="color: white">
              {{
                $t("ManagerResponseVue.Manager") +
                ":" +
                order.OrderObject.ManagerName
              }}
            </el-text>
            <el-popover placement="top-start" :width="250" trigger="hover">
              <el-row v-if="order.OrderObject.ManagerMobile">
                <el-col :span="8">联系电话:</el-col>
                <el-col :span="16">{{
                  order.OrderObject.ManagerMobile
                }}</el-col>
              </el-row>
              <el-row v-if="order.OrderObject.ManagerEmail">
                <el-col :span="8">联系邮箱:</el-col>
                <el-col :span="16">{{ order.OrderObject.ManagerEmail }}</el-col>
              </el-row>
              <template #reference>
                <el-icon><InfoFilled /></el-icon>
              </template>
            </el-popover>
          </el-space>
          <el-link
            style="color: white"
            :underline="false"
            @click="
              toManagerDetail(order.OrderObject.ManagerId, order.OrderType)
            "
          >
            <el-avatar
              style="margin-right: 8px"
              fit="fill"
              :size="30"
              :src="getAvatarNew(order.OrderObject.ManagerPhotoPath)"
            >
            </el-avatar>
            {{ $t("ManagerHome") }}>>
          </el-link>
        </div>
      </template>
      <template #managerRes>
        <el-card
          shadow="never"
          :body-style="{ padding: '0px' }"
          style="margin-top: 10px"
        >
          <div style="padding: 1em">
            <PlayInfo :play="order.OrderObject"></PlayInfo>
            <PlayDetails
              :play-details="order.OrderObject.PlayDetails"
            ></PlayDetails>
          </div>
          <el-divider style="margin: 0" />
          <el-row class="row-margin">
            <el-col :span="12" style="font-size: small">
              订单编号：{{ order.OrderNO }}
            </el-col>
            <el-col :span="12" style="text-align: right">
              <el-text tag="b" size="large"
                >{{ $t("AddSourcing.Total") }}:</el-text
              >
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
                  {{ $t("AddSourcing.RefundedAmount") }}:
                </el-text>
                <el-text type="danger" size="large">
                  {{ order.RefundAmount }}元
                </el-text>
              </template>
            </el-col>
          </el-row>
          <div style="margin-left: 10px; margin-bottom: 10px; font-size: small">
            <span>
              {{
                `开始时间：
             ${formatTime(order.BeginTime)}
              -  
             结束时间：
             ${formatTime(order.EndTime)}`
              }}
            </span>
          </div>
        </el-card>
        <el-row style="margin-top: 10px" align="bottom" justify="end">
          <el-col
            :span="12"
            style="margin-top: 20px"
            v-if="
              pageRequest.OrderStatus != OrderStatus.Completed &&
              [
                OrderRefundStatus.Refunding,
                OrderRefundStatus.RefundPass,
                OrderRefundStatus.RefundReject,
                OrderRefundStatus.CsIntervention,
                OrderRefundStatus.CsReject,
              ].includes(order.RefundStatus)
            "
          >
            <el-text
              v-if="order.RefundStatus == OrderRefundStatus.Refunding"
              type="warning"
            >
              申请退款中，等待经理审核
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.RefundPass"
              type="warning"
            >
              经理审核通过，等待平台退款
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.RefundReject"
              type="warning"
            >
              经理拒绝退款
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.CsIntervention"
              type="warning"
            >
              请等待客服与您联系
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.CsReject"
              type="warning"
            >
              您的退款申请被驳回
            </el-text>
            <el-button @click="showTimeline(order.Id)" link>查看进度</el-button>
          </el-col>
          <el-col
            :span="12"
            v-if="
              pageRequest.OrderStatus == OrderStatus.Pending ||
              pageRequest.OrderStatus == OrderStatus.Progress
            "
          >
            <div style="font-size: 13px; line-height: 32px">
              请在
              <label style="color: red">
                {{ timefilter(order.TimeExpire) }}
              </label>
              内支付，逾期订单将自动取消
            </div>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button
              type="success"
              @click="btnCheckIn(order.Id)"
              v-if="pageRequest.OrderStatus == OrderStatus.Paid"
            >
              开始服务
            </el-button>
            <el-button
              type="danger"
              @click="handleRefund(order.Id, order.TotalAmount, 'add')"
              v-if="order.RefundNum < 2
                                && [OrderStatus.Paid, OrderStatus.CheckIn].includes(pageRequest.OrderStatus as number)
                                && [OrderRefundStatus.NoRefund, OrderRefundStatus.RefundCancel].includes(order.RefundStatus)"
            >
              申请退款
            </el-button>
            <el-button
              type="danger"
              @click="toIntervention(order.Id)"
              v-if="order.RefundStatus == OrderRefundStatus.RefundReject"
            >
              客服介入
            </el-button>
            <template
              v-if="
                pageRequest.OrderStatus == OrderStatus.Pending ||
                pageRequest.OrderStatus == OrderStatus.Progress
              "
            >
              <el-button type="danger" @click="cancelOrder(order.Id)">
                重新下单
              </el-button>
              <el-button type="success" @click="btnDeal(order)">付款</el-button>
            </template>
            <template
              v-if="
                pageRequest.OrderStatus != OrderStatus.Completed &&
                [
                  OrderRefundStatus.Refunding,
                  OrderRefundStatus.RefundPass,
                  OrderRefundStatus.RefundReject,
                  OrderRefundStatus.CsIntervention,
                ].includes(order.RefundStatus)
              "
            >
              <!-- <el-button
                type="danger"
                @click="handleRefund(order.Id, order.TotalAmount, 'edit')"
              >
                修改申请
              </el-button> -->
              <el-button type="success" @click="handleCancel(order.Id)">
                撤销申请
              </el-button>
            </template>
            <el-button
              type="success"
              @click="btnCompleted(order)"
              v-if="pageRequest.OrderStatus == OrderStatus.CheckIn"
            >
              完成服务
            </el-button>
            <template v-if="pageRequest.OrderStatus == OrderStatus.Completed">
              <el-button type="danger" @click="handleDelete(order.Id)">
                删除订单
              </el-button>
              <el-button
                type="success"
                @click="toComment(order.Id, order.ManagerId, order.OrderType)"
                v-if="order.CommentStatus == CommentStatus.UnComment"
              >
                评价经理
              </el-button>
              <!-- <el-button
                type="success"
                @click="toFollowUp(order.Id)"
                v-if="order.CommentStatus == CommentStatus.Commented"
              >
                追评
              </el-button> -->
              <el-button
                v-if="order.RefundStatus == OrderRefundStatus.Refunded"
                type="success"
                @click="showTimeline(order.Id)"
              >
                查看退款信息
              </el-button>
            </template>
          </el-col>
        </el-row>
      </template>
    </SourcingPlayCard>
    <SourcingEatCard
      v-if="order.OrderType == ManagerType.乐食"
      :sourcing="order.OrderObject.SourcingEatInfo"
      style="margin-bottom: 10px"
    >
      <template #cardHeader>
        <div class="card-header">
          <el-space>
            <el-image style="width: 30px; height: 30px" :src="eat_icon" />

            <el-text style="color: white">
              {{
                $t("ManagerResponseVue.Manager") +
                ":" +
                order.OrderObject.ManagerName
              }}
            </el-text>
            <el-popover placement="top-start" :width="250" trigger="hover">
              <el-row v-if="order.OrderObject.ManagerMobile">
                <el-col :span="8">联系电话:</el-col>
                <el-col :span="16">{{
                  order.OrderObject.ManagerMobile
                }}</el-col>
              </el-row>
              <el-row v-if="order.OrderObject.ManagerEmail">
                <el-col :span="8">联系邮箱:</el-col>
                <el-col :span="16">{{ order.OrderObject.ManagerEmail }}</el-col>
              </el-row>
              <template #reference>
                <el-icon><InfoFilled /></el-icon>
              </template>
            </el-popover>
          </el-space>
          <el-link
            style="color: white"
            :underline="false"
            @click="
              toManagerDetail(order.OrderObject.ManagerId, order.OrderType)
            "
          >
            <el-avatar
              style="margin-right: 8px"
              fit="fill"
              :size="30"
              :src="getAvatarNew(order.OrderObject.ManagerPhotoPath)"
            >
            </el-avatar>
            {{ $t("ManagerHome") }}>>
          </el-link>
        </div>
      </template>
      <template #managerRes>
        <el-card
          shadow="never"
          :body-style="{ padding: '0px' }"
          style="margin-top: 10px"
        >
          <div style="padding: 1em">
            <template v-for="proPackage in order.OrderObject.Packages">
              <EatInfo :eat="proPackage"></EatInfo>
              <el-divider style="margin-top: 1em" />
              <EatDetails :details="proPackage.PackageDetails"></EatDetails>
            </template>
          </div>
          <el-divider style="margin: 0" />
          <el-row class="row-margin">
            <el-col :span="12" style="font-size: small">
              订单编号：{{ order.OrderNO }}
            </el-col>
            <el-col :span="12" style="text-align: right">
              <el-text tag="b" size="large"
                >{{ $t("AddSourcing.Total") }}:</el-text
              >
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
                  {{ $t("AddSourcing.RefundedAmount") }}:
                </el-text>
                <el-text type="danger" size="large">
                  {{ order.RefundAmount }}元
                </el-text>
              </template>
            </el-col>
          </el-row>
          <div style="margin-left: 10px; margin-bottom: 10px; font-size: small">
            <span>
              {{
                `开始时间：
             ${formatTime(order.BeginTime)}`
              }}
            </span>
          </div>
        </el-card>
        <el-row style="margin-top: 10px" align="bottom" justify="end">
          <el-col
            :span="12"
            style="margin-top: 20px"
            v-if="
              pageRequest.OrderStatus != OrderStatus.Completed &&
              [
                OrderRefundStatus.Refunding,
                OrderRefundStatus.RefundPass,
                OrderRefundStatus.RefundReject,
                OrderRefundStatus.CsIntervention,
                OrderRefundStatus.CsReject,
              ].includes(order.RefundStatus)
            "
          >
            <el-text
              v-if="order.RefundStatus == OrderRefundStatus.Refunding"
              type="warning"
            >
              申请退款中，等待经理审核
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.RefundPass"
              type="warning"
            >
              经理审核通过，等待平台退款
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.RefundReject"
              type="warning"
            >
              经理拒绝退款
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.CsIntervention"
              type="warning"
            >
              请等待客服与您联系
            </el-text>
            <el-text
              v-else-if="order.RefundStatus == OrderRefundStatus.CsReject"
              type="warning"
            >
              您的退款申请被驳回
            </el-text>
            <el-button @click="showTimeline(order.Id)" link>查看进度</el-button>
          </el-col>
          <el-col
            :span="12"
            v-if="
              pageRequest.OrderStatus == OrderStatus.Pending ||
              pageRequest.OrderStatus == OrderStatus.Progress
            "
          >
            <div style="font-size: 13px; line-height: 32px">
              请在
              <label style="color: red">
                {{ timefilter(order.TimeExpire) }}
              </label>
              内支付，逾期订单将自动取消
            </div>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button
              type="success"
              @click="btnCheckIn(order.Id)"
              v-if="pageRequest.OrderStatus == OrderStatus.Paid"
            >
              开始服务
            </el-button>
            <el-button
              type="danger"
              @click="handleRefund(order.Id, order.TotalAmount, 'add')"
              v-if="order.RefundNum < 2
                                && [OrderStatus.Paid, OrderStatus.CheckIn].includes(pageRequest.OrderStatus as number)
                                && [OrderRefundStatus.NoRefund, OrderRefundStatus.RefundCancel].includes(order.RefundStatus)"
            >
              申请退款
            </el-button>
            <el-button
              type="danger"
              @click="toIntervention(order.Id)"
              v-if="order.RefundStatus == OrderRefundStatus.RefundReject"
            >
              客服介入
            </el-button>
            <template
              v-if="
                pageRequest.OrderStatus == OrderStatus.Pending ||
                pageRequest.OrderStatus == OrderStatus.Progress
              "
            >
              <el-button type="danger" @click="cancelOrder(order.Id)">
                重新下单
              </el-button>
              <el-button type="success" @click="btnDeal(order)">付款</el-button>
            </template>
            <template
              v-if="
                pageRequest.OrderStatus != OrderStatus.Completed &&
                [
                  OrderRefundStatus.Refunding,
                  OrderRefundStatus.RefundPass,
                  OrderRefundStatus.RefundReject,
                  OrderRefundStatus.CsIntervention,
                ].includes(order.RefundStatus)
              "
            >
              <!-- <el-button
                type="danger"
                @click="handleRefund(order.Id, order.TotalAmount, 'edit')"
              >
                修改申请
              </el-button> -->
              <el-button type="success" @click="handleCancel(order.Id)">
                撤销申请
              </el-button>
            </template>
            <el-button
              type="success"
              @click="btnCompleted(order)"
              v-if="pageRequest.OrderStatus == OrderStatus.CheckIn"
            >
              完成服务
            </el-button>
            <template v-if="pageRequest.OrderStatus == OrderStatus.Completed">
              <el-button type="danger" @click="handleDelete(order.Id)">
                删除订单
              </el-button>
              <el-button
                type="success"
                @click="toComment(order.Id, order.ManagerId, order.OrderType)"
                v-if="order.CommentStatus == CommentStatus.UnComment"
              >
                评价经理
              </el-button>
              <!-- <el-button
                type="success"
                @click="toFollowUp(order.Id)"
                v-if="order.CommentStatus == CommentStatus.Commented"
              >
                追评
              </el-button> -->
              <el-button
                v-if="order.RefundStatus == OrderRefundStatus.Refunded"
                type="success"
                @click="showTimeline(order.Id)"
              >
                查看退款信息
              </el-button>
            </template>
          </el-col>
        </el-row>
      </template>
    </SourcingEatCard>
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

  <el-dialog
    v-model="payVisible"
    :show-close="true"
    destroy-on-close
    width="550"
  >
    <template #header>
      <div class="my-header">
        <h4 style="margin: 0px; text-align: center">请选择支付方式</h4>
      </div>
    </template>
    <Pay @dopay="btndopay" :orderId="orderId"></Pay>
  </el-dialog>

  <el-dialog v-model="ispay" :show-close="true" destroy-on-close width="550">
    <WeiXinPay :url="url" :total="totalAmount"></WeiXinPay>
  </el-dialog>

  <el-dialog
    v-model="refundVisible"
    :show-close="true"
    destroy-on-close
    title="申请退款"
    width="35%"
    center
  >
    <RefundCard
      :max-refund-amount="maxRefundAmount"
      :order-id="refundOrderId"
      :type="refundCardType"
    >
    </RefundCard>
  </el-dialog>
  <el-dialog
    v-model="refundStepsVisible"
    :show-close="true"
    destroy-on-close
    title="退款进度"
    width="25%"
    center
  >
    <RefundTimeline :order-id="refundOrderId"></RefundTimeline>
  </el-dialog>
  <el-dialog
    v-model="interventionVisible"
    :show-close="true"
    destroy-on-close
    title="申请客服介入"
    width="35%"
    center
  >
    <CSInterventionCard :order-id="refundOrderId"> </CSInterventionCard>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, provide, watch, onUnmounted, reactive } from "vue";
import { useRouter } from "vue-router";
import SourcingCard from "../../components/sourcing/SourcingCard.vue";
import SourcingPlayCard from "../../components/sourcing/SourcingPlayCard.vue";
import SourcingEatCard from "../../components/sourcing/SourcingEatCard.vue";
import type { PageRequest } from "@/types/page-request";
import type { Order } from "@/types/sourcing";
import {
  reorder,
  checkIn,
  completed,
  deleteOrder,
  getOrderList,
} from "@/api/orderbase";
import { getAvatar, getAvatarNew } from "@/utils/helper";
import SourcingRoomRow from "../../components/SourcingRoomRow.vue";
import RoomPicDialog from "@/components/RoomPicDialog.vue";
import BaseEmpty from "@/components/BaseEmpty.vue";
import {
  OrderStatus,
  OrderRefundStatus,
  CommentStatus,
  ManagerType,
} from "@/utils/enums";
import { ElMessageBox, ElMessage } from "element-plus";
import Pay from "../pay/Pay.vue";
import WeiXinPay from "../pay/WeiXinPay.vue";
import { usePageStore } from "@/stores/counter";
import { formateTimeStamp } from "../../../utils/formatter";
import RefundCard from "../refund/RefundCard.vue";
import RefundTimeline from "../refund/RefundTimeline.vue";
import { cancelRefund } from "@/api/refund";
import CSInterventionCard from "../refund/CSInterventionCard.vue";
import play_icon from "@/assets/images/乐玩@2x.png";
import hotel_icon from "@/assets/images/乐住@2x.png";
import eat_icon from "@/assets/images/乐食.png";
import PlayDetails from "@/views/components/play/PlayDetails.vue";
import PlayInfo from "@/views/components/play/PlayInfo.vue";
import EatInfo from "@/views/components/eat/EatInfo.vue";
import EatDetails from "@/views/components/eat/EatDetails.vue";
import { formatTime } from "@/utils/helper.js";
const btnCheckIn = (orderId: number) => {
  checkIn({ orderId: orderId }).then((res: any) => {
    if (res.code === 1) {
      //跳转到服务中
      router.push({ name: "CheckInOrders" });
    } else {
    }
  });
};
const btnCompleted = (order: Order) => {
  if (
    ![
      OrderRefundStatus.NoRefund,
      OrderRefundStatus.RefundCancel,
      OrderRefundStatus.Refunded,
    ].includes(order.RefundStatus)
  ) {
    ElMessageBox.confirm("你还有退款申请，确定要完成服务吗?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      completed({ orderId: order.Id }).then((res: any) => {
        if (res.code === 1) {
          //跳转到服务中
          router.push({ name: "ClientCompleted" });
        }
      });
    });
  } else {
    completed({ orderId: order.Id }).then((res: any) => {
      if (res.code === 1) {
        //跳转到服务中
        router.push({ name: "ClientCompleted" });
      }
    });
  }
};
const timefilter = (val: number) => {
  if (val > 0) {
    let formateLimitTimes = formateTimeStamp(val);
    let txt = `${formateLimitTimes.hour} : ${formateLimitTimes.min} :${formateLimitTimes.seconds}`;
    return txt;
  } else {
    const twtxt = `00:00:00`;
    return twtxt;
  }
};
const isInterval = ref(false);
const interval = () => {
  setInterval(() => {
    orderList.value.forEach((order) => {
      order.TimeExpire -= 1;
    });
  }, 1000);
};
const intervalId = ref<any>();
const startInterval = () => {
  console.log(1);
  intervalId.value = setInterval(() => {
    orderList.value.forEach((order) => {
      order.TimeExpire -= 1;
    });
  }, 1000);
};

const stopInterval = () => {
  clearInterval(intervalId.value);
  intervalId.value = undefined;
};

const url = ref("");
const totalAmount = ref(0);
const btndopay = (u: string) => {
  url.value = u;
  payVisible.value = false;
  ispay.value = true;
};
const ispay = ref(false);
const orderId = ref(0);
const payVisible = ref(false);
const btnDeal = (order: Order) => {
  payVisible.value = true;
  totalAmount.value = order.TotalAmount;
  orderId.value = order.Id;
};

interface OrderPageRequest extends PageRequest {
  OrderStatus?: number;
  UserId?: number;
}

const pageRequest: OrderPageRequest = reactive({
  OrderStatus: 1,
  UserId: 0,
  PastPage: 0,
  CurrentPage: 1,
  PageSize: 10,
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
  clearStore();
  getOrders();
});

onUnmounted(() => {
  clearStore();
});

const router = useRouter();
// watch(router.currentRoute, () => {
//   clearStore();
//   getOrders();
// });

const handleCurrentChange = (val: number) => {
  pageStore.Page.CurrentPage = val;
  getOrders();
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const loading = ref(false);
const getOrders = () => {
  const routerValue = router.currentRoute.value;
  if (!routerValue.meta || !routerValue.meta.status) return;
  const { status } = routerValue.meta;
  switch (status) {
    case "completed":
      pageRequest.OrderStatus = OrderStatus.Completed;
      break;
    case "checkIn":
      pageRequest.OrderStatus = OrderStatus.CheckIn;
      break;
    case "paid":
      pageRequest.OrderStatus = OrderStatus.Paid;
      break;
    case "canceled":
      pageRequest.OrderStatus = OrderStatus.Canceled;
      break;
    case "pending":
      pageRequest.OrderStatus = OrderStatus.Pending;
      // interval()
      stopInterval();
      startInterval();
      break;
    default:
      return;
  }
  getPageStore();

  loading.value = true;
  getOrderList(pageRequest)
    .then((res: any) => {
      total.value = res.data.count;
      orderList.value = res.data.data;
      console.log(orderList.value);
      loading.value = false;
      orderList.value.forEach((order) => {
        if (order.OrderType == ManagerType.乐玩) {
          console.log(order.OrderObject);
          order.OrderObject.PlayAmenitys =
            order.OrderObject.PlayAmenitys.split(",");
          order.OrderObject.PlayItems = order.OrderObject.PlayItems.split(",");
          order.OrderObject.PlayDetails = JSON.parse(
            order.OrderObject.PlayDetails
          );
          order.OrderObject.PicList = order.OrderObject.PicList.map(
            (pic: any) => {
              return pic.Url;
            }
          );
        }
        if (order.OrderType == ManagerType.乐食) {
          order.OrderObject.Packages.forEach((p: any) => {
            p.PackageAmenitys = p.PackageAmenitys.split(",");
            p.PackageDetails = JSON.parse(p.PackageDetails);
            p.PackagePicList = JSON.parse(p.PackagePicList);
            p.Banquet = order.OrderObject.Banquet;
          });
        }
      });
    })
    .finally(() => {
      setTimeout(() => {
        loading.value = false;
      }, 1000);
    });
};

const dialogVisible = ref(false);
const sourcingRoomId = ref(0);
function updateDialog(vis: boolean, id: number) {
  dialogVisible.value = vis;
  sourcingRoomId.value = id;
}

provide("dialog", { updateDialog });

const toManagerDetail = (id: number, type: number) => {
  var path = router.resolve({
    path: "/homepageManager",
    query: { managerId: id, managerType: type },
  });
  window.open(path.href, "_blank");
};

const cancelOrder = (orderId: number) => {
  ElMessageBox.confirm("确认取消此订单吗?", "取消订单", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      reorder({ orderId })
        .then((res: any) => {
          if (res.code === 1) {
            ElMessage({
              type: "success",
              message: "订单取消成功",
            });
            // //定时0.3s 刷新页面
            // setTimeout(() => { getOrders() }, 300)
            //跳转到已发布
            router.push({ name: "PostedSourcingList" });
          } else if (res.code === 2) {
            ElMessage({ type: "success", message: "成功" });
            //跳转到已付款
            router.push({ name: "PaidOrders" });
          } else {
            ElMessage({
              type: "error",
              message: "订单取消失败",
            });
          }
        })
        .catch(() => {});
    })
    .catch(() => {
      // catch error
    });
};

//退款
const refundVisible = ref(false);
const refundStepsVisible = ref(false);
const refundOrderId = ref();
const maxRefundAmount = ref();
const refundCardType = ref<"add" | "edit">("edit");
const handleRefund = (
  orderId: number,
  totalAmount: number,
  type: "add" | "edit"
) => {
  refundOrderId.value = orderId;
  maxRefundAmount.value = totalAmount;
  refundCardType.value = type;
  refundVisible.value = true;
};

const handleCancel = (orderId: number) => {
  ElMessageBox.confirm("确认撤销退款申请吗?", "撤销申请", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    cancelRefund({ orderId: orderId })
      .then((res: any) => {
        if (res.code === 1) {
          ElMessage({ type: "success", message: "撤销成功" });
          //定时0.3s 刷新页面
          setTimeout(() => {
            getOrders();
          }, 300);
        } else {
          ElMessage({
            type: "error",
            message: "取消退款失败",
          });
        }
      })
      .catch(() => {});
  });
};

//进度
const showTimeline = (orderId: number) => {
  refundOrderId.value = orderId;
  refundStepsVisible.value = true;
};

//客服介入
const interventionVisible = ref(false);
const toIntervention = (orderId: number) => {
  refundOrderId.value = orderId;
  interventionVisible.value = true;
};

//跳转评价
const toComment = (orderId: number, managerId: number, orderType: number) => {
  if (orderType == ManagerType.乐住) {
    router.push({
      name: "AddComment",
      query: { orderId: orderId, managerId: managerId },
    });
  }
  if (orderType == ManagerType.乐玩) {
    router.push({
      name: "AddPlayComment",
      query: { orderId: orderId, managerId: managerId },
    });
  }
  if (orderType == ManagerType.乐食) {
    router.push({
      name: "AddEatComment",
      query: { orderId: orderId, managerId: managerId },
    });
  }
};

const toFollowUp = (orderId: number) => {
  router.push({ name: "FollowUp", query: { orderId: orderId } });
};

const handleDelete = (orderId: number) => {
  ElMessageBox.confirm("确认删除此订单吗?", "删除订单", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteOrder({ orderId })
        .then((res: any) => {
          if (res.code === 1) {
            ElMessage({ type: "success", message: "订单删除成功" });
            //定时0.3s 刷新页面
            setTimeout(() => {
              getOrders();
            }, 300);
          } else {
            ElMessage({
              type: "error",
              message: "订单删除失败",
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
