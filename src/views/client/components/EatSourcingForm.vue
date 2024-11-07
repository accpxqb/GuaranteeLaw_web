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
        <div style="display: flex; justify-content: space-between">
          <el-form-item label="目的地" style="width: 100%">
            <LocationSearchSelect @location-change="locationChange">
            </LocationSearchSelect>
          </el-form-item>

          <el-form-item
            label="开始时间"
            prop="beginTime"
            style="width: 100%; margin-left: 1em"
          >
            <el-date-picker
              v-model="form.beginTime"
              type="datetime"
              placeholder="选择日期时间"
              format="YYYY/MM/DD HH:mm"
              :editable="false"
              :disabled-date="disabledDate"
              style="width: 100%"
            />
          </el-form-item>
        </div>
      </div>
      <div class="form-div mt-1">
        <div style="display: flex; justify-content: space-between">
          <el-form-item label="预算" prop="budget">
            <el-input placeholder="不限制总预算" v-model.number="form.budget">
              <template #append>
                <span>元</span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="预定桌数" prop="numberTables">
            <el-input
              placeholder="请输入桌数"
              v-model.number="form.numberTables"
            >
              <template #append>
                <span>桌</span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="总人数" prop="numberPeople">
            <el-input
              placeholder="请输入人数"
              v-model.number="form.numberPeople"
            >
              <template #append>
                <span>人</span>
              </template>
            </el-input>
          </el-form-item>
        </div>
      </div>
      <div class="form-div mt-1">
        <el-form-item>
          <el-checkbox-group v-model="checkRequirements">
            <el-checkbox v-for="item in requirements.slice(0, 3)" :label="item">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
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
            <el-checkbox
              v-for="item in requirements.slice(3, requirements.length)"
              :label="item"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div class="form-div mt-1">
        <el-form-item prop="memo">
          <el-input
            v-model="form.memo"
            :rows="2"
            type="textarea"
            placeholder="更多需求请备注"
          />
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
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import LocationSearchSelect from "./LocationSearchSelect.vue";
import { addSourcing } from "@/api/sourcing_eat";

/**
 * @defineProps
 * @property {number} [managerId] 定向发单时传入的经理人id
 */
const props = defineProps<{
  managerId?: number;
}>();

interface Form {
  beginTime: Date;
  endTime?: Date;
  numberTables?: number;
  numberPeople?: number;
  budget?: number;
  requirements?: string;
  province?: string;
  city?: string;
  area?: string;
  destination?: string;
  keyword?: string;
  latitude?: number;
  longitude?: number;
  memo?: string;
  sourcingId: string;
  managerId?: number;
}
const form = reactive<Form>({
  beginTime: new Date(),
  sourcingId: "",
  memo: "",
});

const rules = reactive<FormRules>({
  location: [
    {
      trigger: "change",
      message: "请选择服务地址",
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
  numberTables: [
    {
      required: true,
      message: "请输入桌数",
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
  numberPeople: [
    {
      required: true,
      message: "请输入总人数",
      trigger: "change",
    },
    {
      type: "number",
      min: 1,
      max: 10000,
      message: "请输入1-10000范围内的数字",
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

const formRef = ref<FormInstance>();

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

const requirements = ref<{ label: string; value: number }[]>([
  {
    label: "生日宴",
    value: 0,
  },
  { label: "朋友聚会", value: 1 },
  {
    label: "团建聚餐",
    value: 2,
  },
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
  closePop();
};

const submitting = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (submitting.value) return;
  if (!formEl) return;
  if ((form.destination ??= "") == "" || (form.keyword ??= "") == "") {
    ElMessage({
      message: "请选择服务地址",
      type: "error",
    });
    return;
  }
  if (props.managerId) form.managerId = props.managerId;
  form.requirements = JSON.stringify(checkRequirements.value);
  const timeZone = new Date().getTimezoneOffset() / 60;
  form.beginTime = new Date(
    form.beginTime.getTime() - timeZone * 60 * 60 * 1000
  );
  // console.log("form", form);
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
            checkRequirements.value = [];
            form.budget = undefined;
            form.requirements = "";
            form.memo = "";
            form.province = "";
            form.city = "";
            form.area = "";
            form.destination = "";
            form.keyword = "";
            form.latitude = 0;
            form.longitude = 0;
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
