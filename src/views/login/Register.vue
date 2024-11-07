<template>
  <div id="bg">
    <el-container>
      <el-header style="padding: 0">
        <BaseHeader />
      </el-header>
      <el-main
        style="padding: 0"
        class="bg-main"
        :style="{ minHeight: `${height - 300}px` }"
      >
        <el-row style="min-height: ">
          <el-col :span="6" :offset="14">
            <div class="loginContainer">
              <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane :label="$t('loginVue.MobileReg')" name="second">
                  <RegisterMobile userType="0"></RegisterMobile>
                </el-tab-pane>
                <el-tab-pane :label="$t('loginVue.emailRegister')" name="first">
                  <Register userType="0"></Register>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>
        </el-row>
      </el-main>

      <el-footer class="footer">
        <BaseFooter />
      </el-footer>
    </el-container>
  </div>
</template>
<script setup>
import UserNameLogin from "./components/UserNameLogin.vue";
import Register from "./components/Register.vue";
import RegisterMobile from "./components/RegisterMobile.vue";
import EmailLogin from "./components/EmailLogin.vue";
import BaseFooter from "@/components/BaseFooter.vue";
import BaseHeader from "@/components/BaseHeader.vue";
import { ref, onMounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";

const activeName = ref("second");
const route = useRoute();
const { width, height } = useWindowSize();
onMounted(() => {
  let active = route.query.active;
  activeName.value = active;
});
</script>

<style scoped>
.footer {
  padding: 0;
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  right: 0px;
  overflow-y: auto;
  height: auto;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

#bg {
  position: fixed;
  width: 100%;
  height: 100%;
}
.bg-main {
  background: url("../../assets/images/login_bg.png");
  background-size: 100% 100%;
}
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 140px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: aliceblue;
  box-shadow: 0 0 25px #0ea3ba;
}
</style>
