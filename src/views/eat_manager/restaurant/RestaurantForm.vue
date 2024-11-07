<template>
  <div class="demoTitle">
    <span v-if="restaurant">新增餐厅</span>
    <span v-else>编辑餐厅</span>
  </div>
  <div class="demo-form demo-block">
    <div class="source">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        status-icon
      >
        <el-form-item label="照片" prop="PictureList">
          <el-upload
            v-model:file-list="imgShowList"
            :action="uploadUrl"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :limit="16"
            :before-upload="beforePicUpload"
            :on-success="handleUploadSuccess"
            :accept="accept"
            :headers="headers"
            :data="data"
            :on-remove="handleRemove"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="名称" prop="Name">
          <el-input
            v-model="form.Name"
            placeholder="请输入项目名称"
            style="width: 50%"
            maxlength="32"
          ></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="Address">
          <el-row style="width: 100%">
            <el-col :span="20">
              <el-select
                v-model="AllAddress"
                filterable
                remote
                reserve-keyword
                :placeholder="$t('addHotelVue.请输入酒店详细地址')"
                :remote-method="searchDistrict"
                :loading="loading"
                @change="handleSearchChange"
                class="iptWidth"
                style="width: 100%"
              >
                <el-option
                  v-for="item in districtList"
                  :key="item.id"
                  :label="item.district + ',' + item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="4" style="text-align: right">
              <el-button type="primary" @click="btnShowMap">修改定位</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="服务简介" prop="Profile">
          <el-input
            :autosize="{ minRows: 4 }"
            type="textarea"
            placeholder="请输入简介"
            v-model="form.Profile"
            maxlength="5000"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitModify(formRef)">
            保存
          </el-button>
          <el-button @click="submitCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    :title="$t('dialog.预览')"
    width="800"
    append-to-body
  >
    <img
      :src="dialogImageUrl"
      style="display: block; max-width: 100%; margin: 0 auto"
    />
  </el-dialog>

  <el-dialog
    v-model="dialogMapVisible"
    :title="dialogMapTitle"
    width="70%"
    top="0"
    destroy-on-close
    center
    append-to-body
  >
    <Map
      :fcenter="form.LongitudeLatitude"
      @change="selectLocation($event)"
    ></Map>
  </el-dialog>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import Map from "@/views/map/AddHotelMap.vue";
import {
  beforePicUpload,
  getHeader,
  getUploadType,
  getUploadUrl,
} from "@/utils/helper";
import type {
  FormInstance,
  FormRules,
  UploadProps,
  UploadUserFile,
} from "element-plus";
import config from "@/utils/config";
import { inputtips } from "@/api/amap";
import router from "@/router";
import { saveBanquet, getBanquetList } from "@/api/restaurant";
import { ElMessage } from "element-plus";

interface Form {
  Id?: number;
  Name?: string;
  PicList?: object[];
  Profile?: string;
  Address: string;
  LongitudeLatitude?: string;
  Districts?: string;
  Province?: string;
  City?: string;
  Area?: string;
}

const formRef = ref<FormInstance>();

const form = reactive<Form>({
  PicList: [],
  Address: "",
});
const checkPictureList = (rule: any, value: any, callback: any) => {
  if (form.PicList == undefined || form.PicList.length <= 0) {
    callback(new Error());
  }
  callback();
};
const rules = reactive<FormRules>({
  PictureList: [
    {
      required: true,
      validator: checkPictureList,
      trigger: "change",
      message: "请上传图片",
    },
  ],

  Name: [
    { required: true, message: "请输入服务名称", trigger: "blur" },
    { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "change" },
  ],
  Address: [
    {
      required: true,
      message: "请输入酒店详细地址",
      trigger: "change",
    },
  ],
  Profile: [
    { required: true, message: "请输入服务简介", trigger: "blur" },
    {
      min: 1,
      max: 5000,
      message: "长度在 1 到 5000 个字符",
      trigger: "change",
    },
  ],
});

const restaurant = reactive({});

const imgShowList = ref<UploadUserFile[]>([]);
const uploadUrl = getUploadUrl();
const accept = getUploadType();
const headers = reactive(getHeader());
const data = reactive({ name: "eat" });
const dialogVisible = ref(false);
const dialogImageUrl = ref("");
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const handleUploadSuccess: UploadProps["onSuccess"] = (res: any, file) => {
  if (res.code == 0) {
    ElMessage.error(res.msg);
    return;
  }
  form.PicList = form.PicList || [];
  form.PicList.push({
    url: res.data,
    isHomePage: 0,
  });
};

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  const url = uploadFile.url!;
  const regex = new RegExp(config.CONFIG_IMGURL, "g");
  const result = url.replace(regex, "");
  if (form.PicList)
    form.PicList = form.PicList.filter((item: any) => item.url !== result);
};

const AllAddress = ref("");
const searchParams = reactive({
  key: "790547f5b60a65b2b5f1be9475b2b2ce",
  keywords: "",
  //type: "060000|070000|100000|110000|150000|170000",
  datatype: "all",
});
const loading = ref(false);
const districtList = ref<any[]>([]);
const searchDistrict = (query: any) => {
  if (query) {
    searchParams.keywords = query;
    inputtips(searchParams).then((res: any) => {
      console.log(res);
      if (res.data.tips) {
        districtList.value = res.data.tips.filter((tip: any) => {
          if (tip.location && tip.location != "") {
            return tip;
          }
        });
      }
    });
  }
};
const handleSearchChange = (val: any) => {
  if (!val) {
    return;
  }
  let tip = districtList.value.find((it: any) => it.id == val) as any;
  if (tip) {
    if (tip.location == "") {
      form.Address = "";
      return;
    }
    form.LongitudeLatitude = tip.location;
    console.log("tiplt", form.LongitudeLatitude);
    form.Address = tip.name;
    form.Districts = tip.district;
    form.Province = tip.adcode.substring(0, 2) + "0000";
    form.City = tip.adcode.substring(0, 4) + "00";
    form.Area = tip.adcode;
  }
};

const dialogMapVisible = ref(false);
const dialogMapTitle = ref("");
const btnShowMap = () => {
  console.log("lt", form.LongitudeLatitude);
  dialogMapVisible.value = true;
  dialogMapTitle.value = "";
};

const selectLocation = (e: any) => {
  dialogMapVisible.value = false;
  form.LongitudeLatitude = e.lnglat.lng + "," + e.lnglat.lat;
};

const submitCancel = () => {
  router.push({ name: "RestaurantList" });
};

const submitting = ref(false);
const submitModify = async (formEl: FormInstance | undefined) => {
  // console.log(form);
  // return;
  if (submitting.value) return;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      submitting.value = true;
      saveBanquet(form)
        .then((res: any) => {
          if (res.code == 1) {
            ElMessage.success("保存成功");
            setTimeout(() => {
              router.push({ name: "RestaurantList" });
            }, 500);
          } else {
            ElMessage.error(res.msg);
          }
        })
        .finally(() => {
          submitting.value = false;
        });
    }
  });
};

onMounted(() => {
  console.log("onMounted");
  const restaurantId = Number(router.currentRoute.value.query.restaurantId);
  console.log("restaurantId", restaurantId);
  if (!restaurantId) {
    return;
  }
  getBanquetList({ banquetId: restaurantId, userId: "" }).then((res: any) => {
    console.log("res", res);
    if (res.code === 1) {
      console.log("data", res.data[0]);
      const restaurant = res.data[0];
      form.Id = restaurant.Id;
      form.Name = restaurant.Name;
      form.Profile = restaurant.Profile;
      form.Address = restaurant.Address;
      form.LongitudeLatitude = restaurant.LongitudeLatitude;
      form.Districts = restaurant.Districts;
      form.Province = restaurant.Province;
      form.City = restaurant.City;
      form.Area = restaurant.Area;
      AllAddress.value = restaurant.Districts + "," + restaurant.Address;
      if (restaurant.PicList.length > 0) {
        restaurant.PicList.forEach((pic: any) => {
          var url = config.CONFIG_IMGURL + pic.Url;
          imgShowList.value.push({
            name: pic.Url,
            url: url,
          });
          form.PicList?.push({
            url: pic.Url,
            isHomePage: pic.IsHomePage,
          });
        });
      }
    }
  });
});
</script>
<style scoped></style>
