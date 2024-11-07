<template>
    <el-space :size="30" wrap style="margin-bottom: 15px;">
    <el-row>
        <el-col :span="24" style="text-align: center;">
            <div @click="zfbpay" class="zfbbtn btn">
                <el-row>
                    <el-col :span="10" style="text-align: right;">
                        <img class="btnimg" src="../../../assets/images/zfbtb.png"> 
                   
                    </el-col>
                    <el-col :span="14" style="text-align: left;">
                        <label>支付宝支付</label>
                    </el-col>
                   
                </el-row>
               
            </div>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24">
            <div @click="wxpay" class="wxbtn btn">
                <el-row>
                    <el-col :span="10" style="text-align: right;">
                        <img class="btnimg" src="../../../assets/images/wxtb.png"> 
                   
                    </el-col>
                    <el-col :span="14" style="text-align: left;">
                        <label>微信支付</label>
                    </el-col>
                   
                </el-row>
                 
            </div>
            <!-- <img src="../../../assets/images/wxbtn.png" style="cursor: pointer;" @dragstart.prevent width="468" height="66" /> -->
        </el-col>
    </el-row>
</el-space>

<div ref="formRef" style="display: none;"  >  
   {{ payFrom }}
<span  v-html="payFrom"></span>
</div>
</template>
<script setup> 
import {paytest} from '../../../api/pay'
import {payOrder} from '../../../api/orderbase'
import {ref,onMounted} from 'vue'
import {ElMessageBox} from 'element-plus'
 
const emit = defineEmits(['dopay'])
const props = defineProps({
    orderId: {
        type: Number,
        default: 0

    },
    
});
const formRef = ref()
const payFrom = ref()
const zfbpay = ()=>{
    let data =  {
        OrderId:props.orderId,
        PaymentMethod:1
    }
    payOrder(data).then(res=>{       
        if(res.code){            
            payFrom.value=res.data.replace("form","form target='_blank' ")
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
const wxpay = ()=>{     
    let data =  {
        OrderId:props.orderId,
        PaymentMethod:2
    }
    payOrder(data).then(res=>{       
        if(res.code){            
            emit("dopay",res.data)
        }else{
            console.log(res)
            ElMessageBox.alert('支付失败')
        }
        
    })
}

onMounted(() => {   
     
})

  
 
</script>
<style scoped>
.zfbbtn{    
    /* background: url('../../../assets/images/zfbbtn.png'); */
    background: #0D8FFF;
}
.wxbtn{
    /* background: url('../../../assets/images/wxbtn.png'); */
    background: #00B515;
    
}
.btn{
    width:468px;
    height: 66px;
    border-radius: 15px;
    background-size: 100% 100%;
    line-height: 66px;
    font-size: 18px;
    color: white;
    text-align: center;
    cursor: pointer;
    margin-left: 20px;
}
.btnimg{
width: 20px;
height: 20px;
margin-top: 23px;
margin-right: 20px;

}
</style>