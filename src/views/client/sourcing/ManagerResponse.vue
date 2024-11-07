<template>
  <div v-loading="loading">
    <el-empty v-if="isEmpty" description="无应答" />
    <div
      v-else
      v-for="manager in managerList"
      style="margin-bottom: 10px; margin-top: 10px"
    >
      <div class="managerTitle">
        <el-row>
          <el-col :span="2">
            <el-avatar
              fit="fill"
              :size="35"
              style="margin-top: 8px; cursor: pointer"
              @click="btnRouter(manager.user.Id)"
            >
              <!-- :preview-src-list="getImgListUrl(manager.user.LifePicList)"  -->
              <el-image
                :src="config.CONFIG_IMGURL + manager.user.PhotoPath"
                :zoom-rate="1.2"
                fit="cover"
                style="height: 35px"
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </el-avatar>
          </el-col>
          <el-col :span="12">
            <span style="cursor: pointer" @click="btnRouter(manager.user.Id)"
              >{{ $t("ManagerResponseVue.Manager") }}：{{
                manager.user.FullName
              }}</span
            >
          </el-col>
          <el-col
            :span="10"
            style="text-align: right; cursor: pointer; padding-right: 10px"
          >
            <span @click="btnRouter(manager.user.Id)"
              >服务首页》</span
            >
          </el-col>
        </el-row>
      </div>
      <!-- <el-space wrap> -->
      <div
        v-for="sourcing in manager.sourcingPropertyList"
        style="
          border-top-left-radius: 0px;
          border-top-right-radius: 0px;
          border: 0px;
          padding: 0px;
          margin-bottom: 10px;
        "
        shadow="never"
      >
        <el-row>
          <el-col :span="24" class="row_hotel" style="padding-top: 0px">
            <SourcingRoomRow
              :room="{
                ...room.hotelRoom,
                LOS: room.DaysIn,
                UnitPrice: room.UnitPrice,
                Id: room.Id,
              }"
              :hotel-name="sourcing.hotel.Name"
              v-for="room in sourcing.sourcingRoomList"
              :key="room.Id"
            >
            </SourcingRoomRow>
          </el-col>
        </el-row>
        <el-row>
          <el-col
            class="row_hotel"
            :span="24"
            style="
              text-align: right;
              border-top: 0px;
              padding: 10px 20px 10px 20px;
            "
          >
            <el-row>
              <el-col :span="20">
                <div style="line-height: 30px" class="totalall">
                  {{ $t("AddSourcing.Total") }}：
                  <label> {{ sourcing.OrderTotal }}元 </label>
                </div>
              </el-col>
              <el-col :span="4">
                <!-- <slot name="btn"></slot> -->
                <el-button
                  v-if="isShowBtn"
                  @click="btnDeal(sourcing)"
                  type="danger"
                  style="width: 80%; height: 88%"
                >
                  下单
                </el-button>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <!-- </el-space> -->
    </div>
    <slot name="btnDeal"></slot>
  </div>

  <!-- <el-dialog v-model="dialogVisible" :title="dialogTitle" width="70%" top="0" destroy-on-close append-to-body>
        <Map :fcenter="center"></Map>
    </el-dialog> -->
  <!-- :before-close="payClose" -->
  <!-- <el-dialog v-model="payVisible" :show-close="true" destroy-on-close  width="550"> 
        <template v-if="ispay" #header="{ close }">
            <div class="my-header">
                <h4 style="margin: 0px;text-align: center;">请选择支付方式</h4>
              
            </div>
        </template>
       
        <Pay v-if="ispay" @dopay="btndopay" :orderId="orderId"></Pay>
        <WeiXinPay v-else :url="url"></WeiXinPay>
    </el-dialog> -->
  <el-dialog
    v-model="payVisible"
    :show-close="true"
    destroy-on-close
    width="550"
  >
    <template #header="{ close }">
      <div class="my-header">
        <h4 style="margin: 0px; text-align: center">请选择支付方式</h4>
      </div>
    </template>
    <Pay @dopay="btndopay" :orderId="orderId"></Pay>
  </el-dialog>
  <el-dialog v-model="ispay" :show-close="true" destroy-on-close width="550">
    <WeiXinPay :url="url" :total="total"></WeiXinPay>
  </el-dialog>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  watch,
  nextTick,
  getCurrentInstance,
} from "vue";
import Map from "../../map/map.vue";
import { getSourcingPropertyList } from "../../../api/sourcingproperty";
import config from "../../../utils/config";
import { useRoute, useRouter } from "vue-router";
import { ElLoading, ElMessageBox, ElMessage } from "element-plus";
import Pay from "../pay/Pay.vue";
import { createOrder } from "@/api/order";
import { useQRCode } from "@vueuse/integrations/useQRCode";
import WeiXinPay from "../pay/WeiXinPay.vue";
import SourcingRoomRow from "../../components/SourcingRoomRow.vue";
import { getManagerInfo } from "@/api/user.js";
import PlayResponse from "./PlayResponse.vue";
import { ManagerType } from "@/utils/enums";

const url = ref("");
const total = ref(0);
const btndopay = (u) => {
  url.value = u;
  payVisible.value = false;
  ispay.value = true;
};
const ispay = ref(false);
const orderId = ref({});
const payVisible = ref(false);

const paysuccessClose = () => {
  ElMessageBox.confirm("支付成功?", "Confirm", {
    distinguishCancelAndClose: true,
    confirmButtonText: "是",
    cancelButtonText: "否",
  })
    .then(() => {
      ispay.value = false;
      //
    })
    .catch(() => {
      // catch error
      ispay.value = false;
    });
};

const text = ref();
const qrcode = useQRCode(text, {
  errorCorrectionLevel: "H",
  margin: 3,
});
const btnDeal = (sourcing) => {
  getManagerInfo().then((res) => {
    if (res.data) {       
      if (!res.data.Mobile) {
        ElMessage.error("请先填写联系电话");
        router.push({ name: "SecuritySetting" });
        return;
      }
    }
  });
  
  //生成待支付订单
  loading.value = true;

  createOrder({ SourcingPropertyId: sourcing.Id, SourcingId: sourcing.OrderId })
    .then((res) => {
      //成功
      if (res.code == 1) {
        console.log(res);
        total.value = sourcing.OrderTotal;
        payVisible.value = true;
        //待支付订单传给支付平台
        orderId.value = res.data;
      } else {
        ElMessageBox.alert("下单失败");
      }
    })
    .finally(() => {
      loading.value = false;
    });
};
const loading = ref(true);
const route = useRoute();
const router = useRouter();
const props = defineProps({
  sourcingId: {
    type: String,
    default: "1090910188732416000",
  },
  isShowBtn: {
    type: Boolean,
    default: false,
  },
});
const dialogVisible = ref(false);
const dialogTitle = ref("");
const center = ref([]);
const btnShowMap = (hotel) => {
  dialogVisible.value = true;
  // center.value=[117.129889,36.651211]
  center.value = hotel.LongitudeLatitude;
  dialogTitle.value = hotel.Districts + hotel.Address;
};
const iii = ref(0);
const getImgUrl = (hotel) => {
  let url = "";
  if (
    hotel.PicList !== undefined &&
    hotel.PicList != null &&
    hotel.PicList.length > 0
  ) {
    hotel.PicList.forEach((element) => {
      if (element.IsHomePage) {
        url = element.Url;
      }
      if (url == "") url = hotel.PicList[0].Url;
    });
  }
  return url;
};

const getImgListUrl = (list) => {
  var newList = [];
  if (list !== undefined && list != null && list.length > 0) {
    list.forEach((element) => {
      newList.push(element.Url);
    });
  }
  return newList;
};
const managerList = ref({});
const isEmpty = ref(false);
const btnRouter = (managerId) => {
  console.log(managerId);
  if (isNaN(managerId)) {
    return;
  }
  //router.push({ path: '/homepageManager', query: { managerId: managerId } })
  var path = router.resolve({
    path: "/homepageManager",
    query: { managerId: managerId ,managerType:ManagerType.乐住},
  });
  window.open(path.href, "_blank");
};

onMounted(() => {
  getSourcingPropertyList({ sourcingId: props.sourcingId }).then((res) => {
    loading.value = false;
    if (res.code) {
      managerList.value = res.data;
    } else {
      isEmpty.value = true;
    }
  });
});
</script>

<style scoped>
.managerTitle {
  height: 50px;
  background-color: #f5f5f5;
  color: #27ae60;
  max-width: 100%;
  border-radius: 10px 10px 0px 0px;
  border-top: 1px solid var(--el-border-color);
  border-left: 1px solid var(--el-border-color);
  border-right: 1px solid var(--el-border-color);
}

.managerTitle span {
  margin-left: 20px;
  line-height: 50px;
}

.managerTitle span:hover {
  font-weight: 600;
}

.roomtotal {
  color: #13e46e;
}

.totalall {
  font-size: 16px;
  font-weight: bold;
}

.totalall label {
  color: red;
}

.row_hotel {
  border: 1px solid var(--el-border-color);
  /* padding: 20px; */
  /* border-radius: 5px; */
}

.row_hotel img {
  border-radius: 10px;
}

.roomName {
  font-size: 14px;
  font-weight: 600;
}

.roomDescribe {
  font-size: 11px;
}

.roomrow {
  border-bottom: 1px #f5f5f5 solid !important;
}

.popover_title {
  background-color: #27ae60;
  color: white;
  max-width: 200;
  font-size: 14px;
  margin-top: -12px;
  margin-right: -12px;
  margin-left: -12px;
  padding: 12px;
}

.popover_title label {
  font-size: 11px;
}

.popover_content {
  max-width: 100%;
  font-size: 14px;
}

.popover_content label {
  font-size: 11px;
}

.popover_content :deep(.el-row) {
  margin-top: 5px;
}

.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  text-align: center;
  /* width: 100%; */
}

h4 {
  display: flex;
  align-items: center;
  position: relative;
}
</style>
