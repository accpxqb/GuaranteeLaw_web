<template>
  <el-card class="homepage-card" shadow="never" body-style="padding: 1em ;">
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
        :size="16"
        :fill="true"
      >
        <el-row class="white-row" style="padding: 1em">
          <el-col :span="12" style="padding-right: 0.5em">
            <el-form-item
              :label="$t('homepageHotelFormVue.Destination')"
              prop="Destination"
            >
              <el-select
                v-model="fullAddress"
                filterable
                remote
                reserve-keyword
                :placeholder="$t('homepageHotelFormVue.Destination')"
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
            </el-form-item>
          </el-col>
          <el-col :span="12" style="padding-left: 0.5em">
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

        <el-row>
          <el-col :span="18">
            <el-row class="white-row" style="padding: 1em">
              <el-col :span="8" style="padding-right: 0.5em">
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
                            :max="10"
                          />
                        </el-col>
                      </el-row>
                      <el-row justify="space-between" style="width: 240px">
                        <el-col :span="12">
                          <label>
                            {{ $t("homepageHotelFormVue.Adults") }}
                            <span class="description-span"> 18岁及以上</span>
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
                        <span>
                          儿童年龄
                          <span class="description-span"> 以入住当天计算</span>
                        </span>
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
              <el-col
                :span="8"
                style="padding-left: 0.5em; padding-right: 0.5em"
              >
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
              <el-col :span="8" style="padding-left: 0.5em">
                <el-form-item
                  :label="$t('homepageHotelFormVue.Budget')"
                  class="col-form-item"
                >
                  <el-input
                    v-model.number="sourcingForm.Budget"
                    :placeholder="$t('homepageHotelFormVue.Budget')"
                    maxlength="8"
                  >
                    <template #suffix>
                      <span>元/晚</span>
                    </template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="6" style="padding-left: 1em">
            <el-row>
              <el-button
                size="large"
                type="success"
                style="width: 100%; height: 48px"
                @click="fastSubmit(sourcingFormRef)"
              >
                快速发布
              </el-button>
            </el-row>
            <el-row style="margin-top: 12px">
              <el-button
                type="danger"
                @click="btnmore"
                size="large"
                style="width: 100%; height: 48px"
              >
                更多需求
              </el-button>
            </el-row>
          </el-col>
        </el-row>

        <el-row class="white-row" style="padding: 1em">
          <el-col :span="24">
            <el-checkbox-group v-model="requirementsChecked">
              <el-checkbox
                v-for="item in requirementsArr"
                :label="item.value"
                :key="item.value"
              >
                <label style="font-size: 12px">{{ item.label }}</label>
              </el-checkbox>
            </el-checkbox-group>
          </el-col>

          <el-col :span="24" style="margin-top: 5px">
            <el-input
              :rows="3"
              resize="none"
              type="textarea"
              v-model="sourcingForm.Memo"
              placeholder="留言"
              maxlength="200"
              style="width: 100%"
            />
          </el-col>
        </el-row>
      </el-space>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { addSourcing } from "@/api/sourcing.js";
import { useSourcingFormStore } from "@/stores/counter.js";
import { ElMessage } from "element-plus";
import axios from "axios";
import type { Sourcing } from "@/types/sourcing";
import type { FormInstance, FormRules } from "element-plus";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import cities from "@/utils/cities.json";

const $t = useI18n().t;

const props = defineProps({
  ManagerId: {
    type: Number,
    default: 0,
  },
});
const router = useRouter();
const btnmore = () => {
  let url = "/moreneeds";
  if (props.ManagerId) {
    url += "?ManagerId=" + props.ManagerId;
  }
  //window.open(url)
  window.location.href = url;
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

const requirementsArr = [
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
];

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

const requirementsChecked = ref<any[]>([]);
const hotelLevelChecked = ref<any[]>([]);

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

import _ from "lodash";

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
  let cityQuery = query.substring(0, 2);
  //判断cities中是否有该城市
  let city = cities.some((it) => it.name == cityQuery + "市") ? cityQuery : "";
  console.log(city);
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
        //res.data.tips.shift()
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
      message: "请选择入住时间",
      trigger: "change",
    },
  ],
  CheckOut: [
    {
      type: "date",
      required: true,
      message: "请选择离店时间",
      trigger: "change",
    },
  ],
});

const formStore = useSourcingFormStore();
onMounted(() => {
  if (formStore.sourcingForm)
    Object.assign(sourcingForm, formStore.sourcingForm);
  if (formStore.requirements)
    requirementsChecked.value = formStore.requirements;
  if (formStore.hotelLevels) hotelLevelChecked.value = formStore.hotelLevels;
});

watch(requirementsChecked, (newVal) => {
  console.log(newVal);
  formStore.requirements = newVal;
});

watch(hotelLevelChecked, (newVal) => {
  formStore.hotelLevels = newVal;
});

watch(sourcingForm, (newForm) => {
  console.log(newForm);
  formStore.sourcingForm = newForm;
});

//budget must be a number
watch(
  () => sourcingForm.Budget,
  (newBudget: any) => {
    if (isNaN(newBudget)) sourcingForm.Budget = undefined;
    else sourcingForm.Budget = newBudget;
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

let isSubmitting = false;
const fastSubmit = async (formEl: FormInstance | undefined) => {
  if (isSubmitting) return;
  if (!formEl) return;
  if (dateRange) {
    sourcingForm.CheckIn = new Date(dateRange.value[0]);
    sourcingForm.CheckOut = new Date(dateRange.value[1]);
  }
  if (requirementsChecked) {
    let reqTemp = requirementsArr.filter((it) =>
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
  //获取当前时区
  const timeZone = new Date().getTimezoneOffset() / 60;
  sourcingForm.CheckIn = new Date(
    sourcingForm.CheckIn.getTime() - timeZone * 60 * 60 * 1000
  );
  sourcingForm.CheckOut = new Date(
    sourcingForm.CheckOut.getTime() - timeZone * 60 * 60 * 1000
  );
  //预算不能是null
  // if (!sourcingForm.Budget) sourcingForm.Budget = 0;
  await formEl.validate((valid: any, fields: any) => {
    if (valid) {
      sourcingForm.ManagerId = props.ManagerId;
      isSubmitting = true;
      addSourcing(sourcingForm).then((res: any) => {
        // if (sourcingForm.Budget == 0) sourcingForm.Budget = undefined;
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
  margin-top: 0px;
}
:deep(.el-form-item) {
  margin-bottom: 0 !important;
}
</style>
