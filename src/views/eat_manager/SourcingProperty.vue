<template>
  <SourcingEatCard :sourcing="sourcing" v-loading="loading">
    <template #cardHeader>
      <div class="card-header">
        <span style="color: white">
          {{ "发布时间" + ": " + sourcing.CreateTime }}
        </span>
      </div>
    </template>
    <template #managerRes>
      <div class="title_div">
        <el-text tag="b" size="large">推荐服务</el-text>
        <el-select
          placeholder="请选择服务"
          v-model="selectedResList"
          multiple
          style="width: 300px"
          value-key="BanquetId"
          :disabled="modified"
          @change="restaurantChange"
        >
          <el-option
            v-for="item in restaurantList"
            :key="item.Id"
            :label="item.Name"
            :value="item"
          />
        </el-select>
      </div>
      <div
        v-for="(item, index) in selectedResList"
        :key="index"
        style="
          margin-top: 1em;
          padding: 1em;
          border: solid 0.5px #c4c4c4;
          border-radius: 4px;
        "
      >
        <div style="display: flex">
          <div style="border-right: solid 0.5px #c4c4c4; text-align: center">
            <el-image
              style="
                width: 120px;
                height: 120px;
                margin-right: 1em;
                border-radius: 4px;
              "
              :src="item.picUrl"
            />
            <div style="margin-right: 1em">{{ item.Name }}</div>
          </div>
          <div style="flex: 1; margin-left: 1em">
            <template v-for="(pc, index) in item.PackageList" :key="index">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <el-image
                  style="width: 80px; height: 80px; border-radius: 4px"
                  :src="pc.picUrl"
                />
                <div style="flex: 1; margin-left: 1em">
                  <div style="display: flex; justify-content: space-between">
                    <el-button
                      link
                      @click="editPackage({ package: pc, res: item })"
                    >
                      <span style="font-size: medium; font-weight: bold">
                        {{ pc.PackageName }}
                      </span>
                      <el-icon><ArrowRightBold /></el-icon>
                    </el-button>
                    <el-button link @click="deletePackage(pc.Id)">
                      <el-icon><Delete /> </el-icon>
                    </el-button>
                  </div>
                  <div style="font-size: small; margin-top: 0.5em">
                    <el-input-number
                      v-model="pc.Number"
                      :step="1"
                      step-strictly
                      size="small"
                      :min="1"
                      :max="1000"
                      @change="changeNumber(pc)"
                    />
                    <span> 桌</span>
                  </div>
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      margin-top: 0.5em;
                    "
                  >
                    <span style="font-size: small">{{ pc.PackageName }}</span>
                    <span>总价：{{ pc.TotalPriceN }}</span>
                  </div>
                </div>
              </div>
              <el-divider></el-divider>
            </template>
            <el-dropdown @command="changePackage">
              <el-button type="success">
                添加套餐
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="p in packageMap.get(item.Id)"
                    :key="p.Id"
                    :command="{ info: p, pId: item.Id }"
                  >
                    {{ p.PackageName }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
        <el-divider></el-divider>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div>
            <span>开始时间：</span>
            <el-date-picker
              v-model="item.BeginTime"
              type="datetime"
              placeholder="选择日期时间"
              format="YYYY/MM/DD HH:mm"
              :editable="false"
              :disabled-date="disabledDate"
              style="width: 200px"
            />
          </div>
          <span>
            总计：{{
              item.PackageList.reduce((total: number, item: any) => {
                return total + item.TotalPriceN;
              }, 0)
            }}元
          </span>
        </div>
      </div>

      <el-button
        type="primary"
        style="margin-top: 1em; width: 100%"
        @click="saveToDB"
        v-show="selectedResList.length > 0"
      >
        发送客户
      </el-button>
      <div style="margin-bottom: 100px"></div>
    </template>
  </SourcingEatCard>

  <el-dialog v-model="showEditDialog" top="5vh" destroy-on-close>
    <el-alert
      :title="`客户留言：${currentPackage?.ModificationNotes}`"
      type="error"
      show-icon
      :closable="false"
      style="margin-bottom: 1em"
      v-if="currentPackage?.ModificationNotes"
    />
    <PackageForm
      :package="currentPackage"
      :save-form="saveForm"
      :back-func="closeDialog"
    ></PackageForm>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { getEatDeal } from "@/api/deal";
import { useRouter } from "vue-router";
import SourcingEatCard from "../components/sourcing/SourcingEatCard.vue";
import { ElMessage } from "element-plus";
import { getBanquetList, getPackageList } from "@/api/restaurant";
import config from "@/utils/config";
import {
  editSourcingProperty,
  getModifyPropertyList,
} from "@/api/sourcing_eat";
import PackageForm from "./package/PackageForm.vue";

const router = useRouter();
const sourcing = ref<any>({});
const sourcingId = ref();
const modified = ref(false);

const loading = ref(true);
onMounted(() => {
  sourcingId.value = router.currentRoute.value.query.sourcingId;
  modified.value = Number(router.currentRoute.value.query.IsModification) >= 1;
  const funcs = [getRestaurantList()];
  if (sourcingId.value) funcs.push(getDealInfo());
  if (modified.value && sourcingId.value) funcs.push(getNeedModify());
  Promise.all(funcs).then(() => {
    setTimeout(() => {
      loading.value = false;
    }, 300);
  });
});

/**
 * 获取需求明细
 */
const getDealInfo = () => {
  getEatDeal({ sourcingId: sourcingId.value })
    .then((res: any) => {
      if ((res.code = 1)) {
        sourcing.value = res.data.SourcingEatInfo;
        sourcing.value.CreateTime = sourcing.value.CreateTime.substring(
          0,
          16
        ).replace("T", " ");
      }
      if (res.code == 0) {
        ElMessage.error(res.msg);
        router.push({ name: "EatDealList" });
      }
    })
    .finally(() => {
      return Promise.resolve();
    });
};

/**获取需要修改的列表 */
const getNeedModify = () => {
  getModifyPropertyList({ sourcingId: sourcingId.value })
    .then((res: any) => {
      if (res.code == 1) {
        res.data.forEach((element: any) => {
          console.log("element", element);
          const property = {} as any;
          property.Id = element.BanquetId;
          property.PropertyId = element.Id;
          property.SourcingId = element.SourcingId;
          property.BanquetId = element.BanquetId;
          property.PackageList = element.PropertyPackage;
          property.Name = element.Banquet.Name;
          property.IsModification = element.IsModification;
          property.ModificationNotes = element.ModificationNotes;
          property.picUrl =
            config.CONFIG_IMGURL + "/" + element.Banquet.PicList[0].Url;
          property.PackageList.forEach((item: any) => {
            item.PackagePicList = JSON.parse(item.PackagePicList.split(","));
            console.log("item", item);
            item.picUrl = config.CONFIG_IMGURL + "/" + item.PackagePicList[0];
            item.PackageDetails = JSON.parse(item.PackageDetails);
            item.PackageAmenitys = item.PackageAmenitys.split(",");
            item.TotalPriceN = item.TotalPrice;
          });
          property.BeginTime = new Date(element.BeginTime);
          selectedResList.value.push(property);
          getPackageList({ banquetId: element.BanquetId }).then((res: any) => {
            packageMap.set(element.BanquetId, res.data);
          });
        });
        console.log("res", selectedResList.value);
      }
    })
    .finally(() => {
      return Promise.resolve();
    });
};

/**
 * 获取服务列表
 */
const restaurantList = reactive([] as any[]);
const selectedResList = ref<any[]>([]);
const getRestaurantList = () => {
  getBanquetList({
    banquetId: 0,
    userId: null,
  })
    .then((res: any) => {
      if (res.code == 1) {
        // console.log("restaurant", res.data);
        res.data.forEach((element: any) => {
          // console.log("element", element);
          restaurantList.push(initRestaurant(element));
          //restaurantList.push(element);
        });
      }
    })
    .finally(() => {
      return Promise.resolve();
    });
};

const initRestaurant = (element: any) => {
  const picUrl = config.CONFIG_IMGURL + "/" + element.PicList[0].Url;
  return {
    ...element,
    picUrl,
    SourcingId: sourcingId.value,
    PropertyId: 0,
    BanquetId: element.Id,
    PackageList: [],
  };
};

const packageMap = new Map();

//服务选择事件
const restaurantChange = (val: any) => {
  if (val.length === 0) return;
  const id = val[val.length - 1].Id;
  const r = selectedResList.value.find((item) => item.Id === id);
  // console.log("r", r);
  // console.log("sourcing", sourcing.value);
  r.BeginTime = new Date(sourcing.value.BeginTime);
  //获取套餐
  getPackageList({ banquetId: id }).then((res: any) => {
    packageMap.set(id, res.data);
  });
};

//选择套餐
const changePackage = (val: any) => {
  const restaurantId = val.pId;
  //把p放入selectedResList
  const index = selectedResList.value.findIndex(
    (item) => item.Id === restaurantId
  );
  // console.log("index", index);
  if (index !== -1) {
    const p = {} as any;
    p.Id = selectedResList.value[index].PackageList.length + 1;
    p.PackageId = val.info.Id;
    p.BanquetId = val.info.BanquetId;
    p.PackageName = val.info.PackageName;
    p.PackageDetails = JSON.parse(val.info.PackageDetails);
    p.PackageAmenitys = val.info.PackageAmenitys.split(",");
    p.PackageIntroduction = val.info.PackageIntroduction;
    p.TotalPrice = val.info.TotalPrice;
    p.Number = 1;
    p.TotalPriceN = val.info.TotalPrice;
    p.picUrl = config.CONFIG_IMGURL + "/" + val.info.PackagePicList[0].Url;
    p.PackagePicList = val.info.PackagePicList.map((item: any) => {
      return item.Url;
    });
    selectedResList.value[index].PackageList.push(p);
  }
};

//修改桌数
const changeNumber = (val: any) => {
  //console.log("val", val);
  val.TotalPriceN = val.TotalPrice * val.Number;
};

/**
 * 服务弹窗
 */
const showEditDialog = ref(false);
const currentPackage = ref();
const editPackage = (val: any) => {
  currentPackage.value = val.package;
  currentPackage.value.BanquetId = val.res.Id;
  currentPackage.value.ModificationNotes = val.res.ModificationNotes;
  showEditDialog.value = true;
};

const closeDialog = () => {
  showEditDialog.value = false;
};

/**
 * 传给playServiceForm的保存方法
 */
const saveForm = (val: any) => {
  console.log("val", val);
  //替换
  const index = selectedResList.value.findIndex(
    (item) => item.BanquetId === val.BanquetId
  );
  if (index !== -1) {
    val.picUrl = config.CONFIG_IMGURL + "/" + val.PackagePicList[0];
    const idx = selectedResList.value[index].PackageList.findIndex(
      (i: any) => i.Id === val.Id
    );
    console.log("idx", idx);
    selectedResList.value[index].PackageList.splice(idx, 1, val);
  }
  showEditDialog.value = false;
};

/**
 * 保存到数据库
 */
const submitting = ref(false);
const saveToDB = () => {
  if (
    selectedResList.value.some(
      (element) => !element.PackageList || element.PackageList.length === 0
    )
  ) {
    ElMessage.error("请选择套餐");
    return;
  }
  const submitData = selectedResList.value.map((element) => {
    //console.log("element", element);
    const idTemp = element.PropertyId;
    const timeZone = new Date().getTimezoneOffset() / 60;
    delete element.Id;
    return {
      sourcingId: sourcingId.value,
      PropertyId: modified.value ? idTemp : 0,
      banquetId: element.BanquetId,
      PackageList: element.PackageList,
      BeginTime: new Date(
        element.BeginTime.getTime() - timeZone * 60 * 60 * 1000
      ),
    };
  });
  submitting.value = true;
  editSourcingProperty(submitData)
    .then((res: any) => {
      if (res.code == 1) {
        ElMessage.success("接单成功");
        router.push({ name: "EatDealList" });
      } else {
        ElMessage.error(res.msg);
      }
    })
    .finally(() => {
      submitting.value = false;
    });
};

//time must be greater than or equal today
const disabledDate = (time: { getTime: () => number }) => {
  const date = new Date();
  const millisecond =
    date.getHours() * 60 * 60 * 1000 +
    date.getMinutes() * 60 * 1000 +
    date.getSeconds() * 1000 +
    date.getMilliseconds();
  return time.getTime() < Date.now() - millisecond;
};

const deletePackage = (id: number) => {
  selectedResList.value.forEach((element) => {
    const index = element.PackageList.findIndex((item: any) => item.Id === id);
    if (index !== -1) {
      element.PackageList.splice(index, 1);
    }
  });
};
</script>
<style scoped>
.title_div {
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 0.5em;
}
:deep(.el-select__tags-text) {
  color: var(--el-color-primary);
  font-weight: bold;
}
</style>
