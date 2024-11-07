<template>
  <div class="demoTitle">
    <span>{{ t("SecuritySettingLocale.BindMobile") }}</span>
  </div>
  <div class="demo-form demo-block">
    <div class="source">
      <el-form
        ref="formEl"
        :rules="rules"
        :model="formModel"
        label-position="right"
        label-width="120px"
      >
        <el-row :gutter="20" class="white-row">
          <el-col :span="8">
            <el-form-item class="col-form-item" prop="MobileNo">
              <template #label>
                <span> {{ t("SecuritySettingLocale.MobileNo") }} </span>
              </template>
              <el-input
                v-model="formModel.MobileNo"
                :placeholder="t('SecuritySettingLocale.MobileNo')"
                class="input-bolded"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="formModel.Passed == false">
            <el-button
              size="small"
              type="success"
              style="height: 30px"
              v-if="formModel.SendVisible"
              @click="SendCode(formEl)"
              :disabled="formModel.IsSaving"
              >{{ t("SecuritySettingLocale.SendCode") }}</el-button
            >
            <el-button plain style="height: 30px" v-if="!formModel.SendVisible"
              >重新发送({{ formModel.TimeCount }}s)</el-button
            >
          </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
          <el-col :span="8">
            <el-form-item class="col-form-item" prop="Code">
              <template #label>
                <span> {{ t("SecuritySettingLocale.MobileCode") }} </span>
              </template>
              <el-input
                v-model="formModel.Code"
                maxlength="6"
                :placeholder="t('SecuritySettingLocale.MobileCode')"
                class="input-bolded"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
          <el-col :span="12">
            <el-form-item class="col-form-item">
              <el-button
                type="success"
                @click="Save(formEl)"
                :loading="formModel.IsSaving"
                v-if="formModel.Passed == false"
                >{{ t("button.Save") }}</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { GetSecuritySetting, SaveSecurityMobileForSet } from "@/api/user.js";
import { Send, ReSend, Check } from "@/api/sms.js";

const { t } = useI18n();
const formEl = ref<FormInstance>();

interface SecurityMobile {
  Passed: boolean;
  MobileNo: string;
  Code?: string;
  SendVisible: boolean;
  TimeCount: number;
  IsResend: boolean;
  SmsId?: string;
  IsSaving: boolean;
}
const showTimer = () => {
  const TimeCount = 60;
  let timer: any;
  if (!timer) {
    formModel.TimeCount = TimeCount;
    formModel.SendVisible = false;
    formModel.IsResend = true;
    timer = setInterval(() => {
      if (formModel.TimeCount > 0 && formModel.TimeCount <= TimeCount) {
        formModel.TimeCount--;
      } else {
        formModel.IsResend = true;
        formModel.SendVisible = true;
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  }
};
const formModel = reactive<SecurityMobile>({
  Passed: true,
  MobileNo: "",
  SendVisible: true,
  TimeCount: 0,
  IsResend: false,
  IsSaving: false,
});
const SendCode = (form: any) => {
  form.clearValidate();
  form.validateField(["MobileNo"], (valid: any) => {
    if (valid) {
      if (!formModel.IsResend) {
        Send(formModel.MobileNo).then((x: any) => {
          if (x.code) {
            ElMessage({
              message: t("SecuritySettingLocale.SendCodeOk"),
              type: "success",
            });
            formModel.SmsId = x.data.SmsId;
            showTimer();
          } else {
            ElMessage.error(t("SecuritySettingLocale.SendCodeError"));
          }
        });
      } else {
        ReSend(formModel.SmsId, formModel.MobileNo).then((x: any) => {
          if (x.code) {
            ElMessage({
              message: t("SecuritySettingLocale.SendCodeOk"),
              type: "success",
            });
            formModel.SmsId = x.data.SmsId;
            showTimer();
          } else {
            ElMessage.error(t("SecuritySettingLocale.SendCodeError"));
          }
        });
      }
    }
  });
};
const Save = (form: any) => {
  form.clearValidate();
  form.validate((valid: any) => {
    if (valid) {
      formModel.IsSaving = true;
      Check(formModel.SmsId, formModel.MobileNo, formModel.Code).then(
        (x: any) => {
          if (x.code) {
            if (x.data.Success) {
              SaveSecurityMobileForSet(formModel.SmsId).then((x: any) => {
                formModel.IsSaving = false;
                if (x.code) {
                  formModel.Passed = true;
                  ElMessage({
                    message: t("SecuritySettingLocale.SaveOK"),
                    type: "success",
                  });
                  router.push({ path: "SecuritySetting" });
                } else {
                  ElMessage.error(x.msg);
                }
              });
            } else {
              formModel.IsSaving = false;
              ElMessage.error(x.data.Message);
            }
          } else {
            formModel.IsSaving = false;
            ElMessage.error(t("SecuritySettingLocale.SendCodeError"));
          }
        }
      );
    }
  });
};

onBeforeMount(() => {
  GetSecuritySetting().then((x: any) => {
    formModel.Passed = x.data.MobilePassed;
    formModel.MobileNo = x.data.Mobile;
  });
});

const checkRule = (rule: any, value: string, callback: any) => {
  let reg: any,
    msg: string = "";
  if (rule.field == "MobileNo") {
    reg = /^1[3|4|5|7|8][0-9]{9}$/;
    msg = t("SecuritySettingLocale.ValidateMobileFormatError");
  } else if (rule.field == "Code") {
    reg = /^[0-9]{6}$/;
    msg = t("SecuritySettingLocale.ValidateCodeError");
  }
  if (reg.test(value) == false) {
    callback(new Error(msg));
  }
  callback();
};

const rules = reactive<FormRules>({
  MobileNo: [
    {
      required: true,
      message: t("SecuritySettingLocale.ValidateMobileReqruied"),
      trigger: "blur",
    },
    { validator: checkRule, trigger: "blur" },
  ],
  Code: [
    {
      required: true,
      message: t("SecuritySettingLocale.ValidateCodeReqruied"),
      trigger: "blur",
    },
    { validator: checkRule, trigger: "blur" },
  ],
});
</script>
<style scoped>
.input_120px {
  width: 120px;
}
</style>
