<template>
    <div>
        <el-row>
            <el-col :span="8" ></el-col>
            <el-col :span="8">
            <el-space wrap fill>
                <el-row>
                    <el-col style="text-align: center;font-size: 18px;">待支付金额：<label color="red">{{ props.total }}元</label> </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <img v-if="text" class="mt-6 mb-2 rounded border"  :src="qrcode" alt="QR Code">
                    </el-col>
                   
                </el-row>
                <el-row>
                    <el-col :span="2"></el-col>
                    <el-col :span="7"><el-icon :size="40"><FullScreen /></el-icon></el-col>
                    <el-col :span="15">
                        <el-row>
                            <el-col :span="24">打开手机微信</el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">扫一扫二维码</el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-space>
                
               
            </el-col>
            <el-col :span="8" ></el-col>
        </el-row>
       
    </div>
</template>
<script setup>
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { ref,onMounted} from 'vue'
const props = defineProps({
    url: {
        type: String,
        default: ''

    },
    total:{
        type:Number,
        default: 0
    }
    
});
const text = ref()
const qrcode = useQRCode(text, {
    errorCorrectionLevel: 'H',
    margin: 3,
})
onMounted(() => {
    text.value = props.url
})
</script>
<style scoped>
.border{
    border: 1px solid #060606;
}
</style>