<template>
  <div class="demoTitle">
    <span>{{ $t("SecuritySettingLocale.ResetPayPwdTitle") }}</span>
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
            <el-form-item class="col-form-item" prop="Mobile">
              <template #label>
                <span> {{ $t("SecuritySettingLocale.Mobile") }} </span>
              </template>
              <el-text class="mx-1">{{
                mobile_format(formModel.Mobile)
              }}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button
              size="small"
              type="success"
              style="height: 30px"
              v-if="formModel.SendVisible"
              @click="SendCode(formEl)"
              :disabled="formModel.IsSaving"
              >{{ $t("SecuritySettingLocale.SendCode") }}</el-button
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
                <span> {{ $t("SecuritySettingLocale.MobileCode") }} </span>
              </template>
              <el-input
                v-model="formModel.Code"
                :placeholder="t('SecuritySettingLocale.MobileCode')"
                class="input-bolded"
                maxlength="6"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
          <el-col :span="16">
            <el-form-item class="col-form-item" prop="PayPassword">
              <template #label>
                <span> {{ $t("SecuritySettingLocale.PayPwd") }} </span>
              </template>
              <el-input
                type="password"
                show-password
                v-model="formModel.PayPassword"
                :placeholder="t('SecuritySettingLocale.PayPwd')"
                class="input-bolded input_120px"
                autocomplete="new-password"
                maxlength="6"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
          <el-col :span="16">
            <el-form-item class="col-form-item" prop="PayPasswordConfirm">
              <template #label>
                <span> {{ $t("SecuritySettingLocale.PayPwdConfirm") }} </span>
              </template>
              <el-input
                type="password"
                show-password
                v-model="formModel.PayPasswordConfirm"
                :placeholder="t('SecuritySettingLocale.PayPwdConfirm')"
                class="input-bolded input_120px"
                maxlength="6"
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
                v-if="formModel.MobilePassed && formModel.PayPwdPassed"
                >{{ $t("button.Save") }}</el-button
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
import { mobile_format } from "@/utils/formatter.js";
import { GetSecuritySetting, SavePayPwdForReset } from "@/api/user.js";
import { Send, ReSend, Check } from "@/api/sms.js";

const { t } = useI18n();
const formEl = ref<FormInstance>();

interface PayPwdModel {
  MobilePassed: boolean;
  PayPwdPassed: boolean;
  Mobile: string;
  Code?: string;
  PayPassword?: string;
  PayPasswordConfirm?: string;
  SendVisible: boolean;
  TimeCount: number;
  IsResend: boolean;
  SmsId?: string;
  IsEditPwd: boolean;
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
const formModel = reactive<PayPwdModel>({
  MobilePassed: false,
  PayPwdPassed: false,
  Mobile: "",
  SendVisible: true,
  TimeCount: 0,
  IsResend: false,
  IsEditPwd: false,
  IsSaving: false,
});
const SendCode = (form: any) => {
  form.clearValidate();
  form.validateField(["Mobile"], (valid: any) => {
    if (valid) {
      if (!formModel.IsResend) {
        Send(formModel.Mobile).then((x: any) => {
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
        ReSend(formModel.SmsId, formModel.Mobile).then((x: any) => {
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
  form.validateField(
    ["Mobile", "Code", "PayPassword", "PayPasswordConfirm"],
    (valid: any) => {
      if (valid) {
        formModel.IsSaving = true;
        Check(formModel.SmsId, formModel.Mobile, formModel.Code).then(
          (x: any) => {
            if (x.code) {
              if (x.data.Success) {
                SavePayPwdForReset(formModel.PayPassword).then((x: any) => {
                  formModel.IsSaving = false;
                  if (x.code) {
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
    }
  );
};

onBeforeMount(() => {
  GetSecuritySetting().then((x: any) => {
    formModel.Mobile = x.data.Mobile;
    formModel.MobilePassed = x.data.MobilePassed;
    formModel.PayPwdPassed = x.data.PayPwdPassed;
  });
});

const checkRule = (rule: any, value: string, callback: any) => {
  let reg: any,
    msg: string = "";
  if (rule.field == "Mobile") {
    reg = /^1[3|4|5|6|7|8][0-9]{9}$/;
    msg = t("SecuritySettingLocale.ValidateMobileFormatError");
  } else if (rule.field == "Code") {
    reg = /^[0-9]{6}$/;
    msg = t("SecuritySettingLocale.ValidateCodeError");
  } else if (
    rule.field == "PayPassword" ||
    rule.field == "PayPasswordConfirm"
  ) {
    reg = /^[0-9]{6}$/;
    msg = t("CashoutConfig.ValidatePaypwdError");
  }
  if (reg.test(value) == false) {
    callback(new Error(msg));
  } else {
    if (rule.field == "PayPassword" || rule.field == "PayPasswordConfirm") {
      if (
        formModel.PayPassword &&
        formModel.PayPasswordConfirm &&
        formModel.PayPassword != formModel.PayPasswordConfirm
      ) {
        callback(new Error(t("SecuritySettingLocale.ValidatePayPwdNotEqual")));
      }
    }
  }
  callback();
};

const rules = reactive<FormRules>({
  Mobile: [
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
  PayPassword: [
    {
      required: true,
      message: t("SecuritySettingLocale.ValidatePayPwdReqruied"),
      trigger: "blur",
    },
    { validator: checkRule, trigger: "blur" },
  ],
  PayPasswordConfirm: [
    {
      required: true,
      message: t("SecuritySettingLocale.ValidatePayPwdConfirmeqruied"),
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
