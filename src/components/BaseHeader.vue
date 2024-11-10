<template>
  <el-row
    style="height: 60px; background: #eaeaea"
    justify="center"
    align="middle"
  >
    <el-col :span="16">
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-space >
            <a href="/">
              <el-image
                :src="logo"
                fit="fill"
                style="width: 25px; height: 25px"
              />
            </a>
            
            <el-link :underline="false" href="/" class="ml20">
                中国法律担保网
            </el-link>
            
          </el-space>
        </div>

        <div style="display: flex; justify-content: space-between">
          <el-link :underline="false" @click="jumpPage('/')">
           首页
          </el-link>
          <el-link :underline="false" href="/login" class="ml20">
             法律法规
          </el-link>
          <el-link :underline="false" href="/login" class="ml20">
             法学理论
          </el-link>
          <el-link :underline="false" href="/login" class="ml20">
             案例分析
          </el-link>
          <el-link :underline="false" href="/login" class="ml20">
             专家咨询
          </el-link>
          <el-link :underline="false" href="/login" class="ml20">
             行业动态
          </el-link>
          <el-link :underline="false" href="/login" class="ml20">
             联系我们
          </el-link>
         
        </div>
      </div>

      
    </el-col>
  </el-row>
  
 
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch, reactive } from "vue";
import logo from "@/assets/images/logo@2x.png";
import wei_le_si from "@/assets/images/wei_le_si@2x.png";
// import { getManagerInfo } from "@/api/user.js";
import { useRouter } from "vue-router";
import  ElMessageBox  from "element-plus";
import { useUserDataStore } from "@/stores/counter.js";
import { BusinessType } from "@/utils/enums";
 
const activeIndex = ref('1')
 const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}

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
  // getManagerInfo().then((res: any) => {
  //   if (res.data) {
  //     // console.log(res.data);
  //     userStore.userName = res.data.UserName;
  //     userStore.userExtends = res.data.usersExtends;
  //     userStore.mobile = res.data.Mobile;
  //     userStore.logged = true;
  //     let hasVerifyStatus = userStore.userExtends.some(
  //       (x: any) => x.VerifyStatus === 0
  //     );
  //     if (!hasVerifyStatus) {
  //       localStorage.removeItem("reviewing");
  //     }
  //   }
  // });
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
  margin-left: 40px;
}
</style>
