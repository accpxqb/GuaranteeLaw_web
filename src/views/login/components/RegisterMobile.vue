<template>
  <div>
    <el-form :rules="rules" ref="loginForm" :model="loginForm">
      <!-- <h3 class="loginTitle" v-if="loginForm.userType == '0'">
                {{ $t('loginVue.MobileReg') }}
            </h3>
            <h3 class="loginTitle" v-else>
                {{ $t('loginVue.MobileSettle') }}               
            </h3> -->
      <el-form-item prop="Mobile">
        <el-input
          type="text"
          size="large"
          required
          v-model="loginForm.Mobile"
          :placeholder="$t('loginVue.Mobile')"
        >
          <template #prepend>
            <el-icon><Message /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          type="text"
          size="large"
          v-model="loginForm.code"
          :placeholder="$t('loginVue.verificationCode')"
        >
          <template #append>
            <el-button v-if="!isSend" type="primary" @click="submitSendCode">{{
              $t("button.MobileVerification")
            }}</el-button>
            <el-button v-else type="primary" @click="submitSendCode">
              重新发送{{ timecount }}</el-button
            >
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="recommendcode">
        <el-input type="hidden" size="large" v-model="loginForm.recommendcode">
        </el-input>
      </el-form-item>
      <el-form-item prop="userType">
        <el-input type="hidden" size="large" v-model="loginForm.userType">
        </el-input>
      </el-form-item>

      <!-- <el-form-item prop="code">
                <el-input type="text" auto-complete="false" v-model="loginForm.code" placeholder="点击图片更换验证码" style="width: 200px;margin-right: 5px">
                </el-input>
            
                <SIdentify :identifyCode="identifyCode" @click="createCode"></SIdentify>

            </el-form-item> -->

      <el-button
        type="primary"
        style="width: 100%"
        @click="submitRegister"
        v-if="loginForm.userType == '0'"
        >{{ $t("button.rgister") }}</el-button
      >
      <el-button
        type="primary"
        style="width: 100%"
        @click="submitRegister"
        v-else
        >{{ $t("button.SettleIn") }}</el-button
      >
    </el-form>
  </div>
</template>
<script>
import { mobileVerification, register } from "@/api/login";
export default {
  props: {
    userType: String,
  },
  name: "Login",

  data() {
    var checkCode = (rule, value, callback) => {
      if (
        this.identifyCode.toLowerCase() != this.loginForm.code.toLowerCase()
      ) {
        callback(new Error("验证码输入错误"));
      }

      callback();
    };

    return {
      timecount: 60,
      isSend: false,
      identifyCode: "",
      loginForm: {
        Email: "",

        code: "",
        recommendcode: this.$route.query.recommendcode,
        userType: this.userType,
      },
      checked: true,
      rules: {
        Mobile: [
          {
            required: true,
            message: this.$t("loginVue.enterMobile"),
            trigger: "blur",
          },
          // { min: 5, max: 14, message: '长度在 5 到 14 个字符', trigger: 'blur' }
        ],

        // code: [{ required: true, message: this.$t('loginVue.enterCode'), trigger: "blur" },
        // { validator: checkCode, message: this.$t('loginVue.verificationCodeError'), trigger: "blur" }

        // ],
      },
    };
  },
  methods: {
    submitRegister() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          register(this.loginForm).then((res) => {
            console.log(res);
            if (res.code) {
              localStorage.setItem("token", res.data);
              this.$router.push("/");
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          // this.$message.error('登录出错请重新输入');
          return false;
        }
      });
    },
    submitSendCode() {
      if (!this.loginForm.Mobile) {
        this.$message.error("请输入手机号");
        return;
      }
      if (this.isSend) {
        return;
      }
      mobileVerification({
        Mobile: this.loginForm.Mobile,
        IsRegister: true,
      }).then((res) => {
        if (res.code) {
          this.identifyCode = res.data;
          this.$message({ message: res.msg, type: "success" });
          this.countdown();
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    countdown() {
      this.isSend = true;
      this.timecount = 60;
      setInterval(() => {
        this.timecount--;
        if (this.timecount == 0) {
          this.isSend = false;
        }
      }, 1000);
    },
  },
  mounted() {
    console.log(this.userType);
    console.log(this.$route.query);
    console.log(this.$refs.loginForm.userType);
  },
};
</script>

<style scoped>
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
  font-size: 30px;
}
</style>
@/api/login
