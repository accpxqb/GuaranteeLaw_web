<template>
  <div class="demoTitle">
    <span>{{ $t("SecuritySettingLocale.EditEmail") }}</span>
  </div>
  <div class="demo-form demo-block">
    <div class="source">
      <el-form
        ref="formEl"
        :rules="rules"
        :model="formModel"
        label-position="right"
        label-width="120px"
        v-if="formModel.IsFirstStep"
      >
        <el-row :gutter="20" class="white-row">
          <el-col :span="8">
            <el-form-item class="col-form-item" prop="Email">
              <template #label>
                <span> {{ $t("SecuritySettingLocale.EmailOld") }} </span>
              </template>
              <el-text class="mx-1">{{
                email_format(formModel.Email)
              }}</el-text>
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="formModel.Passed">
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
                <span> {{ $t("SecuritySettingLocale.EmailCode") }} </span>
              </template>
              <el-input
                v-model="formModel.Code"
                maxlength="6"
                :placeholder="t('SecuritySettingLocale.EmailCode')"
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
                @click="Next(formEl)"
                :loading="formModel.IsSaving"
                v-if="formModel.Passed"
                >{{ $t("button.Next") }}</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-form
        ref="formEl2"
        :rules="rules"
        :model="formModel"
        label-position="right"
        label-width="120px"
        v-else
      >
        <el-row :gutter="20" class="white-row">
          <el-col :span="8">
            <el-form-item class="col-form-item" prop="Email">
              <template #label>
                <span> {{ $t("SecuritySettingLocale.EmailNew") }} </span>
              </template>
              <el-input
                v-model="formModel.Email"
                :placeholder="t('SecuritySettingLocale.Email')"
                class="input-bolded"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="formModel.Passed">
            <el-button
              size="small"
              type="success"
              style="height: 30px"
              v-if="formModel.SendVisible"
              @click="SendCode(formEl2)"
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
                <span> {{ $t("SecuritySettingLocale.EmailCode") }} </span>
              </template>
              <el-input
                v-model="formModel.Code"
                maxlength="6"
                :placeholder="t('SecuritySettingLocale.EmailCode')"
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
                @click="Save(formEl2)"
                :loading="formModel.IsSaving"
                v-if="formModel.Passed"
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
import { email_format } from "@/utils/formatter.js";
import { GetSecuritySetting, SaveSecurityEmailForEdit } from "@/api/user.js";
import { Send, ReSend, Check } from "@/api/email.js";
import router from "@/router";

const { t } = useI18n();
const formEl = ref<FormInstance>();
const formEl2 = ref<FormInstance>();

interface SecurityEmail {
  IsFirstStep: boolean;
  Passed: boolean;
  Email: string;
  Code?: string;
  SendVisible: boolean;
  TimeCount: number;
  IsResend: boolean;
  SmsId?: string;
  SmsId2?: string;
  IsSaving: boolean;
}
const showTimer = (isStop?: boolean) => {
  const TimeCount = 60;
  let timer: any;
  if (!timer) {
    if (isStop) {
      clearInterval(timer);
      timer = null;
    }
    formModel.TimeCount = TimeCount;
    formModel.SendVisible = false;
    formModel.IsResend = true;
    timer = setInterval(() => {
      if (formModel.TimeCount > 0 && formModel.TimeCount <= TimeCount) {
        formModel.TimeCount--;
      } else {
        formModel.SendVisible = true;
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  }
};
const formModel = reactive<SecurityEmail>({
  IsFirstStep: true,
  Passed: false,
  Email: "",
  SendVisible: true,
  TimeCount: 0,
  IsResend: false,
  IsSaving: false,
});
const SendCode = (form: any) => {
  form.clearValidate();
  form.validateField(["Email"], (valid: any) => {
    if (valid) {
      if (!formModel.IsResend) {
        Send(formModel.Email).then((x: any) => {
          if (x.code) {
            ElMessage({
              message: t("SecuritySettingLocale.SendCodeOk"),
              type: "success",
            });
            if (formModel.IsFirstStep) formModel.SmsId = x.data.SmsId;
            else formModel.SmsId2 = x.data.SmsId;
            showTimer();
          } else {
            ElMessage.error(t("SecuritySettingLocale.SendCodeError"));
          }
        });
      } else {
        ReSend(formModel.SmsId, formModel.Email).then((x: any) => {
          if (x.code) {
            ElMessage({
              message: t("SecuritySettingLocale.SendCodeOk"),
              type: "success",
            });
            if (formModel.IsFirstStep) formModel.SmsId = x.data.SmsId;
            else formModel.SmsId2 = x.data.SmsId;
            showTimer();
          } else {
            ElMessage.error(t("SecuritySettingLocale.SendCodeError"));
          }
        });
      }
    }
  });
};
const Next = (form: any) => {
  form.clearValidate();
  form.validate((valid: any) => {
    if (valid) {
      formModel.IsSaving = true;
      Check(formModel.SmsId, formModel.Email, formModel.Code).then((x: any) => {
        if (x.code) {
          if (x.data.Success) {
            showTimer(true);
            formModel.IsSaving = false;
            formModel.Email = "";
            formModel.SendVisible = true;
            formModel.TimeCount = 0;
            formModel.IsResend = false;
            formModel.IsSaving = false;
            formModel.IsFirstStep = false;
            formModel.Code = "";
          } else {
            formModel.IsSaving = false;
            ElMessage.error(x.data.Message);
          }
        } else {
          formModel.IsSaving = false;
          ElMessage.error(t("SecuritySettingLocale.SendCodeError"));
        }
      });
    }
  });
};

const Save = (form: any) => {
  form.clearValidate();
  form.validate((valid: any) => {
    if (valid) {
      formModel.IsSaving = true;
      Check(formModel.SmsId2, formModel.Email, formModel.Code).then(
        (x: any) => {
          if (x.code) {
            if (x.data.Success) {
              SaveSecurityEmailForEdit(formModel.SmsId, formModel.SmsId2).then(
                (x: any) => {
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
                }
              );
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
    formModel.Passed = x.data.EmailPassed;
    formModel.Email = x.data.Email;
  });
});

const checkRule = (rule: any, value: string, callback: any) => {
  let reg: any,
    msg: string = "";
  if (rule.field == "Email") {
    reg = /^([0-9a-zA-Z_\.-])+\@([0-9a-zA-Z_\.-])+\.([a-zA-Z]+)$/;
    msg = t("SecuritySettingLocale.ValidateEmailFormatError");
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
});
</script>
<style scoped>
.input_120px {
  width: 120px;
}
</style>
