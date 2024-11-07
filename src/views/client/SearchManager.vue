<template>
  <el-row justify="center">
    <el-col :span="16">
      <SearchBar :type="pageRequest.ManagerType" />
      <el-row
        justify="space-between"
        align="middle"
        style="margin-top: 10px; margin-bottom: 10px"
      >
        <el-text size="large">高级筛选</el-text>
        <el-button @click="handleShow">
          <el-row align="middle">
            <el-text>
              {{ show ? "收起筛选" : "展开筛选" }}
              <el-icon
                ref="arrowRef"
                :style="{
                  transition: 'transform 0.25s',
                  transform: show ? 'none' : 'rotate(180deg)',
                }"
              >
                <ArrowUp />
              </el-icon>
            </el-text>
          </el-row>
        </el-button>
      </el-row>
      <el-collapse-transition>
        <el-card
          v-show="show"
          shadow="never"
          :body-style="{ padding: '0px' }"
          style="margin-bottom: 20px"
        >
          <el-row style="margin: 10px">
            <div style="display: flex; align-items: center">
              <div style="width: 75px"><el-text>热门城市: </el-text></div>
              <el-space wrap>
                <el-check-tag
                  v-for="(item, index) in cities"
                  :key="index"
                  :checked="checkedCity == item"
                  @change="handleCity(item)"
                  >{{ item }}
                </el-check-tag>
              </el-space>
            </div>
          </el-row>
          <el-divider style="margin: 0"></el-divider>
          <el-row style="margin: 10px" align="middle">
            <el-text>经理评分:</el-text>
            <el-check-tag
              v-for="item in rates"
              :key="item.value"
              :checked="pageRequest.Rating == item.value"
              @change="handleRate(item.value)"
              class="ml-5"
            >
              {{ item.label }}
            </el-check-tag>
          </el-row>
          <el-divider style="margin: 0"></el-divider>
          <el-row style="margin: 10px">
            <el-text>经理级别:</el-text>
            <el-check-tag
              v-for="item in levels"
              :key="item.value"
              :checked="levelChecked == item.value"
              @change="handleLevel(item.value)"
              class="ml-5"
            >
              {{ item.label }}
            </el-check-tag>
          </el-row>
          <el-row style="margin: 10px">
            <el-text>业务类型:</el-text>
            <el-check-tag
              v-for="item in ManagerTypeOptions"
              :key="item.value"
              :checked="typeChecked == item.value"
              @change="handleType(item.value)"
              class="ml-5"
            >
              {{ item.label }}
            </el-check-tag>
          </el-row>
        </el-card>
      </el-collapse-transition>
      <ManagerCard
        v-for="m in managerList"
        :manager="m"
        :key="m.Id"
        style="margin-bottom: 10px"
      ></ManagerCard>

      <template v-if="!managerList || managerList.length == 0">
        <el-empty description="暂无经理推荐" />
      </template>

      <el-pagination
        background
        layout="prev, pager, next, total"
        :total="total"
        v-model:current-page="pageRequest.CurrentPage"
        v-model:page-size="pageRequest.PageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :hide-on-single-page="true"
      />
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import SearchBar from "@/components/SearchBar.vue";
import { onMounted, reactive, ref, watch, computed } from "vue";
import ManagerCard from "./components/ManagerCard.vue";
import { getManagerListByCondition } from "@/api/user";
import type { Manager } from "@/types/manager";
import { useRoute, useRouter } from "vue-router";
import type { PageRequest } from "@/types/page-request";
import { ManagerType } from "@/utils/enums";
import router from "@/router";

const ManagerTypeOptions = computed(() => {
  let a = Object.keys(ManagerType).map((key) => ({
    label: ManagerType[Number(key)],
    value: key,
  }));
  return a.filter((option) => option.label);
});

interface ManagerPageRequest extends PageRequest {
  Name: string;
  Rating: number;
  CityName: string;
  ManagerType: string;
  Level?: number;
}
const pageRequest: ManagerPageRequest = reactive({
  ManagerType: "1",
  Name: "",
  CityName: "",
  Rating: 0,
  PastPage: 0,
  CurrentPage: 1,
  PageSize: 10,
});

const cities = ref(
  [
    "北京",
    "上海",
    "广州",
    "深圳",
    "济南",
    "青岛",
    "厦门",
    "武汉",
    "西安",
    "成都",
    "郑州",
    "天津",
    "南京",
    "重庆",
    "苏州",
    "宁波",
    "大连",
    "杭州",
    "沈阳",
    "三亚",
  ].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"))
);

const rates = reactive([
  {
    label: "4.5分以上",
    value: 4.5,
  },
  {
    label: "4分以上",
    value: 4,
  },
  {
    label: "3.5分以上",
    value: 3.5,
  },
]);

const levels = reactive([
  {
    label: "钻石达人",
    value: 4,
  },
  {
    label: "黄金达人",
    value: 3,
  },
  {
    label: "银星达人",
    value: 2,
  },
  {
    label: "新晋达人",
    value: 1,
  },
]);

const show = ref(true);
const arrowRef = ref(null);
const handleShow = () => {
  show.value = !show.value;
  const arrow: any = arrowRef.value;
  if (arrow.style) {
    const deg = arrow.style.transform
      ? parseInt(arrow.style.transform.match(/-?\d+/)[0])
      : 0;
    arrow.style.transform =
      deg === 0 ? `rotate(${deg + 180}deg)` : `rotate(${deg - 180}deg)`;
  }
};

const managerList = ref<Manager[]>([]);
const total = ref(0);
const route = useRoute();

watch(
  () => route.query.name,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      pageRequest.Name = newVal as string;
      getManagerList();
    }
  }
);

const typeChecked = ref("1");
const handleType = (val: string) => {
  if (typeChecked.value === val) return;

  typeChecked.value = typeChecked.value === val ? "" : val;
  pageRequest.ManagerType = typeChecked.value;
  getManagerList();
};

const levelChecked = ref();
const handleLevel = (val: number) => {
  levelChecked.value = levelChecked.value === val ? null : val;
  pageRequest.Level = levelChecked.value;
  getManagerList();
};

const checkedCity = ref("");
const handleCity = (val: string) => {
  console.log(val);
  checkedCity.value = checkedCity.value === val ? "" : val;
  pageRequest.CityName = checkedCity.value + "市";
  getManagerList();
};

const handleRate = (val: number) => {
  pageRequest.Rating = pageRequest.Rating === val ? 0 : val;
  getManagerList();
};

const getManagerList = () => {
  console.log(pageRequest);
  getManagerListByCondition(pageRequest).then((res) => {
    total.value = res.data.count;
    managerList.value = res.data.data;
    managerList.value.forEach((element: any) => {
      const extend = element.usersExtends[0] as any;
      element.PersonalProfile = extend.PersonalProfile;
      element.PhotoPath = extend.PhotoImg;
      if (element.ManagerScoreJson) {
        element.ManagerScoreInfo = JSON.parse(element.ManagerScoreJson);
      }
    });
  });
};

const handleCurrentChange = (val: number) => {
  pageRequest.CurrentPage = val;
  getManagerList();
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};

onMounted(() => {
  // console.log(route.query);
  pageRequest.Name = route.query.name as string;
  if (route.query.ManagerType) {
    pageRequest.ManagerType = route.query.ManagerType as string;
    typeChecked.value = route.query.ManagerType as string;
  }
  getManagerList();
});
</script>
<style scoped>
.rotate {
  transform-origin: center;
  transform: rotate(0deg);
  transition: transform 0.25s;
}

:deep(.el-checkbox__inner) {
  display: none;
}

:deep(.el-checkbox__label) {
  padding-left: 0;
}

.boxPadding {
  padding-left: 10px !important;
  padding-right: 10px !important;
}

.ml-5 {
  margin-left: 5px;
}
</style>
