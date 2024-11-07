<template>
  <div>
    <el-form
      :rules="rules"
      ref="loginForm"
      :model="loginForm"
      style="margin-top: 10px"
    >
      <!-- <h3 class="loginTitle">
        {{ $t('loginVue.emailSignIn')}}
     </h3> -->
      <el-form-item prop="Email">
        <el-input
          type="text"
          size="large"
          v-model="loginForm.Email"
          placeholder="邮箱"
        >
          <template #prepend
            ><el-icon><Message /></el-icon
          ></template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          type="text"
          size="large"
          v-model="loginForm.code"
          :placeholder="$t('loginVue.verificationCode')"
        >
          <template #append>
            <el-button
              v-if="!isSend"
              type="primary"
              @click="MailboxVerification"
              >{{ $t("button.mailboxVerification") }}</el-button
            >
            <el-button v-else type="primary" @click="MailboxVerification"
              >重新发送{{ timecount }}</el-button
            >
          </template>
        </el-input>
      </el-form-item>

      <router-link :to="{ path: '/register', query: { active: 'first' } }">
        <el-button
          type="primary"
          link
          @click="routerReg"
          style="float: right"
          >{{ $t("loginVue.goRegister") }}</el-button
        >
      </router-link>

      <el-button type="primary" style="width: 100%" @click="submit">{{
        $t("button.signIn")
      }}</el-button>
    </el-form>
  </div>
</template>

<script>
import { emailLogin, mailboxVerification } from "../../../api/login";
export default {
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
      },
      checked: true,
      rules: {
        Email: [
          {
            required: true,
            message: this.$t("loginVue.enterEmail"),
            trigger: "blur",
          },
          // { min: 5, max: 14, message: '长度在 5 到 14 个字符', trigger: 'blur' }
        ],

        code: [{ required: true, message:this.$t('loginVue.enterCode'), trigger: "blur" },
        // { validator: checkCode, message: this.$t('loginVue.verificationCodeError'), trigger: "blur" }

        ],
      },
    };
  },
  methods: {
    submit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          emailLogin(this.loginForm).then((res) => {
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
    MailboxVerification() {
      if (this.isSend) {
        return;
      }
      var data = {
        Email: this.loginForm.Email,
        IsRegister: false,
      };
      console.log(data);
      mailboxVerification(data).then((res) => {
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
  mounted() {},
};
</script>

<style scoped></style>
../../../api/login
