<template>
    <div id="bg">
 
  <el-container>
            <el-header style="padding: 0;">
              <BaseHeader />
            </el-header>
            <el-main  :style="{ minHeight: `${height-300}px` }">

                <el-row>
                    <el-col :span="5" :offset="10">

                        <el-image :src="logo" />
                        <div style="padding-top: 54px;text-align: center;">
                            <span  v-if="verifyStatus==0">你的资料已提交，正在努力审核中...... </span>
                            <span  v-if="verifyStatus==1">你的资料不完整，需要修改...... </span>
                            <div class="bottom clearfix" style="padding-top: 40px;">
                            <el-button v-if="verifyStatus==0" size="large" type="success" style="width: 100%;height: 32px;" @click="jumpPage('/')">回到官网</el-button>
                            <el-button v-if="verifyStatus==1" size="large" type="success" style="width: 100%;height: 32px;" @click="jumpPage('/managerRegister')">补充资料</el-button>
                            </div>

                           </div>

                    </el-col>
                </el-row>
            </el-main>
            <el-footer class="footer">
            <BaseFooter />
            </el-footer>
        </el-container>

    </div>
</template>

<script lang="ts" setup>
import logo from "@/assets/images/审核中@2x.png"
import BaseFooter from '@/components/BaseFooter.vue';
import BaseHeader from '@/components/BaseHeader.vue';
import {useWindowSize} from '@vueuse/core'
import { useRouter } from 'vue-router'
import { onBeforeMount, ref } from 'vue';
import { getSignedUser } from '@/api/user'
const { width, height } = useWindowSize()
const router = useRouter()
const jumpPage = (path: string) => {
    router.push(path)
}
const user = ref();
const verifyStatus=ref(2);
onBeforeMount(() => {
    getSignedUser().then((res:any) => {
        console.log(res);
        user.value = res.data;
        verifyStatus.value =user.value.VerifyStatus;
        if(verifyStatus.value == 2)
        {
            router.push('/manager/home')

        }
        console.log(user.value.VerifyStatus);
    })
  });


</script>

