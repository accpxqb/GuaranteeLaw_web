<template>
  <el-card class="homepage-card" shadow="never" body-style="padding:1em;">
    <template #header>
      <div class="card-header">
        <span style="font-size: larger">{{
          $t("homepageHotelFormVue.HotelServices")
        }}</span>
      </div>
    </template>
    <el-form
      ref="sourcingFormRef"
      :model="sourcingForm"
      label-position="top"
      size="large"
      :rules="rules"
      :hide-required-asterisk="true"
    >
      <el-space
        direction="vertical"
        style="width: 100%"
        :size="15"
        :fill="true"
      >
        <el-row class="white-row">
          <el-col :span="12" style="padding-left: 1em; padding-right: 0.5em">
            <el-form-item
              :label="$t('homepageHotelFormVue.Destination')"
              class="col-form-item"
              prop="Destination"
            >
              <el-select
                v-model="fullAddress"
                filterable
                remote
                reserve-keyword
                :placeholder="$t('homepageHotelFormVue.Destination')"
                :remote-method="searchDistrict"
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
            </el-form-item>
          </el-col>

          <el-col :span="12" style="padding-left: 0.5em; padding-right: 1em">
            <el-form-item
              :label="$t('homepageHotelFormVue.CheckInTime')"
              class="col-form-item"
            >
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                :range-separator="nightCount"
                :start-placeholder="$t('HotelFormPlaceholder.CheckIn')"
                :end-placeholder="$t('HotelFormPlaceholder.CheckOut')"
                :clearable="false"
                :disabled-date="disabledDate"
                value-format="x"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="white-row">
          <el-col :span="8" style="margin-left: 1em; margin-right: 0.5em">
            <el-form-item
              :label="$t('homepageHotelFormVue.RoomsAndResidents')"
              class="col-form-item"
              :hide-after="1"
            >
              <el-popover :width="270" trigger="click">
                <template #reference>
                  <el-input
                    :readonly="true"
                    :suffix-icon="ArrowDown"
                    v-model="roomsAndResidents"
                  ></el-input>
                </template>
                <el-space direction="vertical" alignment="flex-start">
                  <el-row justify="space-between" style="width: 240px">
                    <el-col :span="12">
                      <label>{{ $t("homepageHotelFormVue.Rooms") }} </label>
                    </el-col>
                    <el-col :span="12">
                      <el-input-number
                        v-model="sourcingForm.Rooms"
                        :step-strictly="true"
                        value-on-clear="min"
                        size="small"
                        :min="1"
                        :max="20"
                      />
                    </el-col>
                  </el-row>
                  <el-row justify="space-between" style="width: 240px">
                    <el-col :span="12">
                      <label>
                        {{ $t("homepageHotelFormVue.Adults") }}
                        <span class="description-span"> 18岁及以上 </span>
                      </label>
                    </el-col>
                    <el-col :span="12">
                      <el-input-number
                        v-model="sourcingForm.Adults"
                        :step-strictly="true"
                        value-on-clear="min"
                        size="small"
                        :min="1"
                        :max="maxAdults"
                      />
                    </el-col>
                  </el-row>
                  <el-row justify="space-between" style="width: 240px">
                    <el-col :span="12">
                      <label>
                        儿童
                        <span class="description-span"> 0-17岁</span>
                      </label>
                    </el-col>
                    <el-col :span="12">
                      <el-input-number
                        v-model="sourcingForm.Children"
                        :step-strictly="true"
                        value-on-clear="min"
                        size="small"
                        :min="0"
                        :max="maxChildren"
                      />
                    </el-col>
                  </el-row>
                  <el-row v-if="sourcingForm.Children">
                    <span
                      >儿童年龄
                      <span class="description-span">以入住当天计算</span></span
                    >
                  </el-row>
                  <el-row v-if="sourcingForm.Children">
                    <el-space wrap>
                      <el-select
                        :teleported="false"
                        size="small"
                        v-for="item in sourcingForm.Children"
                        :key="item"
                        :label="item"
                        style="width: 100px"
                        v-model="childrenAgeArr[item - 1]"
                      >
                        <el-option :key="0" label="<1" :value="0" />
                        <el-option
                          v-for="item in 17"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </el-select>
                    </el-space>
                  </el-row>
                </el-space>
              </el-popover>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
                                <el-form-item label="单人间" class="col-form-item">
                                    <el-select v-model="sourcingForm.SingleRooms"   collapse-tags collapse-tags-tooltip
                                        placeholder="不限" style="width: 100%;" @change="changerooms()">
                                        <el-option  label="不限" :value="0"
                                            :key="0" />
                                        <el-option v-for="item in 10" :label="item+'间'" :value="item"
                                            :key="item" />
                                    </el-select>
                                </el-form-item>
                            </el-col> -->
          <!-- <el-col :span="4">
                                <el-form-item label="双人间" class="col-form-item">
                                    <el-select v-model="sourcingForm.DoubleRooms"   collapse-tags collapse-tags-tooltip
                                        placeholder="不限" style="width: 100%;" @change="changerooms()">
                                        <el-option  label="不限" :value="0"
                                            :key="0" />
                                        <el-option v-for="item in 10" :label="item+'间'" :value="item"
                                            :key="item" />
                                    </el-select>
                                </el-form-item>
                            </el-col> -->
          <el-col :span="8" style="margin-left: 0.5em; margin-right: 0.5em">
            <el-form-item label="酒店级别" class="col-form-item">
              <el-select
                v-model="hotelLevelChecked"
                multiple
                collapse-tags
                collapse-tags-tooltip
                placeholder="不限"
                style="width: 100%"
              >
                <el-option
                  v-for="item in hotelLevelArr"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-right: 1em; margin-left: 0.5em">
            <el-form-item
              :label="$t('homepageHotelFormVue.Budget')"
              class="col-form-item"
            >
              <el-input
                v-model.number="sourcingForm.Budget"
                :placeholder="$t('homepageHotelFormVue.Budget')"
                class="input-bolded"
              >
                <template #suffix>
                  <span>元/晚</span>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="white-row" style="padding-top: 10px; padding-bottom: 20px">
          <div style="margin-left: 1em; margin-right: 1em">
            <el-checkbox-group v-model="requirementsChecked">
              <el-checkbox
                v-for="item in requirementsArr"
                :label="item.value"
                :key="item.value"
              >
                <label style="font-size: 12px">{{ item.label }}</label>
              </el-checkbox>
            </el-checkbox-group>
            <el-popover
              :visible="visible"
              trigger="click"
              placement="top"
              :width="300"
            >
              <div class="morepover">
                <el-row>
                  <el-col :span="8">服务商品</el-col>
                  <el-col :span="16">
                    <el-input
                      size="small"
                      v-model="TradeName"
                      placeholder="请输入商品名称"
                    />
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">品牌名称</el-col>
                  <el-col :span="16">
                    <el-input
                      size="small"
                      v-model="Brand"
                      placeholder="请输品牌名称"
                    />
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">商品数量</el-col>
                  <el-col :span="16">
                    <el-input-number
                      :min="1"
                      size="small"
                      v-model="TradeNum"
                      placeholder="请输入商品数量"
                    />
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-button
                      size="small"
                      style="width: 100%"
                      text
                      @click="visible = false"
                    >
                      取消
                    </el-button>
                  </el-col>
                  <el-col :span="12"
                    ><el-button
                      size="small"
                      style="width: 100%"
                      type="primary"
                      @click="btnaddflag"
                    >
                      确定
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <template #reference>
                <el-button
                  size="large"
                  type="success"
                  round
                  style="
                    border-radius: 12px;
                    width: 130px;
                    height: 30px;
                    margin-bottom: 8px;
                  "
                  :icon="Plus"
                  @click="visible = true"
                  >添加更多需求
                </el-button>
              </template>
            </el-popover>
          </div>

          <div style="margin-top: 5px; margin-left: 1em; margin-right: 1em">
            <el-input
              :rows="3"
              resize="none"
              type="textarea"
              v-model="sourcingForm.Memo"
              placeholder="留言"
              maxlength="100"
            />
          </div>
        </div>
        <el-row>
          <el-button
            size="large"
            type="danger"
            style="width: 100%"
            @click="fastSubmit(sourcingFormRef)"
          >
            发布
          </el-button>
        </el-row>
      </el-space>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { Search, Plus } from "@element-plus/icons-vue";
import { ref, reactive, watch, computed, onMounted } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { addSourcing } from "@/api/sourcing.js";
import { useSourcingFormStore } from "@/stores/counter.js";
import { ElMessage } from "element-plus";
import axios from "axios";
import type { Sourcing } from "@/types/sourcing";
import type { FormInstance, FormRules } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const $t = useI18n().t;

const route = useRoute();
const btnaddflag = () => {
  if (!TradeName.value) {
    ElMessage.error("请输入商品名称");
    return;
  }
  let value = requirementsArr.value.length;
  let label =
    TradeName.value + " " + Brand.value + " " + "数量：" + TradeNum.value;
  for (const item of requirementsArr.value) {
    if (
      item.label.substring(0, item.label.indexOf("数量：")) ===
      label.substring(0, label.indexOf("数量："))
    ) {
      item.label = label;
      visible.value = false;
      return; // 满足条件时提前结束函数执行
    }
  }
  requirementsArr.value = [
    ...requirementsArr.value,
    { value: value, label: label },
  ];
  requirementsChecked.value.push(value);

  visible.value = false;
};
const visible = ref(false);
const TradeName = ref("");
const Brand = ref("");
const TradeNum = ref(1);
const changerooms = () => {
  console.log(sourcingForm);
  sourcingForm.Rooms =
    (sourcingForm.SingleRooms ?? 0) + (sourcingForm.DoubleRooms ?? 0);
  if (sourcingForm.Rooms == 0) sourcingForm.Rooms = 1;
};
const hotelLevelArr = [
  {
    label: "二星(钻)及以下",
    value: 0,
  },
  {
    label: "三星(钻)",
    value: 1,
  },
  {
    label: "四星(钻)",
    value: 2,
  },
  {
    label: "五星(钻)",
    value: 3,
  },
];

const requirementsArr = ref([
  {
    value: 0,
    label: "需要车位",
  },
  {
    value: 1,
    label: "需要早餐",
  },
  {
    value: 2,
    label: "需要车接",
  },
  {
    value: 3,
    label: "需要车送",
  },
  {
    value: 4,
    label: "软枕",
  },
  {
    value: 5,
    label: "硬枕",
  },
  {
    value: 6,
    label: "可泡澡",
  },
]);

const sourcingFormRef = ref<FormInstance>();

const sourcingForm: Sourcing = reactive({
  Destination: "",
  Keyword: "",
  CheckIn: new Date(),
  CheckOut: new Date(),
  Nights: 1,
  Latitude: 1,
  Longitude: 1,
  Rooms: 1,
  Residents: 1,
  Adults: 1,
  Children: 0,
  HotelLevel: "",
  Requirements: "",
  Memo: "",
  ManagerId: 0,
  SingleRooms: 0,
  DoubleRooms: 0,
});

const fullAddress = computed(() => {
  return sourcingForm.Destination + sourcingForm.Keyword;
});

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

const loading = ref(false);
const districtList = ref<AMapApiTip[]>([]);
let oleQuery = "";
const searchDistrict = (query: string) => {
  if (query == oleQuery || query.length < 2) return;
  oleQuery = query;
  loading.value = true;
  let url = "https://restapi.amap.com/v3/assistant/inputtips?";
  axios
    .get(url, {
      params: {
        key: "790547f5b60a65b2b5f1be9475b2b2ce",
        keywords: query,
        //type: "060000|070000|100000|110000|150000|170000",
        datatype: "all",
      },
    })
    .then(function (res: any) {
      console.log(res);
      if (res.data.tips) {
        //res.data.tips.shift()
        districtList.value = res.data.tips;
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  loading.value = false;
  // .finally(() => {
  //     loading.value = false;
  // })
};

const handleDesChange = (val: string) => {
  if (!val) return;
  let tip: any = districtList.value.find((it) => it.id == val);
  if (tip) {
    if (!tip.location || tip.location == "") {
      ElMessage.error("请选择更精确的地址");
      return;
    }
    let location = tip.location.split(",");
    sourcingForm.Longitude = Number(location[0]);
    sourcingForm.Latitude = Number(location[1]);
    sourcingForm.Destination = tip.district;
    sourcingForm.Keyword = tip.name;
    sourcingForm.Province = tip.adcode.substring(0, 2) + "0000";
    sourcingForm.City = tip.adcode.substring(0, 4) + "00";
    sourcingForm.Area = tip.adcode;
  }
};

const rules = reactive<FormRules>({
  Destination: [
    {
      required: true,
      message: "请选择目的地",
      trigger: "change",
    },
  ],
  CheckIn: [
    {
      type: "date",
      required: true,
      message: "请选择日期",
      trigger: "change",
    },
  ],
  CheckOut: [
    {
      type: "date",
      required: true,
      message: "请选择日期",
      trigger: "change",
    },
  ],
});

const formStore = useSourcingFormStore();
onMounted(() => {
  if (formStore.sourcingForm) {
    Object.assign(sourcingForm, formStore.sourcingForm);
  }
  if (formStore.requirements)
    requirementsChecked.value = formStore.requirements;
  if (formStore.requirementsArr && formStore.requirementsArr.length > 0) {
    requirementsArr.value = formStore.requirementsArr;
  }

  if (formStore.hotelLevels) hotelLevelChecked.value = formStore.hotelLevels;
});

watch(sourcingForm, (newForm) => {
  formStore.sourcingForm = newForm;
});

//budget must be a number
watch(
  () => sourcingForm.Budget,
  (newBudget: any, oldBudget: any) => {
    if (isNaN(newBudget)) {
      sourcingForm.Budget = isNaN(oldBudget) ? null : newBudget;
    }
  }
);

//checkin and checkout defaults to today and tomorrow
const dateRange = ref([Date.now(), Date.now() + 1 * 24 * 60 * 60 * 1000]);

//checkin must be greater than or equal today
const disabledDate = (time: { getTime: () => number }) => {
  let date = new Date();
  let millisecond =
    date.getHours() * 60 * 60 * 1000 +
    date.getMinutes() * 60 * 1000 +
    date.getSeconds() * 1000 +
    date.getMilliseconds();
  return time.getTime() < Date.now() - millisecond;
};

const nightCount = computed(() => {
  if (dateRange.value.length < 2) {
    return "";
  }
  sourcingForm.Nights =
    (dateRange.value[1] - dateRange.value[0]) / (1 * 24 * 60 * 60 * 1000);
  return sourcingForm.Nights.toFixed(0) + "晚";
});

const roomsAndResidents = computed(() => {
  if (!sourcingForm.Children) sourcingForm.Children = 0;
  sourcingForm.Residents = sourcingForm.Adults + sourcingForm.Children;
  return sourcingForm.Rooms + "间，" + sourcingForm.Residents + "位";
});

const maxChildren = computed(() => {
  return sourcingForm.Rooms * 3;
});

const maxAdults = computed(() => {
  return sourcingForm.Rooms * 8;
});

const childrenAgeArr: number[] = reactive([]);
watch(
  () => sourcingForm.Children,
  (newChildrenNum, oldChildrenNum) => {
    if (!newChildrenNum || !oldChildrenNum) return;
    if (newChildrenNum > oldChildrenNum) {
      for (let index = 0; index < newChildrenNum - oldChildrenNum; index++) {
        childrenAgeArr.push(0);
      }
    }
    if (newChildrenNum < oldChildrenNum) {
      for (let index = 0; index < oldChildrenNum - newChildrenNum; index++) {
        childrenAgeArr.pop();
      }
    }
  }
);

const requirementsChecked = ref<any[]>([]);
const hotelLevelChecked = ref<any[]>([]);
watch(
  requirementsChecked,
  (newVal) => {
    console.log(newVal);
    formStore.requirements = newVal;
    formStore.requirementsArr = requirementsArr.value;
  },
  { deep: true }
);

watch(hotelLevelChecked, (newVal) => {
  formStore.hotelLevels = newVal;
});

let isSubmitting = false;
const fastSubmit = async (formEl: FormInstance | undefined) => {
  if (isSubmitting) return;
  if (!formEl) return;
  if (dateRange) {
    sourcingForm.CheckIn = new Date(dateRange.value[0]);
    sourcingForm.CheckOut = new Date(dateRange.value[1]);
  }
  if (requirementsChecked) {
    let reqTemp = requirementsArr.value.filter((it) =>
      requirementsChecked.value.includes(it.value)
    );
    sourcingForm.Requirements = JSON.stringify(reqTemp);
    console.log(sourcingForm.Requirements);
  }
  if (hotelLevelChecked) {
    let hotTemp = hotelLevelArr.filter((it) =>
      hotelLevelChecked.value.includes(it.value)
    );
    sourcingForm.HotelLevel = JSON.stringify(hotTemp);
    console.log(sourcingForm.HotelLevel);
  }
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      let ManagerId = route.query.ManagerId || "0";
      sourcingForm.ManagerId = parseInt(ManagerId.toString(), 0);
      isSubmitting = true;
      addSourcing(sourcingForm).then((res: any) => {
        if (res.code === 1) {
          ElMessage({
            message: "成功!",
            type: "success",
          });
          setTimeout(() => {
            location.reload();
          }, 300);
        } else {
          ElMessage.error(res.data.msg);
        }
      });
    } else {
      console.log("error submit!", fields);
    }
    isSubmitting = false;
  });
};
</script>

<style scoped>
@import "@/styles/client/homepage.css";

.white-row {
  background-color: white;
  border-radius: 4px;
}

.col-form-item {
  margin-top: 10px;
}
.morepover :deep(.el-row) {
  padding: 10px;
}
</style>
