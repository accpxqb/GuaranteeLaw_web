<template>
<div ref="formRef" style="display: none;"  >  
   {{ payFrom }}
<span  v-html="payFrom"></span>
</div>
</template>
<script setup> 
import { ref,onMounted} from 'vue'
import {getAppPay} from '@/api/order'
import { useRouter, useRoute } from 'vue-router';
const formRef = ref()
const payFrom = ref()
const router = useRouter();
const route = useRoute();
onMounted(() => {
    let orderId=route.query.orderId
    console.log(route.query)
    if(orderId){       
    getAppPay({OrderId:orderId}).then(res=>{       
    if(res.code){ 
        console.log(res.data)           
        payFrom.value=res.data;//.replace("form","form target='_blank' ")
        console.log(payFrom.value)
        setTimeout(()=>{
        document.forms[0].submit()//通过submit()传递给服务器，进行响应
            },100)

    }else{
        console.log(res)
        ElMessageBox.alert('支付失败')
    }
    
    })
    }
    
})
</script>
 