<template>
  <div style="display: flex; margin-bottom: 1em">
    <div>
      <el-date-picker
        v-model="searchDate"
        type="daterange"
        unlink-panels
        range-separator="-"
        start-placeholder="开始时间"
        end-placeholder="截止时间"
        :shortcuts="shortcuts"
      />
    </div>
    <el-button type="primary" @click="search" style="margin-left: 1em">
      搜索
    </el-button>
  </div>
  <el-table :data="tableData" style="width: 100%" border>
    <!-- <el-table-column prop="UserName" label="账户" />
    <el-table-column prop="UserFullName" label="用户名" /> -->
    <el-table-column prop="settlementDate" label="收益周期" />
    <el-table-column prop="Amount" label="收益" />
    <el-table-column prop="CreateTime" label="收益确认时间" />
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="primary" size="small" @click="searchDetail(scope.row)">
          查看明细
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="requestParams.currentPage"
    v-model:page-size="requestParams.pageSize"
    :page-sizes="[10, 20, 30, 40]"
    :background="true"
    :small="true"
    layout="total, sizes, prev, pager, next "
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    style="margin-top: 1em"
  />
  <el-dialog
    v-model="dialogTableVisible"
    title="结算明细"
    @close="handleDialogClose"
    append-to-body
  >
    <el-table :data="detailTableData" border v-loading="!detailTableData">
      <el-table-column property="OrderUserNickName" label="用户名" />
      <!-- <el-table-column property="OrderAmount" label="订单金额" /> -->
      <el-table-column property="Gain" label="订单收益" />
    </el-table>
    <div style="margin-top: 1em">
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="detailTotal"
        small
        @current-change="handleDetailCurrentChange"
      />
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getIncomeList, getIncomeDetailList } from "@/api/promotion";
import { ElMessage } from "element-plus";

const tableData = ref();
const detailTableData = ref();

const requestParams = reactive({
  beginTime: "",
  endTime: "",
  pastPage: 1,
  currentPage: 1,
  pageSize: 40,
});

const detailRequestParams = reactive({
  incomeId: 0,
  pastPage: 1,
  currentPage: 1,
  pageSize: 40,
});

const total = ref(0);

const handleSizeChange = (val: number) => {
  requestParams.pageSize = val;
  search();
};

const handleCurrentChange = (val: number) => {
  requestParams.currentPage = val;
  search();
};

onMounted(() => {
  search();
});

const shortcuts = [
  {
    text: "过去7天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: "过去30天",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
];

const searchDate = ref();

const search = () => {
  if (searchDate.value) {
    requestParams.beginTime = searchDate.value[0];
    requestParams.endTime = searchDate.value[1];
  }
  getIncomeList(requestParams).then((res: any) => {
    console.log("us-res", res);
    if (res.code == 1) {
      total.value = res.data.count;
      res.data.data.forEach((item: any) => {

        let dateObject = new Date(item.SettlementTime);
        item.settlementDate = dateObject.getFullYear()+"-" +(dateObject.getMonth()+1);


        item.CreateTime = item.CreateTime.replace("T"," ");
      });
      tableData.value = res.data.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
};

const dialogTableVisible = ref(false);
const detailTotal = ref(0);

const handleDialogClose = () => {
  dialogTableVisible.value = false;
};

const handleDetailCurrentChange = (val: number) => {
  detailRequestParams.currentPage = val;
  searchDetail(detailRequestParams);
};

const searchDetail = (row: any) => {
  // console.log("row", row);
  detailRequestParams.incomeId = row.Id;
  getIncomeDetailList(detailRequestParams).then((res: any) => {
    // console.log("us-d-res", res);
    if (res.code == 1) {
      detailTotal.value = res.data.count;
      detailTableData.value = res.data.data;
      dialogTableVisible.value = true;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
</script>
<style scoped></style>
