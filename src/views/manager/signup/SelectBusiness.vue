<template>
  <div :style="{ minHeight: `${height - 260 - 50}px` }" class="container">
    <el-row justify="center" style="padding-top: 50px; padding-bottom: 50px">
      <el-col :span="16">
        <el-image
          style="border-radius: 10px; width: 100%"
          :src="slogan"
          fit="scale-down"
        >
        </el-image>
        <div class="business-grid">
          <template v-for="item in businessArr">
            <el-link
              v-if="item.display"
              :underline="false"
              class="box"
              @click="toUploadInfo(item.value)"
              :disabled="item.value > 3"
            >
              <el-image style="height: 15px; width: 15px" :src="item.icon">
              </el-image>
              <span
                style="margin-left: 5px; font-size: medium; font-weight: bold"
              >
                申请乐{{ item.name }}经理
              </span>
            </el-link>
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import slogan from "@/assets/images/slogan.png";
import auto from "@/assets/images/homepage-menu-icon/auto@2x.png";
import job from "@/assets/images/homepage-menu-icon/乐业@2x.png";
import hotel from "@/assets/images/homepage-menu-icon/乐住@2x.png";
import baby from "@/assets/images/homepage-menu-icon/乐宝@2x.png";
import home from "@/assets/images/homepage-menu-icon/乐家@2x.png";
import teach from "@/assets/images/homepage-menu-icon/乐教@2x.png";
import play from "@/assets/images/homepage-menu-icon/乐玩@2x.png";
import beauty from "@/assets/images/homepage-menu-icon/乐美@2x.png";
import market from "@/assets/images/homepage-menu-icon/乐超@2x.png";
import food from "@/assets/images/homepage-menu-icon/乐食@2x.png";
import { useWindowSize } from "@vueuse/core";
import { onMounted, ref } from "vue";
import { useUserDataStore } from "@/stores/counter";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getManagerInfo } from "@/api/user.js";

const { width, height } = useWindowSize();
const userStore = useUserDataStore();
const router = useRouter();
let businessArr = ref([
  {
    name: "住", // '酒店',
    icon: hotel,
    display: true,
    value: 1,
  },
  {
    name: "玩",
    icon: play,
    display: true,
    value: 2,
  },
  {
    name: "食",
    icon: food,
    display: true,
    value: 3,
  },

  {
    name: "家",
    icon: home,
    display: true,
    value: 4,
  },
  {
    name: "美",
    icon: beauty,
    display: true,
    value: 5,
  },
  {
    name: "教",
    icon: teach,
    display: true,
    value: 6,
  },
  {
    name: "车",
    icon: auto,
    display: true,
    value: 7,
  },
  {
    name: "宝",
    icon: baby,
    display: true,
    value: 8,
  },
  {
    name: "超",
    icon: market,
    display: true,
    value: 9,
  },
  {
    name: "业",
    icon: job,
    display: true,
    value: 10,
  },
]);

onMounted(() => {
  if (userStore.mobile == null || userStore.mobile == "") {
    ElMessage.warning("请先绑定手机号");
    router.push({
      name: "mobileSignup",
    });
    return;
  }
  getManagerInfo().then((res: any) => {
    if (res.data) {
      userStore.userName = res.data.UserName;
      userStore.userExtends = res.data.usersExtends;
      userStore.mobile = res.data.Mobile;
      userStore.userExtends.forEach((item: any) => {
        if (item.VerifyStatus == 1) {
          const newArr = businessArr.value.map((business: any) => {
            return business.value == item.ManagerType
              ? { ...business, display: false }
              : business;
          });
          businessArr.value = newArr;
        }
      });
      console.log(businessArr);
    }
  });
});
const toUploadInfo = (businessType: number) => {
  let extend: any = userStore.userExtends.find(
    (item: any) => item.ManagerType === businessType
  );
  if (extend && extend.VerifyStatus == 0) {
    ElMessageBox.alert("您的申请正在审核中，请耐心等待", "提示", {
      confirmButtonText: "我知道了",
      autofocus: false,
    });
  } else {
    router.push({
      name: "uploadInfo",
      params: {
        type: businessType,
      },
    });
  }
};
</script>
<style scoped>
.container {
  background-color: #f5f5f5;
}
.box {
  background-color: #fff;
  padding: 50px 20px 50px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.business-grid {
  margin-top: 1em;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 1em;
  grid-row-gap: 1em;
}
</style>
