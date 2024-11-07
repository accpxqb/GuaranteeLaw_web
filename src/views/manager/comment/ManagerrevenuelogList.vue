<template>
    <el-table  :data="tableData" height="400" style="width: 100%">
      <el-table-column prop="CreatedDate" label="提现时间" />
      <el-table-column prop="Amount" label="提现金额(元)" />
      <el-table-column prop="PaymentMethod" label="账户类型" />
      <el-table-column prop="PaymentState" label="提现状态" />
      <el-table-column prop="PaymentDate" label="到账时间" />
    </el-table>
    
  </template>
  
  <script  setup>
  import { ref, reactive, onBeforeMount,onMounted } from "vue";
  import {revenueLogList} from '@/api/manager'

  const props = defineProps({
    TradeType: {
        type: Number,
        default: 0

    },
    
});
  const tableData = ref([])

  onMounted(()=>{
    revenueLogList({TradeType:props.TradeType}).then(res=>{
      if(res.data){
        tableData.value = res.data
        tableData.value.forEach(row =>{          
          if(row.PaymentDate==null){
            row.PaymentState='未到账'
          }else{
            row.PaymentState='提现成功'
            row.PaymentDate = row.PaymentDate.replace("T"," ")
          }
          if(row.PaymentMethod==1){
            row.PaymentMethod = "支付宝"
          }
          if(row.PaymentMethod==2){
            row.PaymentMethod = "微信" 
          }
          // row.CreatedDate = row.CreatedDate.replace("T"," ")
          row.CreatedDate = row.CreatedDate.replace("T"," ")
        })
      }
    })
  })
  </script>
  