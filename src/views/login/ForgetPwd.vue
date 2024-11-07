<template>
    <div id="bg">

        <el-container>
            <el-header style="padding: 0;">
                <BaseHeader />
            </el-header>
            <el-main style="padding: 0;" :style="{ minHeight: `${height - 300}px` }">
                <el-steps :space="500" :active="step" align-center style="justify-content: center; margin-bottom: 50px; ">
                    <el-step :title="t('SecuritySettingLocale.CheckUserName')" />
                    <el-step :title="t('SecuritySettingLocale.ResetUserPwd')" />
                    <el-step :title="t('SecuritySettingLocale.FinishFindPwd')" />
                </el-steps>
                <ForgetPwdStep1 @changeStep="handleChangeStep" v-if="step==1" />
                <ForgetPwdStep2 @changeStep="handleChangeStep" :smsId="smsIdWithType" v-if="step==2" />
                <ForgetPwdStep3 style="justify-content: center; margin-bottom: 50px; " v-if="step==3" />
            </el-main>
            <el-footer class="footer">
                <BaseFooter />
            </el-footer>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import BaseFooter from '@/components/BaseFooter.vue';
import BaseHeader from '@/components/BaseHeader.vue';
import ForgetPwdStep1 from './components/ForgetPwdStep1.vue';
import ForgetPwdStep2 from './components/ForgetPwdStep2.vue';
import ForgetPwdStep3 from './components/ForgetPwdStep3.vue';
import { useWindowSize } from '@vueuse/core'
const { height } = useWindowSize();
const { t } = useI18n();
const step = ref(1);
const smsIdWithType = ref('');

const handleChangeStep = (stepValue:number, smsId?: string) => {
    step.value = stepValue;
    if(smsId){
        smsIdWithType.value = smsId;
    }
}
</script>

<style scoped>
.footer {
    padding: 0;
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    right: 0px;
    overflow-y: auto;
    height: auto;
}

#bg {
    position: fixed;
    width: 100%;
    height: 100%;
}
</style>

