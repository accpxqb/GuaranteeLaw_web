<template>
  <div class="demoTitle">
    <span>{{ t("SecuritySettingLocale.EditPayPwdTitle") }}</span>
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
          <el-col :span="16">
            <el-form-item class="col-form-item" prop="PayPwdOld">
              <template #label>
                <span> {{ t("SecuritySettingLocale.PayPwdOld") }} </span>
              </template>
              <el-input
                type="password"
                show-password
                maxlength="6"
                v-model="formModel.PayPwdOld"
                :placeholder="t('SecuritySettingLocale.PayPwd')"
                class="input-bolded input_120px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
          <el-col :span="16">
            <el-form-item class="col-form-item" prop="PayPwd">
              <template #label>
                <span> {{ t("SecuritySettingLocale.PayPwdNew") }} </span>
              </template>
              <el-input
                type="password"
                show-password
                maxlength="6"
                v-model="formModel.PayPwd"
                :placeholder="t('SecuritySettingLocale.PayPwd')"
                class="input-bolded input_120px"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="white-row">
          <el-col :span="16">
            <el-form-item class="col-form-item" prop="PayPwdConfirm">
              <template #label>
                <span> {{ t("SecuritySettingLocale.PayPwdConfirm") }} </span>
              </template>
              <el-input
                type="password"
                show-password
                maxlength="6"
                v-model="formModel.PayPwdConfirm"
                :placeholder="t('SecuritySettingLocale.PayPwdConfirm')"
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
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { SavePayPwdForEdit } from "@/api/user.js";

const { t } = useI18n();
const formEl = ref<FormInstance>();

interface UserPassword {
  PayPwdOld: string;
  PayPwd: string;
  PayPwdConfirm: string;
  IsSaving: boolean;
}

const formModel = reactive<UserPassword>({
  PayPwdOld: "",
  PayPwd: "",
  PayPwdConfirm: "",
  IsSaving: false,
});

const Save = (form: any) => {
  form.clearValidate();
  form.validate((valid: any) => {
    if (valid) {
      formModel.IsSaving = true;
      SavePayPwdForEdit(formModel.PayPwdOld, formModel.PayPwd).then(
        (x: any) => {
          formModel.IsSaving = false;
          if (x.code) {
            ElMessage({ message: t("Common.SaveOK"), type: "success" });
            router.push({ path: "SecuritySetting" });
          } else {
            ElMessage.error(x.msg);
          }
        }
      );
    }
  });
};

const checkRule = (rule: any, value: string, callback: any) => {
  let reg: any,
    msg: string = "";
  if (rule.field == "PayPwd" || rule.field == "PayPwdConfirm") {
    // reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    reg = /^\d{6}$/;
    // msg = t('SecuritySettingLocale.ValidatePasswordError');
    msg = "请输入6位数字";
  }
  if (reg.test(value) == false) {
    callback(new Error(msg));
  } else {
    if (rule.field == "PayPwd" || rule.field == "PayPwdConfirm") {
      if (
        formModel.PayPwd &&
        formModel.PayPwdConfirm &&
        formModel.PayPwd != formModel.PayPwdConfirm
      ) {
        callback(new Error(t("SecuritySettingLocale.ValidatePayPwdNotEqual")));
      }
    }
  }
  callback();
};

const rules = reactive<FormRules>({
  PayPwdOld: [
    {
      required: true,
      message: t("SecuritySettingLocale.ValidatePayPwdOld"),
      trigger: "blur",
    },
  ],
  PayPwd: [
    {
      required: true,
      message: t("SecuritySettingLocale.ValidatePayPwdNewReqruied"),
      trigger: "blur",
    },
    { validator: checkRule, trigger: "blur" },
  ],
  PayPwdConfirm: [
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
