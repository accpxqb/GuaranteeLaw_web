<template>
    <el-space direction="vertical" style="position:absolute;width:300px;left:0;right: 0;margin:auto;">
        
    <el-button type="success" :icon="Check" circle style="width:80px;height:80px;font-size:32px;" />
    <el-text>{{$t("SecuritySettingLocale.FinishFindPwdOK")}}</el-text>
    <el-button type="success" @click="goLogin()" style="margin-top:30px">{{$t("SecuritySettingLocale.LoginNow")}}</el-button>
    </el-space>
</template>
<script lang="ts" setup>
import router from "@/router";
import { Check } from '@element-plus/icons-vue'

const goLogin=()=>{router.push({ path: '/login' })};
</script>