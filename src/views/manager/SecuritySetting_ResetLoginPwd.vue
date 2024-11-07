<template>
  <div class="demoTitle">
    <span>{{ $t("SecuritySettingLocale.ResetLoginPwdTitle") }}</span>
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
        <template v-if="formModel.Mobile && formModel.Mobile != ''">
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
              <el-button
                plain
                style="height: 30px"
                v-if="!formModel.SendVisible"
              >
                重新发送({{ formModel.TimeCount }}s)
              </el-button>
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
                  maxlength="6"
                  :placeholder="t('SecuritySettingLocale.MobileCode')"
                  class="input-bolded"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-else>
          <el-row :gutter="20" class="white-row">
            <el-col :span="10">
              <el-form-item class="col-form-item" prop="Email">
                <template #label>
                  <span> {{ $t("SecuritySettingLocale.Email") }} </span>
                </template>
                <el-text class="mx-1">{{ formModel.Email }}</el-text>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button
                size="small"
                type="success"
                style="height: 30px"
                v-if="formModel.SendVisible"
                @click="SendEmailCode(formEl)"
                :disabled="formModel.IsSaving"
              >
                {{ $t("SecuritySettingLocale.SendCode") }}
              </el-button>
              <el-button
                plain
                style="height: 30px"
                v-if="!formModel.SendVisible"
              >
                重新发送({{ formModel.TimeCount }})
              </el-button>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="white-row">
            <el-col :span="8">
              <el-form-item class="col-form-item" prop="Code">
                <template #label>
                  <span> {{ $t("SecuritySettingLocale.EmailCode") }} </span>
                </template>
                <el-input
                  v-model="formModel.Code"
                  :placeholder="t('SecuritySettingLocale.EmailCode')"
                  class="input-bolded"
                  maxlength="6"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <el-row :gutter="20" class="white-row">
          <el-col :span="16">
            <el-form-item class="col-form-item" prop="LoginPwd">
              <template #label>
                <span> {{ $t("SecuritySettingLocale.LoginPwd") }} </span>
              </template>
              <el-input
                type="password"
                show-password
                v-model="formModel.LoginPwd"
                :placeholder="t('SecuritySettingLocale.LoginPwd')"
                class="input-bolded input_120px"
                autocomplete="new-password"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
          <el-col :span="16">
            <el-form-item class="col-form-item" prop="LoginPwdConfirm">
              <template #label>
                <span> {{ $t("SecuritySettingLocale.LoginPwdConfirm") }} </span>
              </template>
              <el-input
                type="password"
                show-password
                v-model="formModel.LoginPwdConfirm"
                :placeholder="t('SecuritySettingLocale.LoginPwdConfirm')"
                class="input-bolded input_120px"
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
                v-if="formModel.MobilePassed && formModel.LoginPwdPassed"
              >
                {{ $t("button.Save") }}
              </el-button>
              <el-button
                type="success"
                @click="SaveByEmail(formEl)"
                :loading="formModel.IsSaving"
                v-else-if="formModel.EmailPassed && formModel.LoginPwdPassed"
              >
                {{ $t("button.Save") }}
              </el-button>
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
import { GetSecuritySetting, SaveLoginPwdForReset } from "@/api/user.js";
import { Send, ReSend, Check } from "@/api/sms.js";
import { Send as SendEmail, Check as CheckEmail } from "@/api/email.js";

const { t } = useI18n();
const formEl = ref<FormInstance>();

interface LoginPwdModel {
  MobilePassed: boolean;
  EmailPassed: boolean;
  LoginPwdPassed: boolean;
  Mobile: string;
  Code?: string;
  LoginPwd?: string;
  LoginPwdConfirm?: string;
  SendVisible: boolean;
  TimeCount: number;
  IsResend: boolean;
  SmsId?: string;
  IsEditPwd: boolean;
  IsSaving: boolean;
  Email?: string;
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

const formModel = reactive<LoginPwdModel>({
  MobilePassed: false,
  EmailPassed: false,
  LoginPwdPassed: false,
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

const SendEmailCode = (form: any) => {
  form.clearValidate();
  form.validateField(["Email"], (valid: any) => {
    if (valid) {
      SendEmail(formModel.Email).then((x: any) => {
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
  });
};

const Save = (form: any) => {
  form.clearValidate();
  form.validateField(
    ["Mobile", "Code", "LoginPwd", "LoginPwdConfirm"],
    (valid: any) => {
      if (valid) {
        formModel.IsSaving = true;
        Check(formModel.SmsId, formModel.Mobile, formModel.Code).then(
          (x: any) => {
            if (x.code) {
              if (x.data.Success) {
                SaveLoginPwdForReset(formModel.LoginPwd).then((x: any) => {
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

const SaveByEmail = (form: any) => {
  form.clearValidate();
  form.validateField(
    ["Email", "Code", "LoginPwd", "LoginPwdConfirm"],
    (valid: any) => {
      if (valid) {
        formModel.IsSaving = true;
        CheckEmail(formModel.SmsId, formModel.Email, formModel.Code).then(
          (x: any) => {
            if (x.code) {
              if (x.data.Success) {
                SaveLoginPwdForReset(formModel.LoginPwd).then((x: any) => {
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
    formModel.Email = x.data.Email;
    formModel.MobilePassed = x.data.MobilePassed;
    formModel.EmailPassed = x.data.EmailPassed;
    formModel.LoginPwdPassed = x.data.LoginPwdPassed;
  });
});

const checkRule = (rule: any, value: string, callback: any) => {
  let reg: any,
    msg: string = "";
  if (rule.field == "Mobile") {
    reg = /^1[3|4|5|7|8][0-9]{9}$/;
    msg = t("SecuritySettingLocale.ValidateMobileFormatError");
  } else if (rule.field == "Code") {
    reg = /^[0-9]{6}$/;
    msg = t("SecuritySettingLocale.ValidateCodeError");
  } else if (rule.field == "LoginPwd" || rule.field == "LoginPwdConfirm") {
    reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    msg = t("SecuritySettingLocale.ValidatePasswordError");
  } else if (rule.field == "Email") {
    reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    msg = t("SecuritySettingLocale.ValidateEmailFormatError");
  }
  if (reg.test(value) == false) {
    callback(new Error(msg));
  } else {
    if (rule.field == "LoginPwd" || rule.field == "LoginPwdConfirm") {
      if (
        formModel.LoginPwd &&
        formModel.LoginPwdConfirm &&
        formModel.LoginPwd != formModel.LoginPwdConfirm
      ) {
        callback(
          new Error(t("SecuritySettingLocale.ValidateLoginPwdNotEqual"))
        );
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
  Email: [
    {
      required: true,
      message: t("SecuritySettingLocale.ValidateEmailReqruied"),
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
  LoginPwd: [
    {
      required: true,
      message: t("SecuritySettingLocale.ValidateLoginPwdReqruied"),
      trigger: "blur",
    },
    { validator: checkRule, trigger: "blur" },
  ],
  LoginPwdConfirm: [
    {
      required: true,
      message: t("SecuritySettingLocale.ValidateLoginPwdConfirmeqruied"),
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
