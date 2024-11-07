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
    <el-table-column prop="UserName" label="账户" />
    <el-table-column prop="UserFullName" label="用户名" />
    <el-table-column prop="Amount" label="金额" />
    <el-table-column prop="date" label="时间" />
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
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { getPaymentList } from "@/api/promotion";
import { ElMessage } from "element-plus";

const tableData = ref();

const requestParams = reactive({
  beginTime: "",
  endTime: "",
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
  getPaymentList(requestParams).then((res: any) => {
    // console.log("income-res", res);
    if (res.code == 1) {
      total.value = res.data.count;
      res.data.data.forEach((item: any) => {
        item.date = item.CreateTime.split("T")[0];
      });
      tableData.value = res.data.data;
    } else {
      ElMessage.error(res.msg);
    }
  });
};
</script>
<style scoped></style>
