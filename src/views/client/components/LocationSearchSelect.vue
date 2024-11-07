<template>
  <el-select
    v-model="fullAddress"
    filterable
    remote
    reserve-keyword
    placeholder="请输入您期望服务的地址，例如：济南市历下区大明湖景区"
    :remote-method="debouncedSearchDistrict"
    :loading="loading"
    @change="handleDesChange"
    style="width: 100%"
  >
    <el-option
      v-for="item in districtList"
      :key="item.id"
      :label="item.district + ',' + item.name"
      :value="item.id"
    />
  </el-select>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";
import cities from "@/utils/cities.json";
import _ from "lodash";
import axios from "axios";
import { ElMessage } from "element-plus";

const emit = defineEmits(["locationChange"]);

const fullAddress = ref("");

interface AMapApiTip {
  id: string;
  name: string;
  district: string;
  adcode: string;
  location: string;
  address: string;
  typecode: string;
  city: [];
}

const debouncedSearchDistrict = _.debounce((query: string) => {
  searchDistrict(query);
}, 100);

const loading = ref(false);
const districtList = ref<AMapApiTip[]>([]);
let oldQuery = "";
const searchDistrict = (query: string) => {
  if (query == oldQuery || query.length < 2) return;
  if (query.length > 20) {
    ElMessage.error("搜索关键字过长");
    return;
  }
  //截取前两个字
  const cityQuery = query.substring(0, 2);
  //判断cities中是否有该城市
  const city = cities.some((it) => it.name == cityQuery + "市")
    ? cityQuery
    : "";
  oldQuery = query;
  loading.value = true;
  let url = "https://restapi.amap.com/v3/assistant/inputtips?";
  axios
    .get(url, {
      params: {
        key: "790547f5b60a65b2b5f1be9475b2b2ce",
        keywords: query,
        // type: "020000|060000|070000|080000|090000|100000|110000|120000|130000|140000|150000|160000|170000",
        datatype: "all",
        city: city,
      },
    })
    .then(function (res: any) {
      console.log(res);
      if (res.data.tips) {
        districtList.value = res.data.tips;
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleDesChange = (val: string) => {
  if (!val) return;
  let tip: any = districtList.value.find((it) => it.id == val);
  if (tip) {
    if (!tip.location || tip.location == "") {
      ElMessage.error("请选择更精确的地址");
      return;
    }
    emit("locationChange", tip);
  }
};
</script>
