<template>
  <div class="common-layout">
    <el-scrollbar>
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
                  <el-tab-pane :label="$t('loginVue.MobileSignIn')" name="3">
                    <MobileLogin></MobileLogin>
                  </el-tab-pane>
                  <el-tab-pane
                    :label="$t('loginVue.emailSignIn')"
                    name="second"
                  >
                    <EmailLogin></EmailLogin>
                  </el-tab-pane>
                  <el-tab-pane :label="$t('loginVue.signIn')" name="first">
                    <UserNameLogin></UserNameLogin>
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
    </el-scrollbar>
  </div>
</template>
<script setup>
import UserNameLogin from "./components/UserNameLogin.vue";
import EmailLogin from "./components/EmailLogin.vue";
import MobileLogin from "./components/MobileLogin.vue";
import BaseFooter from "@/components/BaseFooter.vue";
import BaseHeader from "@/components/BaseHeader.vue";
import { ref } from "vue";
import { useWindowSize } from "@vueuse/core";

const activeName = ref("3");

const { width, height } = useWindowSize();
</script>

<style scoped>
.common-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.footer {
  padding: 0;
  /* position: absolute; */
  left: 0px;
  bottom: 0px;
  width: 100%;
  right: 0px;
  overflow-y: auto;
  height: auto;
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

.loginTitle {
  margin: 0px auto 48px auto;
  text-align: center;
  font-size: 40px;
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
</style>
