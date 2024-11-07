<template>
  <el-card
    style="border: none"
    :body-style="{ padding: '0px' }"
    shadow="never"
    :type="type"
  >
    <template #header>
      <div class="card-header">
        <el-space>
          <el-text style="font-size: x-large">{{ typeName }} 经理推荐 </el-text>
          <el-tag style="margin-left: 5px" type="success" effect="dark">
            优质服务
          </el-tag>
        </el-space>

        <el-row>
          <el-radio-group v-model="city" @change="handleCityChange">
            <el-radio-button label="济南" />
            <el-radio-button label="北京" />
            <el-radio-button label="上海" />
          </el-radio-group>
          <RouterLink
            :to="{ name: 'SearchManager', query: { ManagerType: type } }"
          >
            <el-button :icon="Search" style="margin-left: 5px">更多</el-button>
          </RouterLink>
        </el-row>
      </div>
    </template>
    <template v-if="managerList.length > 0">
      <div class="grid">
        <div v-for="m in managerList">
          <ManagerCard :manager="m" :key="m.Id"></ManagerCard>
        </div>
      </div>
      <div style="text-align: center; margin-top: 1em">
        <el-button
          round
          style="font-weight: bold; margin-bottom: 1em"
          @click="getMoreManagerList"
        >
          {{ butText }}
        </el-button>
      </div>
    </template>
    <div v-else>
      <el-empty description="此地区暂无经理推荐" />
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { getManagerListByCondition } from "@/api/user.js";
import { onMounted, ref, reactive } from "vue";
import type { Manager } from "@/types/manager";
import ManagerCard from "./ManagerCard.vue";
import { Search } from "@element-plus/icons-vue";
import { BusinessType } from "@/utils/enums";

const props = defineProps({
  type: {
    type: Number,
    required: true,
  },
});

const city = ref("济南");
const pageRequest = reactive({
  Name: "",
  CityName: "济南市",
  Rating: 0,
  PastPage: 0,
  CurrentPage: 1,
  PageSize: 4,
  ManagerType: 1,
});
const managerList = ref<Manager[]>([]);

const handleCityChange = (city: string) => {
  pageRequest.CityName = city + "市";
  pageRequest.CurrentPage = 1;
  managerList.value = [];
  getManagerList();
};

const butText = ref("加载更多");
const getManagerList = () => {
  getManagerListByCondition(pageRequest).then((res: any) => {
    //console.log(res);
    if (res.code == 1) {
      const data = res.data.data;
      butText.value = data.length == 0 ? "没有更多了" : "加载更多";
      data.forEach((element: any) => {
        const extend = element.usersExtends[0] as any;
        element.PersonalProfile = extend.PersonalProfile;
        element.PhotoPath = extend.PhotoImg;
        if (element.ManagerScoreJson) {
          element.ManagerScoreInfo = JSON.parse(element.ManagerScoreJson);
        }
      });
      managerList.value = managerList.value.concat(data);
    }
  });
};
const getMoreManagerList = () => {
  pageRequest.CurrentPage++;
  getManagerList();
};
const typeName = ref("");
onMounted(() => {
  pageRequest.ManagerType = props.type;
  switch (props.type) {
    case BusinessType.hotel:
      typeName.value = "乐住";
      break;
    case BusinessType.play:
      typeName.value = "乐玩";
      break;
    case BusinessType.eat:
      typeName.value = "乐食";
      break;
  }
  console.log(pageRequest);
  getManagerList();
});
</script>
<style scoped>
@import "@/styles/client/homepage.css";

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-card:deep(.el-card__header) {
  border-bottom: none;
  padding-left: 0;
  padding-right: 0;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1em;
  grid-row-gap: 1em;
}
</style>
