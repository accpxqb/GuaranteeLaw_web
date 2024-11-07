<template>
    <div class="demoTitle">
        <span>{{ $t('SecuritySettingLocale.Title') }}</span>
    </div>
    <div class="demo-form demo-block">
        <div class="source">
            <el-row :gutter="20" class="white-row" style="padding-top:0" v-if="!isClient">
                <el-col :span="3">
                    <el-text class="mx-1" type="success" v-if="model.PayPwdPassed"><el-icon><SuccessFilled /></el-icon>{{ $t('SecuritySettingLocale.Yes') }}</el-text>
                    <el-text class="mx-1" type="warning" v-else><el-icon><WarningFilled /></el-icon>{{ $t('SecuritySettingLocale.No') }}</el-text>
                </el-col>
                <el-col :span="3">
                    <el-text class="mx-1">{{ $t('CashoutConfig.PayPwd') }}</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text class="mx-1" type="info">{{ $t('SecuritySettingLocale.PayPwdInfo') }}</el-text>
                </el-col>
                <el-col :span="3" :offset="6">
                    <el-link href="SecuritySetting_EditPayPwd" v-if="model.PayPwdPassed">{{ $t('SecuritySettingLocale.EditPwd') }}</el-link>
                    <el-link href="SecuritySetting_SetPayPwd" v-else>{{ $t('SecuritySettingLocale.SetPwd') }}</el-link>
                </el-col>
                <el-col :span="3">
                    <el-link href="SecuritySetting_ResetPayPwd" v-if="model.PayPwdPassed">{{ $t('SecuritySettingLocale.ResetPwd') }}</el-link>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="white-row">
                <el-col :span="3">
                    <el-text class="mx-1" type="success" v-if="model.EmailPassed"><el-icon><SuccessFilled /></el-icon>{{ $t('SecuritySettingLocale.Yes') }}</el-text>
                    <el-text class="mx-1" type="warning" v-else><el-icon><WarningFilled /></el-icon>{{ $t('SecuritySettingLocale.No') }}</el-text>
                </el-col>
                <el-col :span="3">
                    <el-text class="mx-1">{{ $t('SecuritySettingLocale.Email') }}</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text class="mx-1" type="info">{{ (model.EmailPassed?`${t('SecuritySettingLocale.EmailInfoYes')}${email_format(model.Email)} `:'')+t('SecuritySettingLocale.EmailInfoNo') }}</el-text>
                </el-col>
                <el-col :span="3" :offset="9">
                    <el-link href="SecuritySetting_EditEmail" v-if="model.EmailPassed">{{ $t('SecuritySettingLocale.EditEmail') }}</el-link>
                    <el-link href="SecuritySetting_BindEmail" v-else>{{ $t('SecuritySettingLocale.BindEmail') }}</el-link>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="white-row">
                <el-col :span="3">
                    <el-text class="mx-1" type="success" v-if="model.MobilePassed"><el-icon><SuccessFilled /></el-icon>{{ $t('SecuritySettingLocale.Yes') }}</el-text>
                    <el-text class="mx-1" type="warning" v-else><el-icon><WarningFilled /></el-icon>{{ $t('SecuritySettingLocale.No') }}</el-text>
                </el-col>
                <el-col :span="3">
                    <el-text class="mx-1">{{ $t('SecuritySettingLocale.Mobile') }}</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text class="mx-1" type="info">{{ (model.MobilePassed?`${t('SecuritySettingLocale.MobileInfoYes')}${mobile_format(model.Mobile)} `:'')+t('SecuritySettingLocale.MobileInfoNo') }}</el-text>
                </el-col>
                <el-col :span="3" :offset="9">
                    <el-link href="SecuritySetting_EditMobile" v-if="model.MobilePassed">{{ $t('SecuritySettingLocale.EditMobile') }}</el-link>
                    <el-link href="SecuritySetting_BindMobile" v-else>{{ $t('SecuritySettingLocale.BindMobile') }}</el-link>
                </el-col>
            </el-row>
            <el-row :gutter="20" class="white-row">
                <el-col :span="3">
                    <el-text class="mx-1" type="success" v-if="model.LoginPwdPassed"><el-icon><SuccessFilled /></el-icon>{{ $t('SecuritySettingLocale.Yes') }}</el-text>
                    <el-text class="mx-1" type="warning" v-else><el-icon><WarningFilled /></el-icon>{{ $t('SecuritySettingLocale.No') }}</el-text>
                </el-col>
                <el-col :span="3">
                    <el-text class="mx-1">{{ $t('SecuritySettingLocale.LoginPwd') }}</el-text>
                </el-col>
                <el-col :span="6">
                    <el-text class="mx-1" type="info">{{ $t('SecuritySettingLocale.LoginPwdInfo') }}</el-text>
                </el-col>
                <el-col :span="3" :offset="6">
                    <el-link href="SecuritySetting_EditLoginPwd" v-if="model.LoginPwdPassed">{{ $t('SecuritySettingLocale.EditPwd') }}</el-link>
                    <el-link href="SecuritySetting_SetLoginPwd" v-else>{{ $t('SecuritySettingLocale.SetPwd') }}</el-link>
                </el-col>
                <el-col :span="3">
                    <el-link href="SecuritySetting_ResetLoginPwd" v-if="model.LoginPwdPassed">{{ $t('SecuritySettingLocale.ResetPwd') }}</el-link>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { reactive, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";
import router from "@/router";
import { mobile_format,email_format } from "@/utils/formatter.js";
import { GetSecuritySetting } from "@/api/user.js";

const { t } = useI18n();
const isClient = router.currentRoute.value.fullPath.toLocaleLowerCase().startsWith('/customer/');
interface SecuritySetting {
    PayPwdPassed: boolean,
    LoginPwdPassed: boolean,
    EmailPassed: boolean,
    MobilePassed: boolean,
    Mobile?:string,
    Email?:string,
    UserType?: number
};

const model = reactive<SecuritySetting>({ PayPwdPassed: false, LoginPwdPassed: false, EmailPassed: false, MobilePassed: false });

onBeforeMount(() => {
    GetSecuritySetting().then((x: any) => {
        model.PayPwdPassed = x.data.PayPwdPassed;
        model.LoginPwdPassed = x.data.LoginPwdPassed;
        model.EmailPassed = x.data.EmailPassed;
        model.MobilePassed = x.data.MobilePassed;
        model.Mobile = x.data.Mobile;
        model.Email = x.data.Email;
        model.UserType = x.data.UserType;
  });
});

</script>
<style scoped>
.el-row {
    padding-top: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #ebebeb;
}

.el-icon {
    margin-right: 5px;
}</style>