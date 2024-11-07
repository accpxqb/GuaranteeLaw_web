<template>
  <el-card shadow="never" v-if="user" :body-style="{ padding: '0px' }">
    <div
      style="
        display: flex;
        align-items: center;
        margin-top: 15px;
        margin-left: 15px;
        margin-right: 15px;
        justify-content: space-between;
      "
    >
      <div style="display: flex; align-items: center">
        <el-avatar :size="80" :src="config.CONFIG_IMGURL + user.PhotoPath" />
        <div style="margin-left: 15px">
          <div>
            <el-text style="font-size: 20px">{{ user.NickName }}</el-text>
          </div>
          <div style="display: flex; align-items: center; margin-top: 10px">
            <!-- 实名认证 -->
            <el-tag
              type="success"
              v-if="user.IdVerificationStatus == IdVerifyStatus.Approved"
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
            <template v-if="user.usersExtends.length == 0">
              <el-tag
                type="warning"
                v-if="user.IdVerificationStatus == IdVerifyStatus.Pending"
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
                v-if="
                  user.IdVerificationStatus == IdVerifyStatus.None ||
                  user.IdVerificationStatus == IdVerifyStatus.Rejected
                "
                type="info"
                plain
                style="cursor: pointer"
                @click="verifyId(user.IdVerificationStatus)"
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
            </template>
            <el-text
              v-if="user.Mobile"
              style="margin-left: 10px; font-weight: bold"
            >
              {{ user.Mobile }}
            </el-text>
            <template v-else>
              <el-tag
                type="info"
                plain
                style="margin-left: 10px; cursor: pointer"
                @click="handleRedirect('CustomerProfile')"
                v-if="user.UserType == 0"
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
                    绑定手机号
                  </span>
                </el-row>
              </el-tag>
            </template>
          </div>
        </div>
      </div>
      <el-button
        :icon="Edit"
        circle
        @click="handleRedirect('CustomerProfile')"
      />
    </div>

    <el-divider style="margin-top: 15px; margin-bottom: 15px" />

    <div
      style="display: flex; justify-content: space-evenly; margin-bottom: 15px"
    >
      <div class="justify-center-col">
        <el-button text @click="handleRedirect('AssignedSourcingList')">
          定向需求
        </el-button>
      </div>
      <el-divider direction="vertical" class="customer-divider" />
      <div class="justify-center-col">
        <el-button text @click="handleRedirect('PaidOrders')">
          {{ `已付款(${paidCount})` }}
        </el-button>
      </div>
      <el-divider direction="vertical" class="customer-divider" />
      <div class="justify-center-col">
        <el-button text @click="handleRedirect('CheckInOrders')">
          {{ `服务中(${serviceCount})` }}
        </el-button>
      </div>
      <el-divider direction="vertical" class="customer-divider" />
      <div class="justify-center-col">
        <el-button text @click="handleRedirect('ClientCompleted')">
          已完成
        </el-button>
      </div>
      <el-divider direction="vertical" class="customer-divider" />
      <div class="justify-center-col">
        <el-button text @click="handleRedirect('CanceledSourcingList')">
          已取消
        </el-button>
      </div>
    </div>
  </el-card>
  <template v-for="item in 3" :key="item">
    <RecommendedManagerList :type="item"></RecommendedManagerList>
  </template>
</template>
<script lang="ts" setup>
import { Edit } from "@element-plus/icons-vue";
import { onMounted, ref } from "vue";
import RecommendedManagerList from "../client/components/RecommendedManagerList.vue";
import { getSignedUser, getUserInfo } from "@/api/user";
import { useRouter } from "vue-router";
import { getFullName, getAvatar } from "@/utils/helper";
import { getSourcingCountGroupByStatus } from "@/api/sourcing";
import validatedIcon from "@/assets/images/verification/已认证@2x.png";
import unValidatedIcon from "@/assets/images/verification/未认证@2x.png";
import pendingIcon from "@/assets/images/verification/审核中@2x.png";
import { OrderStatus, VerificationStatus, IdVerifyStatus } from "@/utils/enums";
import config from "@/utils/config";
import type CreateSourcingFormVue from "../client/components/CreateSourcingForm.vue";

const user = ref();
onMounted(() => {
  getUserInfo().then((res) => {
    user.value = res.data;
    getSourcingNumber();
  });
});

const paidCount = ref(0);
const serviceCount = ref(0);
const getSourcingNumber = () => {
  try {
    getSourcingCountGroupByStatus().then((res) => {
      console.log(res.data);
      let paid = res.data.find(
        (element: { Status: number; Count: number }) =>
          element.Status == OrderStatus.Paid
      );
      paidCount.value = paid ? paid.Count : 0;
      let service = res.data.find(
        (element: { Status: number; Count: number }) =>
          element.Status == OrderStatus.CheckIn
      );
      serviceCount.value = service ? service.Count : 0;
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

const verifyId = (status: number) => {
  router.push({ name: "IDCardVerification", query: { status: status } });
};
</script>
<style scoped>
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

.ml-5 {
  margin-left: 5px;
}
</style>
