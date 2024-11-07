<template>
  <el-row>
    <el-col :span="24">
      <el-button
        type="primary"
        style="width: 100%"
        @click="addRestaurant"
        v-if="!managerId"
      >
        新增餐厅
      </el-button>
    </el-col>
  </el-row>
  <el-card
    v-for="restaurant in restaurantList"
    :key="restaurant.Id"
    style="margin-top: 10px"
    shadow="never"
  >
    <el-row align="middle">
      <el-col :span="4">
        <el-image
          class="rounded-img restaurant-img"
          :src="restaurant.HomePageUrl"
          :zoom-rate="1.2"
          :preview-src-list="restaurant.SrcList"
          :initial-index="
            restaurant.SrcList?.findIndex((e) => e == restaurant.HomePageUrl)
          "
          fit="cover"
        >
          <template #error>
            <div class="image-slot">
              <el-icon>
                <Picture />
              </el-icon>
            </div>
          </template>
        </el-image>
      </el-col>
      <el-col :span="20">
        <el-descriptions>
          <template #title>
            <span style="font-size: x-large">{{ restaurant.Name }}</span>
          </template>
          <template #extra v-if="!managerId">
            <el-space class="clear-margin-space">
              <el-button type="primary" @click="addPackage(restaurant.Id)">
                新增套餐
              </el-button>
              <el-dropdown :teleported="true" trigger="click">
                <el-button type="primary">
                  更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button link @click="editRestaurant(restaurant.Id)">
                        编辑
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        link
                        @click="deleteRestaurantEvent(restaurant.Id)"
                      >
                        删除
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-space>
          </template>
          <el-descriptions-item>
            <div class="cell-item">
              <el-icon>
                <location />
              </el-icon>
              {{
                CodeToText[restaurant.Province] +
                "," +
                CodeToText[restaurant.City] +
                "," +
                CodeToText[restaurant.Area] +
                "," +
                restaurant.Address
              }}
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col>
        <el-collapse @change="showPackages(restaurant.Id)">
          <el-collapse-item name="1">
            <template #title>
              <span style="font-size: medium; font-weight: bold">
                查看套餐
              </span>
            </template>
            <template
              v-if="
                packageMap.get(restaurant.Id) != null &&
                packageMap.get(restaurant.Id).length > 0
              "
            >
              <template
                v-for="(p, index) in packageMap.get(restaurant.Id)"
                :key="p.Id"
              >
                <div
                  style="display: flex; align-items: center; margin-top: 1em"
                >
                  <el-image
                    class="rounded-img room-img"
                    :src="p.HomePageUrl"
                    :zoom-rate="1.2"
                    :preview-src-list="p.SrcList"
                    :initial-index="
                      restaurant.SrcList?.findIndex(
                        (e) => e == restaurant.HomePageUrl
                      )
                    "
                    fit="cover"
                    @click="showDetail(restaurant, p)"
                  >
                    <template #error>
                      <div class="image-slot">
                        <el-icon>
                          <Picture />
                        </el-icon>
                      </div>
                    </template>
                  </el-image>

                  <div style="margin-left: 1em; flex: 1">
                    <div style="display: flex; justify-content: space-between">
                      <span style="font-size: large; font-weight: bold">
                        {{ p.PackageName }}
                      </span>
                      <div v-if="!managerId">
                        <el-button
                          link
                          @click="editPackage(restaurant.Id, p.Id)"
                        >
                          {{ "修改" }}
                        </el-button>
                        <el-divider direction="vertical" />
                        <el-button
                          link
                          @click="handleDelete(restaurant.Id, p.Id)"
                        >
                          {{ "删除" }}
                        </el-button>
                      </div>
                    </div>

                    <div>
                      <el-tag
                        v-for="item in p.PackageAmArr"
                        :key="item"
                        type="warning"
                        style="margin-right: 1em"
                      >
                        {{ item }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </template>
            </template>
            <template v-else>
              <el-empty description="无数据" />
            </template>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { Location } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {
  deleteBanquet,
  getBanquetList,
  getPackageList,
  deletePackage,
} from "@/api/restaurant.js";
import { regionData, CodeToText } from "element-china-area-data";
import { ElMessage, ElMessageBox } from "element-plus";
import config from "@/utils/config.js";

const props = defineProps<{
  managerId?: number;
}>();

const router = useRouter();
const addRestaurant = () => {
  router.push({ name: "AddRestaurant" });
};

interface Restaurant {
  Id: number;
  Name: string;
  Province: string;
  ProvinceName?: string;
  City: string;
  CityName?: string;
  Area: string;
  AreaName?: string;
  Address: string;
  RestaurantLevel: number;
  PicList: Pic[];
  HomePageUrl?: string;
  SrcList?: string[];
  Districts?: string;
}
interface Pic {
  Url: string;
  IsHomePage: number;
}

const restaurantList = ref<Restaurant[]>([]);
onMounted(() => {
  getBanquetList({
    banquetId: 0,
    userId: null,
  }).then((res: any) => {
    console.log("res", res);
    restaurantList.value = res.data ?? [];
    if (restaurantList.value.length > 0) {
      restaurantList.value.forEach((restaurant) => {
        if (!restaurant.SrcList) {
          restaurant.SrcList = [];
        }
        if (restaurant.PicList.length > 0) {
          restaurant.PicList.forEach((pic: Pic) => {
            var url = config.CONFIG_IMGURL + pic.Url;
            restaurant.HomePageUrl = pic.IsHomePage == 1 ? url : "";
            restaurant.SrcList?.push(url);
          });
        }
        if (restaurant.HomePageUrl == "" && restaurant.SrcList != null) {
          restaurant.HomePageUrl = restaurant.SrcList[0];
        }
      });
    }
  });
});

const editRestaurant = (restaurantId: number) => {
  if (isNaN(restaurantId)) {
    return;
  }
  router.push({ name: "AddRestaurant", query: { restaurantId: restaurantId } });
};

const deleteRestaurantEvent = (restaurantId: number) => {
  if (isNaN(restaurantId)) {
    return;
  }
  ElMessageBox.confirm("确认删除此酒店吗?", "删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteBanquet({ banquetId: restaurantId }).then((res: any) => {
        if (res.code === 1) {
          ElMessage({
            message: "删除成功",
            type: "success",
          });
          setTimeout(() => {
            location.reload();
          }, 300);
        } else {
          ElMessage.error(res.msg);
        }
      });
    })
    .catch(() => {
      // catch error
    });
};

const addPackage = (restaurantId: number) => {
  if (isNaN(restaurantId)) {
    return;
  }
  console.log("restaurantId", restaurantId);
  router.push({ name: "AddPackage", query: { restaurantId: restaurantId } });
};

const packageMap = reactive(new Map());
const showPackages = (restaurantId: number) => {
  if (isNaN(restaurantId)) {
    return;
  }
  console.log("restaurantId", restaurantId);
  getPackageList({ banquetId: restaurantId }).then((res: any) => {
    console.log("pack", res);
    if (res.code === 1) {
      res.data.forEach((p: any) => {
        if (!p.SrcList) {
          p.SrcList = [];
        }
        if (p.PackagePicList.length > 0) {
          p.PackagePicList.forEach((pic: Pic) => {
            var url = config.CONFIG_IMGURL + pic.Url;
            p.HomePageUrl = pic.IsHomePage == 1 ? url : "";
            p.SrcList?.push(url);
          });
        }
        if (p.HomePageUrl == "" && p.SrcList != null) {
          p.HomePageUrl = p.SrcList[0];
        }
        p.PackageAmArr = p.PackageAmenitys.split(",");
      });
      packageMap.set(restaurantId, res.data);
    }
  });
};

const editPackage = (restaurantId: number, packageId: number) => {
  if (isNaN(restaurantId) || isNaN(packageId)) {
    return;
  }
  //console.log("restaurantId", restaurantId);
  // console.log("packageId", packageId);
  router.push({
    name: "AddPackage",
    query: { packageId: packageId },
  });
};

const handleDelete = (restaurantId: number, packageId: number) => {
  if (isNaN(restaurantId) || isNaN(packageId)) {
    return;
  }
  console.log("restaurantId", restaurantId);
  console.log("packageId", packageId);
  ElMessageBox.confirm("确认删除此套餐吗?", "删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletePackage({ packageId: packageId }).then((res: any) => {
        if (res.code === 1) {
          ElMessage({
            message: "删除成功",
            type: "success",
          });
          setTimeout(() => {
            location.reload();
          }, 300);
        } else {
          ElMessage.error(res.msg);
        }
      });
    })
    .catch(() => {
      // catch error
    });
};

const curRestaurant = ref();
const curPackage = ref();
const showDetail = (r: any, p: any) => {
  console.log("r", r);
  console.log("p", p);
};
</script>
<style scoped>
@import "@/styles/element/clear-space-margin.css";

.cell-item {
  display: flex;
  align-items: center;
}

.rounded-img {
  border-radius: 8px;
}

.restaurant-img {
  width: 120px;
  height: 120px;
}

.room-img {
  width: 80px;
  height: 80px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.image-slot .el-icon {
  font-size: 30px;
}
</style>
