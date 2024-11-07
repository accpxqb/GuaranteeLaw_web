<template>
  <el-card shadow="never" v-if="user" :body-style="{ padding: '0px' }">
    <div
      style="
        display: flex;
        align-items: start;
        padding-left: 15px;
        padding-right: 15px;
        padding-top: 10px;
      "
    >
      <div>
        <el-avatar
          :size="96"
          :src="config.CONFIG_IMGURL + '/' + user.PhotoPath"
        />
      </div>
      <div style="margin-left: 15px; flex: auto">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="display: flex; align-items: center">
            <el-text style="font-size: 20px">{{ user.FullName }}</el-text>
            <!-- <el-tag type="warning" effect="dark" style="margin-left: 10px">
              金牌经理
            </el-tag> -->
            <ManagerLevel
              :integral="userScore.Integral"
              style="margin-left: 10px"
            ></ManagerLevel>
          </div>
          <el-button :icon="Edit" circle @click="toProfile" />
        </div>
        <div style="margin-top: 5px">
          <!-- 实名认证 -->
          <el-tag
            type="warning"
            v-if="user.IdVerificationStatus == VerificationStatus.Pending"
            plain
          >
            <el-row align="middle">
              <el-image
                :src="pendingIcon"
                style="width: 14px; height: 14px"
                fit="fill"
              />
              <span class="ml-5"> 实名认证审核中 </span>
            </el-row>
          </el-tag>
          <el-tag
            type="success"
            v-else-if="user.IdVerificationStatus == VerificationStatus.Approved"
            plain
          >
            <el-row align="middle">
              <el-image
                :src="validatedIcon"
                style="width: 14px; height: 14px"
                fit="fill"
              />
              <span class="ml-5">实名认证</span>
            </el-row>
          </el-tag>
          <el-tag
            v-else
            type="info"
            plain
            style="cursor: pointer"
            @click="handleRedirect('IDCardVerification')"
          >
            <el-row align="middle">
              <el-image
                :src="unValidatedIcon"
                style="width: 14px; height: 14px"
                fit="fill"
              />
              <span
                style="text-decoration: underline; color: #333333"
                class="ml-5"
              >
                实名认证
              </span>
            </el-row>
          </el-tag>
          <!-- 手机号绑定 -->
          <el-tag
            type="success"
            v-if="user.Mobile && user.Mobile.trim() != ''"
            plain
            class="ml-10"
          >
            <el-row align="middle">
              <el-image
                :src="validatedIcon"
                style="width: 14px; height: 14px"
                fit="fill"
              />
              <span class="ml-5">手机号绑定</span>
            </el-row>
          </el-tag>
          <el-tag
            v-else
            type="info"
            plain
            style="cursor: pointer"
            @click="handleRedirect('ManagerProfile')"
            class="ml-10"
          >
            <el-row align="middle">
              <el-image
                :src="unValidatedIcon"
                style="width: 14px; height: 14px"
                fit="fill"
              />
              <span style="text-decoration: underline" class="ml-5">
                手机号绑定
              </span>
            </el-row>
          </el-tag>
          <!-- 机构认证 -->
          <el-tag
            type="warning"
            plain
            class="ml-10"
            v-if="user.LicenseVerificationStatus == LicenseVerifyStatus.Pending"
          >
            <el-row align="middle">
              <el-image
                :src="pendingIcon"
                style="width: 14px; height: 14px"
                fit="fill"
              />
              <span class="ml-5">机构认证审核中</span>
            </el-row>
          </el-tag>
          <el-tag
            type="success"
            plain
            class="ml-10"
            v-else-if="
              user.LicenseVerificationStatus == LicenseVerifyStatus.Approved
            "
          >
            <el-row align="middle">
              <el-image
                :src="validatedIcon"
                style="width: 14px; height: 14px"
                fit="fill"
              />
              <span class="ml-5">机构认证</span>
            </el-row>
          </el-tag>
          <el-tag
            type="info"
            plain
            class="ml-10"
            style="cursor: pointer"
            @click="toLicenseVerification"
            v-else
          >
            <el-row align="middle">
              <el-image
                :src="unValidatedIcon"
                style="width: 14px; height: 14px"
                fit="fill"
              />
              <span
                style="text-decoration: underline; color: #333333"
                class="ml-5"
              >
                机构认证
              </span>
            </el-row>
          </el-tag>
        </div>
        <div style="margin-top: 5px">
          <el-text>
            {{ $t("ManagerDetailVue.PositiveRate") }}
            {{
              (
                (100 * userScore.PositiveNumber) /
                userScore.ScoringTimes
              ).toFixed(2)
            }}%
          </el-text>
          <el-text style="margin-left: 40px">
            已服务{{ userScore.CumulativePersonnel }}位客户
          </el-text>
        </div>
        <div style="margin-top: 5px">
          <el-text>{{ user.PersonalProfile }}</el-text>
        </div>
      </div>
    </div>
    <el-divider style="margin-top: 10px; margin-bottom: 10px" />
    <div
      style="display: flex; justify-content: space-evenly; margin-bottom: 10px"
    >
      <div class="justify-center-col">
        <el-button text @click="handleRedirect(dealRouteName)">
          {{ `新抢单(${dealCount})` }}
        </el-button>
      </div>
      <el-divider direction="vertical" class="customer-divider" />
      <div
        class="justify-center-col"
        @click="handleRedirect(notServiceRouteName)"
      >
        <el-button text>
          {{ `待服务(${pendingServiceCount})` }}
        </el-button>
      </div>
      <el-divider direction="vertical" class="customer-divider" />
      <div
        class="justify-center-col"
        @click="handleRedirect(inServiceRouteName)"
      >
        <el-button text>
          {{ `服务中(${inServiceCount})` }}
        </el-button>
      </div>
      <el-divider
        direction="vertical"
        class="customer-divider"
        @click="handleRedirect('Completed')"
      />
      <div
        class="justify-center-col"
        @click="handleRedirect(completedRouteName)"
      >
        <el-button text> 已完成 </el-button>
      </div>
      <!-- <el-divider direction="vertical" class="customer-divider" />
      <div class="justify-center-col">
        <el-button text> 已取消 </el-button>
      </div> -->
    </div>
  </el-card>
  <div v-if="user">
    <p class="tip">接单小提示</p>
    <p class="tipLine">1.上传多张个人形象照有利于接单</p>
    <p class="tipLine">2.【个人展示】中丰富自己的个人简介有利于吸引客户注意</p>
    <p class="tipLine">
      3.服务完成的订单鼓励客户给个好评，有利于提升自己的排名
    </p>
    <p class="tipLine">4.服务标签可以更有效的吸引客户，一定要仔细填写</p>
  </div>
</template>
<script lang="ts" setup>
import { Edit } from "@element-plus/icons-vue";
import { computed, onMounted, ref } from "vue";
import { getManager } from "@/api/user";
import { useRouter } from "vue-router";
import validatedIcon from "@/assets/images/verification/已认证@2x.png";
import unValidatedIcon from "@/assets/images/verification/未认证@2x.png";
import pendingIcon from "@/assets/images/verification/审核中@2x.png";
import {
  BusinessType,
  OrderStatus,
  VerificationStatus,
  LicenseVerifyStatus,
} from "@/utils/enums";
import { GetSourcingCountGroupByStatusForM } from "@/api/sourcing";
import config from "@/utils/config";
import { licenseVerification } from "@/api/manager";

const user = ref();
const userScore = ref();
interface LifePic {
  FileName: string;
  UniqueFileName: string;
  FilePath?: string;
  Url: string;
}
const picList = ref<string[]>([]);
const typeStr = ref("");
onMounted(() => {
  typeStr.value = router.currentRoute.value.meta.type as string;
  if (typeStr.value == "") return;
  getManager({
    ManagerId: 0,
    ManagerType: BusinessType[typeStr.value as keyof typeof BusinessType],
  }).then((res: any) => {
    console.log(res);
    if (res.code == 1) {
      user.value = res.data;
      const extend = res.data.usersExtends[0];
      user.value.PhotoPath = extend.PhotoImg;
      user.value.PersonalProfile = extend.PersonalProfile;
      user.value.LicenseVerificationStatus = extend.LicenseVerificationStatus;
      userScore.value = JSON.parse(res.data.ManagerScoreJson);
    }
    getOrderNumber();
  });
});

const pendingServiceCount = ref(0);
const inServiceCount = ref(0);
const dealCount = ref(0);
const getOrderNumber = () => {
  try {
    GetSourcingCountGroupByStatusForM({
      ManagerType: BusinessType[typeStr.value as keyof typeof BusinessType],
    }).then((res) => {
      console.log(res.data);
      //抢单
      let deal = res.data.find(
        (element: { Status: number; Count: number }) => element.Status == 110
      );
      dealCount.value = deal ? deal.Count : 0;
      //已付款，待服务
      let paid = res.data.find(
        (element: { Status: number; Count: number }) =>
          element.Status == OrderStatus.Paid
      );
      pendingServiceCount.value = paid ? paid.Count : 0;

      //服务中
      let service = res.data.find(
        (element: { Status: number; Count: number }) =>
          element.Status == OrderStatus.CheckIn
      );
      inServiceCount.value = service ? service.Count : 0;
    });
  } catch (error) {
    // handle error
  }
};

const router = useRouter();
//跳转页面
const handleRedirect = (name: string) => {
  router.push({ name: name });
};

const toProfile = () => {
  switch (BusinessType[typeStr.value as keyof typeof BusinessType]) {
    case BusinessType.hotel:
      router.push({ name: "HotelProfile" });
      break;
    case BusinessType.play:
      router.push({ name: "PlayProfile" });
      break;
    case BusinessType.eat:
      router.push({ name: "EatProfile" });
      break;
    default:
      break;
  }
};

const dealRouteName = computed(() => {
  switch (BusinessType[typeStr.value as keyof typeof BusinessType]) {
    case BusinessType.hotel:
      return "DealList";
    case BusinessType.play:
      return "PlayDealList";
    case BusinessType.eat:
      return "EatDealList";
    default:
      return "DealList";
  }
});

const notServiceRouteName = computed(() => {
  switch (BusinessType[typeStr.value as keyof typeof BusinessType]) {
    case BusinessType.hotel:
      return "NotService";
    case BusinessType.play:
      return "NotServicePlayOrders";
    case BusinessType.eat:
      return "NotServiceEatOrders";
    default:
      return "NotService";
  }
});

const inServiceRouteName = computed(() => {
  switch (BusinessType[typeStr.value as keyof typeof BusinessType]) {
    case BusinessType.hotel:
      return "InService";
    case BusinessType.play:
      return "InServicePlayOrders";
    case BusinessType.eat:
      return "InServiceEatOrders";
    default:
      return "InService";
  }
});

const completedRouteName = computed(() => {
  switch (BusinessType[typeStr.value as keyof typeof BusinessType]) {
    case BusinessType.hotel:
      return "Completed";
    case BusinessType.play:
      return "CompletedPlayOrders";
    case BusinessType.eat:
      return "CompletedEatOrders";
    default:
      return "Completed";
  }
});

//跳转到机构认证
const toLicenseVerification = () => {
  router.push({
    name: "LicenseVerification",
    query: { type: BusinessType[typeStr.value as keyof typeof BusinessType] },
  });
};
</script>
<style scoped>
.home {
  align-items: normal;
}

.tip {
  color: #27ae60;
  font-size: small;
}

.tipLine {
  font-size: smaller;
}

.justify-center-col {
  display: flex;
  justify-content: center;
  align-items: center;
}

.customer-divider {
  margin: 0;
  height: 40px;
}

:deep(.my-content) {
  padding-bottom: 0px !important;
}

.ml-10 {
  margin-left: 10px;
}

.ml-5 {
  margin-left: 5px;
}
</style>
