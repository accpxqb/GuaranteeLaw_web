<template>
  <el-card shadow="never">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      status-icon
      label-position="top"
    >
      <el-form-item label="套餐名称" prop="PackageName">
        <el-input
          v-model="form.PackageName"
          placeholder="请输入项目名称"
          style="width: 50%"
          maxlength="32"
        ></el-input>
      </el-form-item>
      <el-form-item prop="PackagePicList">
        <template #label>
          <span>项目照片</span>
          <span style="font-size: smaller">（最多上传16张）</span>
        </template>
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
      <el-form-item label="项目明细">
        <el-card style="width: 100%" shadow="never">
          <template #header>
            <el-row>
              <el-col :span="20">
                <el-row style="width: 100%" :gutter="16">
                  <el-col :span="12" class="header-text">
                    <span>项目名称</span>
                  </el-col>
                  <el-col :span="6" class="header-text">
                    <span>数量 / 单位</span>
                  </el-col>
                  <el-col :span="6" class="header-text">
                    <span>项目总价</span>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
          <template v-for="(item, index) in form.PackageDetails" :key="index">
            <el-row align="middle">
              <el-col :span="20">
                <el-row style="width: 100%" :gutter="16">
                  <el-col :span="12">
                    <el-form-item
                      :prop="'PackageDetails.' + index + '.Name'"
                      :rules="{
                        required: true,
                        message: '请填写项目名称',
                        trigger: 'blur',
                      }"
                    >
                      <el-input
                        placeholder="例: 水煮鱼"
                        v-model="item.Name"
                        maxlength="16"
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      :prop="'PackageDetails.' + index + '.Number'"
                      :rules="{
                        required: true,
                        message: '请填写数量/单位',
                        trigger: 'blur',
                      }"
                    >
                      <el-input
                        placeholder="例: 1kg"
                        v-model="item.Number"
                        maxlength="8"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      :prop="'PackageDetails.' + index + '.Price'"
                      :rules="[
                        {
                          required: true,
                          message: '请填写项目价格',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <!-- <el-input placeholder="请输入价格" v-model="item.Price"> -->
                      <el-input-number
                        v-model="item.Price"
                        :min="0"
                        :max="999999"
                        controls-position="right"
                        :controls="false"
                        style="width: 100%"
                        :precision="2"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="width: 100%; margin-top: 1em" :gutter="16">
                  <el-col :span="24">
                    <el-form-item :prop="'PackageDetails.' + index + '.notes'">
                      <el-input
                        v-model="item.Notes"
                        type="textarea"
                        placeholder="详细备注，例: 黑鱼"
                        maxlength="200"
                        show-word-limit
                      >
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="4" style="display: flex; justify-content: center">
                <el-button
                  plain
                  circle
                  size="large"
                  type="info"
                  @click="removeDetail(index)"
                  :disabled="form.PackageDetails.length <= 1"
                >
                  <el-icon size="20"><Delete /></el-icon>
                </el-button>
              </el-col>
            </el-row>
            <el-divider style="margin-top: 1em; margin-bottom: 1em" />
          </template>
          <div
            style="
              margin-top: 20px;
              display: flex;
              justify-content: space-between;
            "
          >
            <el-button type="primary" @click="addDetail">新增项目</el-button>
            <span>总计：{{ TotalPrice }}元</span>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="服务标签" prop="amenities">
        <el-card
          :body-style="{
            paddingTop: '0px',
            paddingBottom: '0px',
            paddingLeft: '1em',
            paddingRight: '1em',
          }"
          v-for="(item, index) in form.PackageAmenitys"
          :key="index"
          style="margin-right: 1em; margin-bottom: 1em"
          shadow="never"
        >
          <span>{{ item }}</span>
          <el-button
            type="info"
            circle
            plain
            size="small"
            style="margin-left: 1em; border: none"
            @click="removeAmenity(index)"
          >
            <el-icon> <Close /> </el-icon>
          </el-button>
        </el-card>
        <el-popover
          :visible="popVisible"
          placement="top"
          :width="200"
          @show="handlePopShow"
        >
          <el-input
            v-model="amenityTemp"
            placeholder="请输入标签内容"
            minlength="1"
            @keyup.enter="addAmenity"
            ref="amenityInputRef"
          >
          </el-input>
          <div style="text-align: right; margin-top: 5px">
            <el-button size="small" text @click="closePop"> 取消 </el-button>
            <el-button
              size="small"
              type="primary"
              @click="addAmenity"
              :disabled="amenityTemp.length < 1"
            >
              确定
            </el-button>
          </div>
          <template #reference>
            <el-button
              type="primary"
              @click="showPop"
              style="margin-bottom: 1em"
            >
              新增标签
            </el-button>
          </template>
        </el-popover>
      </el-form-item>
      <el-form-item label="订购须知" prop="PackageIntroduction">
        <el-input
          :autosize="{ minRows: 4 }"
          type="textarea"
          placeholder="请输入简介"
          v-model="form.PackageIntroduction"
          maxlength="5000"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="back"> 取消 </el-button>
        <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-dialog v-model="dialogVisible">
    <el-image width="100%" :src="dialogImageUrl" />
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import {
  ElMessage,
  type FormInstance,
  type UploadProps,
  type UploadUserFile,
} from "element-plus";
import {
  beforePicUpload,
  getHeader,
  getUploadType,
  getUploadUrl,
} from "@/utils/helper";
import { savePackage, getPackageList } from "@/api/restaurant";
import { useRouter } from "vue-router";
import config from "@/utils/config";

const formRef = ref<FormInstance>();

const form = reactive({
  Id: 0,
  BanquetId: 0,
  PackageName: "",
  PackagePicList: <string[]>[],
  PackageDetails: [
    {
      Name: "",
      Number: "",
      Price: undefined,
      Notes: "",
    },
  ],
  PackageIntroduction: "",
  PackageAmenitys: <any[]>[],
  TotalPrice: 0,
  TotalPriceN: 0,
  Number: 0,
  PackageId: 0,
});
const packageUrlList = ref<any[]>([]);

const validateAmenities = (rule: any, value: any, callback: any) => {
  if (form.PackageAmenitys.length === 0) {
    callback(new Error("请填写服务标签"));
  } else {
    callback();
  }
};

const validateDetail = (rule: any, value: any, callback: any) => {
  if (form.PackageDetails.length === 0) {
    callback(new Error("请填写服务项目"));
  } else {
    callback();
  }
};

const rules = {
  PackageName: [
    { required: true, message: "请输入服务名称", trigger: "blur" },
    { min: 1, max: 32, message: "长度在 1 到 32 个字符", trigger: "change" },
  ],
  PackageIntroduction: [
    { required: true, message: "请输入订购须知", trigger: "blur" },
    {
      min: 1,
      max: 5000,
      message: "长度在 1 到 5000 个字符",
      trigger: "change",
    },
  ],
  amenities: [
    { required: true, validator: validateAmenities, trigger: "change" },
  ],
  detail: [{ validator: validateDetail, trigger: "blur" }],
  PackagePicList: [
    { required: true, message: "请上传项目图片", trigger: "blur" },
  ],
};

const TotalPrice = computed<number>(() => {
  return form.PackageDetails.reduce((acc, cur) => {
    const accInt = Math.round(acc * 100);
    const curInt = Math.round((cur.Price || 0) * 100);
    return (accInt + curInt) / 100;
  }, 0);
});

const imgShowList = ref<UploadUserFile[]>([]);
const uploadUrl = getUploadUrl();
const accept = getUploadType();
const headers = reactive(getHeader());
const data = reactive({ name: "restaurant_package" });
const dialogVisible = ref(false);
const dialogImageUrl = ref("");

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
const handleUploadSuccess: UploadProps["onSuccess"] = (res, file) => {
  console.log("res", res.data);
  if (res.code == 0) {
    ElMessage.error(res.msg);
    return;
  }
  form.PackagePicList.push(res.data);
};

const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  const url = uploadFile.url!;
  const regex = new RegExp(config.CONFIG_IMGURL, "g");
  const result = url.replace(regex, "");
  form.PackagePicList = form.PackagePicList.filter((item) => item !== result);
};

/**
 * 添加明细
 */
const addDetail = () => {
  if (form.PackageDetails.length >= 8) {
    ElMessage.warning("最多添加8个项目");
    return;
  }
  form.PackageDetails.push({
    Name: "",
    Number: "",
    Price: undefined,
    Notes: "",
  });
};

/**
 * 删除明细
 * @param index
 */
const removeDetail = (index: number) => {
  form.PackageDetails.splice(index, 1);
};

const popVisible = ref(false);
const amenityTemp = ref("");
const amenityInputRef = ref<HTMLInputElement | null>(null);

const showPop = () => {
  if (form.PackageAmenitys.length >= 16) {
    ElMessage.warning("最多添加16个标签");
    return;
  }
  popVisible.value = true;
};

const handlePopShow = () => {
  nextTick(() => {
    amenityInputRef.value!.focus();
  });
};

/**
 * 添加标签
 */
const addAmenity = () => {
  if (amenityTemp.value.length === 0 || amenityTemp.value.length >= 16) return;
  if (form.PackageAmenitys.includes(amenityTemp.value)) {
    ElMessage.warning("标签已存在");
    return;
  }
  form.PackageAmenitys.push(amenityTemp.value);
  closePop();
};

/**
 * 删除标签
 * @param index
 */
const removeAmenity = (index: number) => {
  form.PackageAmenitys.splice(index, 1);
};

const closePop = () => {
  amenityTemp.value = "";
  popVisible.value = false;
};

const props = defineProps({
  package: {
    type: Object,
  },
  packageId: {
    type: Number,
  },
  saveForm: {
    type: Function,
  },
  backFunc: {
    type: Function,
  },
});

/**
 * 获取服务详情
 */
const restaurantId = ref();
const router = useRouter();
onMounted(() => {
  restaurantId.value = router.currentRoute.value.query.restaurantId;
  const Id = router.currentRoute.value.query.packageId;
  if (Id) {
    getPackageList({ packageId: Id }).then((res: any) => {
      if (res.code == 1) {
        const p = res.data[0];
        console.log("p", p);
        form.Id = Number(Id);
        form.BanquetId = p.BanquetId;
        form.PackageName = p.PackageName;
        form.PackageIntroduction = p.PackageIntroduction;
        form.PackageAmenitys = p.PackageAmenitys.split(",");
        form.PackagePicList = p.PackagePicList.map((pic: any) => pic.Url);
        form.PackageDetails = JSON.parse(p.PackageDetails);
        p.PackagePicList.forEach((pic: any) => {
          imgShowList.value.push({
            url: config.CONFIG_IMGURL + pic.Url,
            name: pic.Url.split("/").pop()!,
          });
        });
      } else {
        ElMessage.error(res.msg);
        router.push({ name: "PlayServices" });
      }
    });
  } else if (props.package) {
    form.Id = props.package.Id;
    form.BanquetId = props.package.BanquetId;
    form.PackageName = props.package.PackageName;
    form.PackageIntroduction = props.package.PackageIntroduction;
    form.PackageAmenitys = props.package.PackageAmenitys;
    console.log("props.package.PackagePicList", props.package.PackagePicList);
    form.PackagePicList = props.package.PackagePicList;
    form.PackageDetails = props.package.PackageDetails;
    form.Number = props.package.Number;
    form.PackageId = props.package.PackageId;
    props.package.PackagePicList.forEach((url: string) => {
      imgShowList.value.push({
        url: config.CONFIG_IMGURL + url,
        name: url.split("/").pop()!,
      });
    });
  }
});
/**
 * 提交表单
 */
const submitting = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (submitting.value) return;
  console.log("pl", form.PackagePicList);
  await formEl.validate((valid, fields) => {
    if (valid) {
      form.TotalPrice = TotalPrice.value;
      form.TotalPriceN = TotalPrice.value * form.Number;
      form.BanquetId = restaurantId.value ?? form.BanquetId;
      submitting.value = true;
      if (props.saveForm) {
        props.saveForm(form);
      } else {
        savePackage(form)
          .then((res: any) => {
            if (res.code == 1) {
              ElMessage.success("添加成功");
              router.push({ name: "RestaurantList" });
            } else {
              ElMessage.error(res.msg);
            }
          })
          .finally(() => {
            submitting.value = false;
          });
      }
    } else {
      return false;
    }
  });
};

const back = () => {
  if (props.backFunc) {
    props.backFunc();
  } else {
    router.push({ name: "EatServices" });
  }
};
</script>
<style scoped>
.header-text {
  font-size: medium;
  font-weight: bold;
  text-align: center;
}
:deep(.el-card__header) {
  padding-top: 0;
  padding-bottom: 0;
}
:deep(.el-card__body) {
  padding-top: 1em;
}
:deep(.el-upload-list__item) {
  width: 110px;
  height: 110px;
}
:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
}
</style>
