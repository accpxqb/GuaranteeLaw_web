<template>
  <el-card
    shadow="never"
    :body-style="{
      backgroundColor: '#F5F5F5',
      padding: '1em 1em 1em 1em',
    }"
    class="no-border"
    v-loading="submitting"
  >
    <el-form
      label-position="top"
      ref="formRef"
      :model="form"
      :rules="rules"
      :hide-required-asterisk="true"
    >
      <div class="form-div">
        <el-form-item prop="checkList">
          <template #label>
            <div style="display: flex; justify-content: space-between">
              <span>服务内容</span>
              <el-button
                size="small"
                ref="buttonRef"
                v-click-outside="onClickOutside"
                type="primary"
              >
                更多服务
              </el-button>
            </div>
          </template>
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="item in recommendedList" :label="item.Id">
              {{ item.ItemName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div class="form-div mt-1" style="padding-top: 0.5em">
        <el-form-item prop="location">
          <el-tabs
            v-model="form.isRestricted"
            class="demo-tabs"
            @tab-click="handleTabClick"
            style="width: 100%"
          >
            <el-tab-pane label="城市" :name="0">
              <el-cascader
                @change="cityChange"
                v-model="selectOptions"
                :options="regionOptions"
                placeholder="请选择服务城市"
                filterable
                style="width: 100%"
              />
            </el-tab-pane>
            <el-tab-pane label="地点" :name="1">
              <LocationSearchSelect @location-change="locationChange">
              </LocationSearchSelect>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </div>
      <div class="form-div mt-1">
        <div style="display: flex; justify-content: space-between">
          <el-form-item label="乐玩预算" prop="budget">
            <el-input placeholder="不限制总预算" v-model.number="form.budget">
              <template #append>
                <span>元</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="乐玩人数"
            style="margin-left: 1em"
            prop="playNum"
          >
            <el-input placeholder="请输入人数" v-model.number="form.playNum">
              <template #append>
                <span>人</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="乐玩时间"
            style="margin-left: 1em"
            prop="beginTime"
          >
            <el-date-picker
              v-model="timeRange"
              type="datetimerange"
              range-separator="—"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
              :editable="false"
              format="YYYY-MM-DD HH:mm"
              :disabled-date="disabledDate"
              @change="timeChange"
            />
          </el-form-item>
        </div>
      </div>
      <div class="form-div mt-1">
        <el-form-item>
          <template #label>
            <div style="display: flex; justify-content: space-between">
              <span>更多需求</span>
              <el-popover
                :visible="popVisible"
                placement="bottom"
                :width="300"
                @show="handlePopShow"
              >
                <el-input
                  v-model="goodName"
                  placeholder="请输入商品名称"
                  minlength="1"
                  maxlength="16"
                  ref="amenityInputRef"
                >
                </el-input>

                <el-input
                  v-model="goodBand"
                  placeholder="请输入商品品牌"
                  minlength="1"
                  maxlength="16"
                  style="margin-top: 1em"
                >
                </el-input>
                <el-input-number
                  v-model="goodCount"
                  placeholder="请输入商品数量"
                  style="width: 200px; margin-top: 1em"
                  :min="1"
                  :max="100"
                ></el-input-number>
                <div style="text-align: right; margin-top: 5px">
                  <el-button size="small" text @click="closePop">
                    取消
                  </el-button>
                  <el-button
                    size="small"
                    type="primary"
                    :disabled="goodName === '' || goodCount === 0"
                    @click="addRequirement"
                  >
                    确定
                  </el-button>
                </div>
                <template #reference>
                  <el-button type="primary" @click="showPop" size="small">
                    添加需求
                  </el-button>
                </template>
              </el-popover>
            </div>
          </template>
          <el-checkbox-group v-model="checkRequirements">
            <el-checkbox v-for="item in requirements" :label="item">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div class="form-div mt-1">
        <el-form-item label="更多想法">
          <el-input
            type="textarea"
            v-model="form.memo"
            maxlength="200"
            show-word-limit
            placeholder="请填写更多想法，例如：是否需要接送、是否需要餐饮、是否需要住宿等"
          ></el-input>
        </el-form-item>
      </div>
      <el-button
        type="primary"
        size="large"
        style="width: 100%; margin-top: 1em"
        @click="submitForm(formRef)"
      >
        快速发布
      </el-button>
    </el-form>
  </el-card>
  <el-popover
    ref="popoverRef"
    :virtual-ref="buttonRef"
    trigger="click"
    virtual-triggering
    placement="bottom-end"
    width="51em"
  >
    <div v-for="parent in itemList">
      <el-text tag="b" size="large" style="margin-top: 1em">
        {{ parent.ItemName }}
      </el-text>
      <el-checkbox-group v-model="checkList" @change="moreItemChange">
        <el-checkbox
          v-for="child in parent.ChildrenList"
          :label="child.Id"
          style="min-width: 8em"
        >
          {{ child.ItemName }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </el-popover>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref, unref } from "vue";
import { getPlayItemsList } from "@/api/playmanageritems";
import {
  type FormInstance,
  type FormRules,
  ClickOutside as vClickOutside,
  type TabsPaneContext,
  ElMessage,
} from "element-plus";
import { provinceAndCityData } from "element-china-area-data";
import LocationSearchSelect from "./LocationSearchSelect.vue";
import { addSourcing } from "@/api/sourcing_play.js";

/**
 * @defineProps
 * @property {number} [managerId] 定向发单时传入的经理人id
 */
const props = defineProps<{
  managerId?: number;
}>();

interface PlayItem {
  Id: number;
  ItemName: string;
  IsHomePage: boolean;
  ChildrenList: PlayItem[];
}

interface PlaySourcing {
  items: { itemName: string; itemId: number; sourcingId: string }[];
  playCity?: string;
  playCode?: string;
  budget: number | undefined;
  requirements?: string;
  memo?: string;
  playNum: number;
  beginTime: Date | null;
  endTime: Date | null;
  province?: string;
  city?: string;
  area?: string;
  destination?: string;
  keyword?: string;
  latitude?: number;
  longitude?: number;
  isRestricted: number;
  sourcingId: string;
  managerId?: number;
}

const formRef = ref<FormInstance>();
const form: PlaySourcing = reactive({
  items: [],
  playCity: "",
  playCode: "",
  budget: undefined,
  requirements: "",
  memo: "",
  playNum: 1,
  //beginTime: new Date(),
  //endTime: new Date(Date.now() + 60 * 60 * 1000),
  beginTime: null,
  endTime: null,
  province: "",
  city: "",
  area: "",
  destination: "",
  keyword: "",
  latitude: 0,
  longitude: 0,
  isRestricted: 0,
  sourcingId: "0",
});

const validateChickList = (rule: any, value: any, callback: any) => {
  if (checkList.value.length === 0) {
    callback(new Error("请选择服务内容"));
  } else {
    callback();
  }
};

const validateLocation = (rule: any, value: any, callback: any) => {
  if (form.isRestricted === 0 && !form.playCity) {
    callback(new Error("请选择服务城市"));
  } else if (form.isRestricted === 1 && !form.keyword) {
    callback(new Error("请选择服务地点"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  checkList: [
    {
      validator: validateChickList,
      trigger: "change",
    },
  ],
  location: [
    {
      validator: validateLocation,
      trigger: "change",
    },
  ],
  budget: [
    {
      type: "number",
      min: 1,
      max: 1000000,
      message: "请输入1-1000000范围内的数字",
      trigger: "blur",
    },
  ],
  playNum: [
    {
      required: true,
      message: "请输入乐玩人数",
      trigger: "change",
    },
    {
      type: "number",
      min: 1,
      max: 1000,
      message: "请输入1-1000范围内的数字",
      trigger: "change",
    },
  ],
  beginTime: [
    {
      required: true,
      message: "请选择乐玩时间",
      trigger: "change",
    },
  ],
});

//服务内容选中列表
const checkList = ref<number[]>([]);
//首页展示列表
const recommendedList = ref<PlayItem[]>([]);
//全部服务内容列表
const itemList = ref<PlayItem[]>([]);
//全部服务内容的子列表
const childrenList = ref<PlayItem[]>([]);
onMounted(() => {
  getPlayItemsList().then((res) => {
    itemList.value = res.data;
    res.data.forEach((item: PlayItem) => {
      childrenList.value = childrenList.value.concat(item.ChildrenList);
    });
    recommendedList.value = childrenList.value.filter(
      (item: PlayItem) => item.IsHomePage
    );
  });
});

//更多服务弹窗
const buttonRef = ref();
const popoverRef = ref();
const onClickOutside = () => {
  unref(popoverRef).popperRef?.delayHide?.();
};

//更多服务选中
const moreItemChange = (value: any[] | number[]) => {
  if (value.length === 0) return;
  const list = value as number[];
  const last = list[list.length - 1];
  if (!recommendedList.value.find((item) => item.Id === last)) {
    recommendedList.value.push(
      childrenList.value.find((item) => item.Id === last) as PlayItem
    );
  }
};

//城市地点切换
const activeName = ref(0);
const handleTabClick = (tab: TabsPaneContext, event: Event) => {};

//城市选择
const regionOptions = provinceAndCityData;
const selectOptions = ref([]);
const cityChange = (val: any) => {
  if (val.length === 2) {
    const p = regionOptions.find(
      (item: { label: string; value: string; children: [] }) =>
        item.value === val[0]
    );

    const c = p?.children.find(
      (item: { value: string; label: string }) => item.value === val[1]
    );
    if (c) {
      form.playCity = ["北京市", "上海市", "天津市", "重庆市"].includes(p.label)
        ? p.label
        : p.label + c.label;
      form.playCode = c.value;
    }
    console.log(form.playCity);
  }
};

//地点搜索
const locationChange = (tip: any) => {
  const location = tip.location.split(",");
  form.longitude = Number(location[0]);
  form.latitude = Number(location[1]);
  form.destination = tip.district;
  form.keyword = tip.name;
  form.province = tip.adcode.substring(0, 2) + "0000";
  form.city = tip.adcode.substring(0, 4) + "00";
  form.area = tip.adcode;
  console.log(form);
};

//乐玩时间范围
const timeRange = ref([form.beginTime, form.endTime]); //<[Date, Date]>

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

//时间选择
const timeChange = (val: any) => {
  console.log(val);
  const timeZone = new Date().getTimezoneOffset() / 60;
  form.beginTime = new Date(val[0].getTime() - timeZone * 60 * 60 * 1000);
  form.endTime = new Date(val[1] - timeZone * 60 * 60 * 1000);
};

//更多需求
const requirements = ref<{ label: string; value: number }[]>([
  {
    label: "需要车位",
    value: 0,
  },
  { label: "需要车接", value: 1 },
  {
    label: "需要车送",
    value: 2,
  },
]);
const checkRequirements = ref<{ label: string; value: number }[]>([]);
const requirement = ref({
  label: "",
  value: 0,
});

const goodBand = ref("");
const goodName = ref("");
const goodCount = ref(1);

const popVisible = ref(false);
const showPop = () => {
  popVisible.value = true;
};

const closePop = () => {
  goodBand.value = "";
  goodName.value = "";
  goodCount.value = 0;
  popVisible.value = false;
};

const handlePopShow = () => {};
const addRequirement = () => {
  const label =
    goodBand.value + " " + goodName.value + " " + `数量：${goodCount.value}`;
  requirements.value.push({
    label: label,
    value: requirements.value.length,
  });
  checkRequirements.value.push({
    label: label,
    value: requirements.value.length - 1,
  });
  console.log("requirements", requirements.value);
  console.log("checkRequirements", checkRequirements.value);

  closePop();
};

//提交
const submitting = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (submitting.value) return;
  if (!formEl) return;
  childrenList.value.forEach((element) => {
    if (checkList.value.includes(element.Id)) {
      form.items.push({
        itemName: element.ItemName,
        itemId: element.Id,
        sourcingId: form.sourcingId,
      });
    }
  });
  if (props.managerId) form.managerId = props.managerId;
  form.requirements = JSON.stringify(checkRequirements.value);
  await formEl.validate((valid, fields) => {
    if (valid) {
      submitting.value = true;
      addSourcing(form)
        .then((res: any) => {
          if (res.code === 1) {
            ElMessage({
              message: "发布成功",
              type: "success",
            });
            formEl.resetFields();
            checkList.value = [];
            form.items = [];
            form.beginTime = null;
            form.endTime = null;
            form.isRestricted = 0;
            form.playCity = "";
            form.playCode = "";
            form.budget = undefined;
            form.requirements = "";
            form.memo = "";
            form.playNum = 1;
            form.province = "";
            form.city = "";
            form.area = "";
            form.destination = "";
            form.keyword = "";
            form.latitude = 0;
            form.longitude = 0;
            timeRange.value = [form.beginTime, form.endTime];
            checkRequirements.value = [];
            selectOptions.value = [];
          } else {
            ElMessage({
              message: res.msg,
              type: "error",
            });
          }
        })
        .finally(() => {
          submitting.value = false;
        });
    } else {
      console.log("error submit!", fields);
    }
  });
};
</script>
<style scoped>
.no-border {
  border: none;
}

:deep(.el-form-item) {
  margin-bottom: 0 !important;
}

.form-div {
  padding: 1em;
  background-color: white;
  border-radius: 4px;
}

.mt-1 {
  margin-top: 1em;
}
</style>
