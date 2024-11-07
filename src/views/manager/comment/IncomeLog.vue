<template>
    <el-form :inline="true" :model="request" class="demo-form-inline">         
        <!-- <el-form-item label="">
            <el-input v-model="request.ManagerName" placeholder="经理名称" clearable />
        </el-form-item> -->
       
        <el-form-item label="结算状态">
            <el-select v-model="request.SettlementStatus" placeholder="结算状态">
                <el-option label="不限" value="" select />
                <el-option label="未结算" value="0"  />
                <el-option label="已结算" value="1"  />

            </el-select>  
        </el-form-item>      
        <el-form-item label="">
            <div class="block">                
                <el-date-picker v-model="request.CreateTimes" type="daterange" unlink-panels range-separator="To"
                    start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts" :size="size" />
            </div>

        </el-form-item>
        <el-form-item>
            
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <!-- <el-button type="primary" @click="btndownLoad">下载</el-button> -->
        </el-form-item>
    </el-form>
    <!-- table-layout="auto" -->
    <el-table :data="tableData"  style="width: 100%"  height="439" :border="true" > 
        <!-- <el-table-column prop="UserName" label="账户名" width="200"  fixed/>
        <el-table-column prop="FullName" label="名称" width="100"/>         -->
        <el-table-column prop="CreatedDate" label="订单完成时间" width="100" resizable="true"/>
        <el-table-column prop="SettlementTime" label="结算时间" width="100" resizable="true"/>
        <el-table-column prop="SettlementStatusStr" label="结算状态" width="100" resizable="true"/>
        <el-table-column prop="Amount" label="结算金额" resizable="true"/>    
        <el-table-column prop="PercentageAmount" label="平台抽成金额" resizable="true"/>
        <el-table-column prop="TotalAmount" label="订单金额" resizable="true"/>    
        <el-table-column prop="RefundAmount" label="订单退款金额" resizable="true"/>    
        <!-- <el-table-column prop="VerifyStatusStr" label="审核状态"  resizable="true"/> -->
        <el-table-column prop="DeductionPoint" label="结算扣点%"  resizable="true"/>
        <el-table-column prop="OrderNo" label="订单编号" width="200" resizable="true"/>
       
        <!-- <el-table-column prop="PaymentDate" label="到账时间" width="180" resizable="true"/> -->
        
        <!-- <el-table-column prop="UnSettledAmount" label="未结算金额" resizable="true"/>
        <el-table-column prop="SettledAmount" label="可提现金额" resizable="true"/>
        <el-table-column prop="AccumulatedAmount" label="累计提现" resizable="true"/>
        <el-table-column prop="OrderNo" label="订单编号" width="200" resizable="true"/> -->
        <!-- <el-table-column fixed="right" label="Operations" width="100" resizable="true">
        <template #default="scope">
          <el-button v-if="scope.row.VerifyStatus==0" link type="primary" size="small"  @click="rowWithdrawal(scope.row)"
          >同意</el-button>
          
          
        </template>
       </el-table-column> -->
    </el-table>

    <el-pagination v-model:current-page="pageRequest.CurrentPage" v-model:page-size="pageRequest.PageSize" :page-sizes="pageRequest.PageSizes"
        :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper"
        :total="pageRequest.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />

   
    
</template>
<script setup>
 
import { onMounted, reactive, ref, computed } from "vue";
 
import {incomeLog} from '@/api/manager'
import { OrderRefundStatus } from "@/utils/enums";
const shortcuts = [
  {
    text: '近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '近三月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const request = ref({
    
})
 
const onSubmit = () => { 
    let times = request.value.CreateTimes
    if(times&&times.length==2){
        request.value.CreatedBegin=times[0].toLocaleDateString ()
        request.value.CreatedEnd=times[1].toLocaleDateString ()
    }else{
        request.value.CreatedBegin=""
        request.value.CreatedEnd=""
    }
    // request.value.VerifyStatus=VerifyStatusWithdrawal[request.value.VerifyStatusStr]     
    getList()
}
 
const getList = ()=>{
    let data = { ...request.value, ...pageRequest.value }
    incomeLog(data).then(res=>{        
        if(res.code){
            tableData.value=res.data.data;
            pageRequest.value.total=res.data.count
            tableData.value.forEach(row=>{               
                // item.VerifyStatusStr = VerifyStatusWithdrawal[item.VerifyStatus]??"--"
                row.CreatedDate = row.CreatedDate.split('T')[0];
                row.SettlementTime = row.SettlementTime?.split('T')[0];
                row.SettlementStatusStr =  row.SettlementStatus?"已结算":"未结算"
                if(row.RefundStatus!=OrderRefundStatus.Refunded){
                    row.RefundAmount='未退款'
                }
                
            })
            console.log(tableData.value)
            
        }
    })
}
const pageRequest = ref({
    PastPage: 0,
    CurrentPage: 1,
    PageSize: 10,
    total:0,
    PageSizes:[10, 100, 200, 300]
})
const handleSizeChange = (val) => {
    pageRequest.value.PageSize=val
    getList()
}
const handleCurrentChange = (val) => {
    pageRequest.value.CurrentPage = val
    getList()
}
const tableData =  ref()
onMounted(() => {     
    getList()    
})
</script>
<style scoped>
</style>