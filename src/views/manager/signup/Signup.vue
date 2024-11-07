<template>
  <div class="bg-div" :style="{ minHeight: `${height - 310}px` }">
    <el-row justify="center" :style="{ height: `${height - 310}px` }">
      <el-col :span="16" class="flex-col">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>{{ submitButtonText }}</span>
            </div>
          </template>
          <el-form
            label-position="left"
            label-width="80px"
            :model="form"
            :rules="rules"
            ref="formRef"
            status-icon
            style="width: 360px"
            @keyup.enter.native="submitForm(formRef)"
          >
            <el-alert
              type="error"
              :title="tipMsg"
              show-icon
              style="margin-bottom: 15px"
            />
            <el-form-item label="手机号" prop="mobile">
              <el-input
                v-model="form.mobile"
                :prefix-icon="Cellphone"
                maxlength="11"
                :readonly="userStore.mobile != ''"
              />
            </el-form-item>
            <el-form-item label="验证码" prop="code">
              <el-input
                v-model="form.code"
                maxlength="6"
                :prefix-icon="ChatDotSquare"
              >
                <template #append>
                  <el-button
                    type="primary"
                    size="small"
                    :disabled="smsDisabled"
                    @click="sendCode"
                  >
                    {{ smsMsg }}
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm(formRef)">
                {{ submitButtonText }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed, reactive, ref } from "vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { Cellphone, ChatDotSquare } from "@element-plus/icons-vue";
import { mobileVerificationNew, mobileLoginRegister } from "@/api/login";
import { useRouter } from "vue-router";
import { getManagerInfo } from "@/api/user";
import { useUserDataStore } from "@/stores/counter";
import { useWindowSize } from "@vueuse/core";

const { width, height } = useWindowSize();
const router = useRouter();
const userStore = useUserDataStore();

interface MobileForm {
  mobile: string;
  code: string;
}
const formRef = ref<FormInstance>();
const form = reactive<MobileForm>({
  mobile: userStore.mobile,
  code: "",
});
const rules = reactive<FormRules>({
  mobile: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  code: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur",
    },
    {
      pattern: /^\d{6}$/,
      message: "请输入正确的验证码",
      trigger: "blur",
    },
  ],
});
const submitButtonText = ref("登录 / 注册");
const tipMsg = ref("请登录，未注册的手机号码验证后自动注册");
onMounted(() => {
  if (localStorage.getItem("token")) {
    if (userStore.smsExpirationTime > 0) {
      // console.log(new Date().toLocaleString());
      // console.log(new Date(userStore.smsExpirationTime).toLocaleString());

      //当前时间小于过期时间，跳转到选择业务
      if (new Date().getTime() < userStore.smsExpirationTime) {
        router.push("/selectBusiness");
      }
    }
    if (userStore.mobile == "") {
      tipMsg.value = "入驻成为经理需要绑定您的手机号";
      submitButtonText.value = "绑定";
    } else {
      tipMsg.value = "当前账号已绑定手机号，请验证是您本人";
      submitButtonText.value = "验证当前手机号";
    }
  }
});

const smsMsg = ref("获取验证码");
let count = 0;
//SMS code button
const smsDisabled = computed(() => {
  // validate mobile
  const mobile = form.mobile;
  return !mobile || count > 0 || !/^1[3456789]\d{9}$/.test(mobile);
});
const sendCode = () => {
  if (smsDisabled.value) return;
  mobileVerificationNew({ mobile: form.mobile }).then((res: any) => {
    console.log(res);
    if (res.code == 1) {
      ElMessage({
        showClose: true,
        message: "验证码已发送",
        type: "success",
        center: true,
      });
      //倒计时
      count = 60;
      const timer = setInterval(() => {
        count--;
        smsMsg.value = count + "s";
        if (count <= 0) {
          clearInterval(timer);
          smsMsg.value = "获取验证码";
        }
      }, 1000);
    } else {
      ElMessage({
        showClose: true,
        message: "验证码发送失败，请重试",
        type: "error",
        center: true,
      });
    }
  });
};

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      loginOrSignup();
    } else {
      ElMessage({
        showClose: true,
        message: "请正确填写信息",
        type: "error",
        center: true,
      });
    }
  });
};

const loginOrSignup = () => {
  mobileLoginRegister(form).then((res: any) => {
    console.log(res);
    if (res.code == 1) {
      ElMessage({
        showClose: true,
        message: "登录成功",
        type: "success",
        center: true,
      });
      localStorage.removeItem("token");
      localStorage.setItem("token", res.data.TokenStr);
      //getUser()
      userStore.userName = res.data.user.UserName;
      userStore.userExtends = res.data.user.usersExtends;
      userStore.mobile = res.data.user.Mobile;
      //两小时后过期
      userStore.smsExpirationTime = new Date().getTime() + 7200000;
      sessionStorage.setItem(
        "smsExpirationTime",
        userStore.smsExpirationTime.toString()
      );
      userStore.logged = true;
      setTimeout(() => {
        router.push("/selectBusiness");
      }, 500);
    } else {
      ElMessage({
        showClose: true,
        message: res.msg,
        type: "error",
        center: true,
      });
    }
  });
};

const getUser = () => {
  getManagerInfo().then((res: any) => {
    if (res.data) {
      console.log(res.data);
      userStore.userName = res.data.UserName;
      userStore.userExtends = res.data.usersExtends;
      userStore.mobile = res.data.Mobile;
    }
  });
};
</script>

<style scoped>
.box-card {
  width: 400px;
  background: aliceblue;
  box-shadow: 0 0 25px #0ea3ba;
}

.bg-div {
  background: url("@/assets/images/login_bg.png");
  background-size: 100% 100%;
}
.flex-col {
  display: flex;
  justify-content: end;
  align-items: center;
  width: 100%;
}
</style>
