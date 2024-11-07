<template>
  <div>
    <el-form
      ref="userNameForm"
      :rules="rules"
      :model="loginForm"
      style="margin-top: 10px"
      @submit.native.prevent
      @keyup.enter.native="submitLogin(userNameForm)"
    >
      <el-form-item prop="username">
        <el-input
          type="text"
          size="large"
          v-model="loginForm.username"
          :placeholder="$t('loginVue.userName')"
        >
          <template #prepend>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input
          type="password"
          size="large"
          v-model="loginForm.pwd"
          :placeholder="$t('loginVue.passWord')"
        >
          <template #prepend>
            <el-icon><lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          type="text"
          size="large"
          auto-complete="false"
          v-model="loginForm.code"
          :placeholder="$t('loginVue.verificationCode')"
          style="width: 200px; margin-right: 5px"
        >
        </el-input>
        <Identify
          :identifyCode="identifyCode"
          @click="createCode"
          v-if="identifyCode != ''"
        ></Identify>
      </el-form-item>
      <el-checkbox v-model="checked" class="loginRemember">{{
        $t("loginVue.rememberMe")
      }}</el-checkbox>
      <router-link to="/register">
        <el-button type="primary" link style="float: right">{{
          $t("loginVue.goRegister")
        }}</el-button>
      </router-link>
      <router-link to="/ForgetPwd">
        <el-button type="primary" link style="float: right">{{
          $t("loginVue.ForgetPwd")
        }}</el-button>
      </router-link>
      <el-button
        type="primary"
        style="width: 100%"
        @click="submitLogin(userNameForm)"
        >{{ $t("button.signIn") }}</el-button
      >
    </el-form>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import Identify from "@/components/Identify.vue";
import { login } from "@/api/login";
import { onMounted, ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage } from "element-plus";

const router = useRouter();
const { t } = useI18n();
const userNameForm = ref();

const identifyCode = ref("");

const checkCode = (rule, value, callback) => {
  if (identifyCode.value.toLowerCase() != loginForm.code.toLowerCase()) {
    callback(new Error("验证码输入错误"));
  }
  callback();
};
const loginForm = reactive({
  username: localStorage.getItem("userName"),
  pwd: localStorage.getItem("pwd"),
  code: "",
});

const checked = ref(false);
const rules = {
  username: [
    { required: true, message: t("loginVue.enterName"), trigger: "blur" },
    // { min: 5, max: 14, message: '长度在 5 到 14 个字符', trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: t("loginVue.inputPassword"), trigger: "blur" },
    // { min: 6, message: '密码长度要大于6', trigger: 'blur' }
  ],
  code: [
    { required: true, message: t("loginVue.enterCode"), trigger: "blur" },
    {
      validator: checkCode,
      message: t("loginVue.verificationCodeError"),
      trigger: "blur",
    },
  ],
};
const createCode = () => {
  let code = "";
  const codeLength = 4; //验证码的长度
  // const random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
  //     'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //随机数
  const random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9); //随机数
  for (let i = 0; i < codeLength; i++) {
    //循环操作
    let index = Math.floor(Math.random() * 10); //取得随机数的索引（0~35）
    code += random[index]; //根据索引取得随机数加到code上
  }

  identifyCode.value = code;
};
const submitLogin = (form) => {
  form.validate((valid) => {
    if (valid) {
      login(loginForm).then((res) => {
        if (res.code) {
          localStorage.setItem("token", res.data);
          if (checked.value) {
            localStorage.setItem("userName", loginForm.username);
            localStorage.setItem("pwd", loginForm.pwd);
            localStorage.setItem("checked", checked.value);
          } else {
            localStorage.removeItem("userName");
            localStorage.removeItem("pwd");
            localStorage.removeItem("checked");
          }

          router.push("/");
        } else {
          ElMessage.error(res.msg);
        }
      });
    } else {
      // $message.error('登录出错请重新输入');
      return false;
    }
  });
};
onMounted(() => {
  createCode();
  if (localStorage.getItem("checked")) {
    checked.value = JSON.parse(localStorage.getItem("checked"));
  }
});
</script>

<style scoped></style>

@/api/login
