<script setup>
import UserNameLogin from "./components/UserNameLogin.vue";
import Register from "./components/RegisterMobile.vue";
import EmailLogin from "./components/EmailLogin.vue";
import BaseFooter from "@/components/BaseFooter.vue";
import BaseHeader from "@/components/BaseHeader.vue";
</script>
<template>
  <div id="bg">
    <el-container>
      <el-header style="padding: 0">
        <BaseHeader />
      </el-header>
      <el-row>
        <el-col :span="6" :offset="14">
          <Register userType="0"></Register>
        </el-col>
      </el-row>

      <el-footer class="footer">
        <BaseFooter />
      </el-footer>
    </el-container>
  </div>
</template>

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
  background: url("../../assets/images/login_bg.png");
  background-size: 90% 80%;
}
</style>
