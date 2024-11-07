<template>
  <el-row
    style="height: 50px; background: #eaeaea"
    justify="center"
    align="middle"
  >
    <el-col :span="16">
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-space v-if="showLogo">
            <a href="/">
              <el-image
                :src="logo"
                fit="fill"
                style="width: 25px; height: 25px"
              />
            </a>
            <a href="/">
              <el-image
                :src="wei_le_si"
                fit="fill"
                style="width: 60px; height: 18px"
              />
            </a>
          </el-space>
        </div>

        <div style="display: flex; justify-content: space-between">
          <el-link :underline="false" @click="jumpPage('/')">
            {{ $t("headerVue.Home") }}
          </el-link>
          <template v-if="!userStore.logged">
            <el-link :underline="false" href="/login" class="ml20">
              {{ $t("headerVue.Login") }}
            </el-link>
            <el-link :underline="false" href="/register" class="ml20">
              {{ $t("headerVue.Signup") }}
            </el-link>
          </template>

          <el-link :underline="false" @click="becomeManager" class="ml20">
            {{ businessButtonTxt }}
          </el-link>
          <template v-if="userStore.logged">
            <el-dropdown class="noFocusDropdown ml20">
              <span class="el-dropdown-link">
                {{ userStore.userName }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="jumpPage('/customer/home')">
                    {{ $t("headerVue.MyService") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="jumpPage('/customer/customerProfile')"
                  >
                    {{ $t("headerVue.MyInformation") }}
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="Logout">
                    {{ $t("headerVue.Logout") }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-link
              :underline="false"
              @click="toMyService"
              v-if="userStore.userExtends && userStore.userExtends.length > 0"
              class="ml20"
            >
              {{ $t("headerVue.ManagerCenter") }}
            </el-link>
          </template>
          <el-link :underline="false" @click="toContactUs" class="ml20">
            {{ $t("headerVue.ContactUs") }}
          </el-link>

          <!-- <el-select v-model="lang" @change="change" class="language-select">
                            <el-option label="简体中文" value="zh-CN"></el-option>
                            <el-option label="English" value="en"></el-option>
                        </el-select> -->
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch, reactive } from "vue";
import logo from "@/assets/images/logo@2x.png";
import wei_le_si from "@/assets/images/wei_le_si@2x.png";
import { getManagerInfo } from "@/api/user.js";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import { useUserDataStore } from "@/stores/counter.js";
import { BusinessType } from "@/utils/enums";

const router = useRouter();

const showLogo = ref(true);
defineExpose({ showLogo });

const language = localStorage.getItem("lang") || "zh-CN";
const lang = ref(language);
const change = (val: string) => {
  localStorage.setItem("lang", val);
  location.reload();
};

interface UserExtend {
  ManagerType: number;
  VerifyStatus: number;
}
interface UserData {
  UserName: string;
  Mobile: string;
  userExtends: UserExtend[];
}
const userStore = useUserDataStore();
const businessButtonTxt = computed(() => {
  if (userStore.userExtends && userStore.userExtends.length > 0) {
    for (let index = 0; index < userStore.userExtends.length; index++) {
      let element: any = userStore.userExtends[index];
      if (element.VerifyStatus == 1) {
        return "拓展业务";
      }
    }
  }
  return "入驻";
});
const getUser = () => {
  getManagerInfo().then((res: any) => {
    if (res.data) {
      // console.log(res.data);
      userStore.userName = res.data.UserName;
      userStore.userExtends = res.data.usersExtends;
      userStore.mobile = res.data.Mobile;
      userStore.logged = true;
      let hasVerifyStatus = userStore.userExtends.some(
        (x: any) => x.VerifyStatus === 0
      );
      if (!hasVerifyStatus) {
        localStorage.removeItem("reviewing");
      }
    }
  });
};

watch(
  () => router.currentRoute.value.name,
  (val) => {
    // console.log("routerName", val);
    showLogo.value = shouldShowLogo(val as string);
  }
);
 
onMounted(() => {
  console.log("basehead-onMounted");
  let name = router.currentRoute.value.name as string;
  showLogo.value = shouldShowLogo(name);
  if (!localStorage.getItem("token")) return;
  if (userStore.userName == "") getUser();
  if (
    localStorage.getItem("reviewing") &&
    localStorage.getItem("reviewing") == "1"
  ) {
    console.log("有入住申请");
    getUser();
  }
  //console.log(userStore.userExtends);
});

function shouldShowLogo(routerName: string) {
  return routerName !== "HomePage" && routerName !== "SearchManager";
}

const Logout = () => {
  //clear token
  localStorage.removeItem("token");
  userStore.userName = "";
  userStore.userExtends = [];
  userStore.mobile = "";
  userStore.logged = false;
  router.push("/");
};

const jumpPage = (path: string) => {
  router.push(path);
};

const toMyService = () => {
  if (userStore.userExtends && userStore.userExtends.length > 0) {
    for (let index = 0; index < userStore.userExtends.length; index++) {
      let element: any = userStore.userExtends[index];
      if (element.VerifyStatus == 1) {
        const businessType = BusinessType[element.ManagerType];
        router.push(`/manager/${businessType}/home`);
        return;
      }
    }
  }
  router.push("/customer/customerProfile");
};

const becomeManager = () => {
  // console.log(userStore.mobile);
  //if not logged in, jump to login page
  //if (!localStorage.getItem("token") || userStore.mobile == "")
  router.push("/mobileSignup");
  //if logged in, jump to select business type page
  //else router.push("/selectBusiness");
};

const toContactUs = () => {
  router.push("/contactUs");
};
</script>

<style scoped>
.flex-grow {
  flex-grow: 1;
}

.language-select {
  width: 100px;
}

.language-select :deep(.el-input) {
  --el-input-border-color: #f5f5f5;
  --el-input-bg-color: #f5f5f5;
}

.language-select :deep(.el-input__wrapper) {
  padding-right: 0;
}

.menu-space :last-child {
  margin-right: 0 !important;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.noFocusDropdown :focus {
  outline: 0;
}

.ml20 {
  margin-left: 20px;
}
</style>
