<template>
  <div
    v-if="form.managerType > 0 && form.managerType < 4"
    v-loading.fullscreen.lock="loading"
    element-loading-text="信息加载中..."
  >
    <div
      style="display: flex; justify-content: center"
      v-if="reviewMsg && reviewMsg.length > 0"
    >
      <el-alert
        title="您的申请未能通过审核"
        type="error"
        :description="`原因：${reviewMsg}`"
        show-icon
        style="width: 500px; margin-top: 25px"
      />
    </div>
    <div style="display: flex; justify-content: center">
      <el-card
        style="width: 500px; margin-top: 25px; margin-bottom: 75px"
        v-loading="submitting"
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="110px"
          class="demo-ruleForm"
          status-icon
        >
          <el-form-item label="头像" prop="avatarUrl">
            <el-upload
              class="uploader avatar"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeUpload"
              :accept="accept"
              :headers="headers"
              :data="{ name: 'user', isCompress: true }"
            >
              <img
                v-if="form.avatarUrl"
                :src="config.CONFIG_IMGURL + form.avatarUrl"
                class="avatar"
              />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="姓名" prop="fullName">
            <el-input
              v-model="form.fullName"
              placeholder="请输入姓名"
              minlength="2"
              maxlength="8"
              style="width: 200px"
            ></el-input>
          </el-form-item>

          <el-form-item label="服务城市" prop="cityCode">
            <el-cascader
              @change="cityChange"
              v-model="selectOptions"
              :options="regionOptions"
              placeholder="请选择服务城市"
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="身份证号" prop="idNo">
            <el-input
              v-model="form.idNo"
              placeholder="请输入身份证号"
              minlength="18"
              maxlength="18"
              style="width: 200px"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证人像面" prop="portraitUrl">
            <el-upload
              class="uploader idCard"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handlePortraitSuccess"
              :before-upload="beforeUpload"
              :accept="accept"
              :headers="headers"
              :data="{ name: 'user' }"
            >
              <img
                v-if="form.portraitUrl"
                :src="config.CONFIG_IMGURL + form.portraitUrl"
                class="idCard"
              />
              <el-icon v-else class="id-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="身份证国徽面" prop="emblemUrl">
            <el-upload
              class="uploader idCard"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleEmblemSuccess"
              :before-upload="beforeUpload"
              :accept="accept"
              :headers="headers"
              :data="{ name: 'user' }"
            >
              <img
                v-if="form.emblemUrl"
                :src="config.CONFIG_IMGURL + form.emblemUrl"
                class="idCard"
              />
              <el-icon v-else class="id-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(formRef)">
              提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
  <el-empty description="未能获取到业务类型，请重试" v-else />
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { provinceAndCityData } from "element-china-area-data";
import { Plus } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type FormRules,
  type UploadProps,
} from "element-plus";
import config from "@/utils/config";
import { applyManager, getApplyManager } from "@/api/manager";
import { getRealNameAuthResult } from "@/api/user";
import { useUserDataStore } from "@/stores/counter";
import { uploadUrl } from "@/utils/uploadHelper";
const userStore = useUserDataStore();
const router = useRouter();

const accept = ref(".jpg,.png,.jpeg");
//const uploadUrl = ref(config.CONFIG_API + "ManagerCheckIn/uploadPic");
const headers = reactive({
  Authorization: "Bearer " + localStorage.getItem("token"),
});

interface ManagerForm {
  fullName?: string;
  cityCode?: string;
  idNo?: string;
  avatarUrl?: string;
  portraitUrl?: string;
  emblemUrl?: string;
  managerType: number;
}
const form = reactive<ManagerForm>({
  managerType: 0,
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
  fullName: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    {
      min: 2,
      max: 8,
      message: "长度在 2 到 8 个字符",
      trigger: "blur",
    },
  ],
  cityCode: [{ required: true, message: "请选择服务城市", trigger: "change" }],
  idNo: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: "请输入正确的身份证号",
      trigger: "blur",
    },
  ],
  avatarUrl: [{ required: true, message: "请上传头像", trigger: "change" }],
  portraitUrl: [
    { required: true, message: "请上传身份证人像面", trigger: "change" },
  ],
  emblemUrl: [
    { required: true, message: "请上传身份证国徽面", trigger: "change" },
  ],
});

let submitting = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      submitting.value = true;
      applyManager({
        cityCode: form.cityCode,
        fullName: form.fullName,
        card: form.idNo,
        frontImg: form.portraitUrl,
        backImg: form.emblemUrl,
        headerImg: form.avatarUrl,
        managerType: form.managerType,
      })
        .then((res: any) => {
          if (res.code === 1) {
            ElMessage({
              showClose: true,
              message: "提交成功,请等待审核",
              type: "success",
              center: true,
            });
            localStorage.setItem("reviewing", "1");
          } else {
            ElMessage({
              showClose: true,
              message: res.msg,
              type: "error",
              center: true,
            });
          }
        })
        .finally(() => {
          setTimeout(() => {
            submitting.value = false;
            router.push("/");
          }, 600);
        });
    } else {
      ElMessage({
        showClose: true,
        message: "请正确填写信息",
        type: "error",
        center: true,
      });
    }
  });
};

const selectOptions = ref([] as string[]);
const regionOptions = ref(provinceAndCityData);
const cityChange = (value: string[]) => {
  //console.log(value);
  form.cityCode = value[value.length - 1];
};

const reviewMsg = ref("");
const loading = ref(false);
onMounted(() => {
  const type = router.currentRoute.value.params.type;
  form.managerType = Number(type);
  const extend: any = userStore.userExtends.find(
    (item: any) => item.ManagerType == type
  );
  if (!extend) {
    const finder: any = userStore.userExtends.find(
      (item: any) => item.VerifyStatus == 1
    );
    if (finder) {
      getManagerInfo(Number(finder.ManagerType));
      ElMessageBox.confirm(
        "检测到您之前您已经通过了申请,无需再次填写基本信息",
        "提示",
        {
          confirmButtonText: "申请",
          cancelButtonText: "返回",
          type: "warning",
          autofocus: false,
        }
      )
        .then(() => {
          submitForm(formRef.value);
        })
        .catch(() => {
          router.push("/selectBusiness");
        });
    } else {
      getUser();
    }
  }
  if (extend && extend.VerifyStatus == 1) {
    ElMessage({
      showClose: true,
      message: "您已经通过了申请,请勿重复申请",
      type: "error",
      center: true,
    });
    router.push("/");
  }
  if (extend && extend.VerifyStatus == 2) {
    getManagerInfo(Number(type));
  }
});

const getManagerInfo = (type: number) => {
  loading.value = true;
  getApplyManager({ managerType: type })
    .then((res: any) => {
      if (res.code === 1) {
        form.fullName = res.data.FullName;
        const pCode = res.data.CityCode.slice(0, 2) + "0000";
        selectOptions.value = [pCode, res.data.CityCode];
        form.cityCode = res.data.CityCode;
        form.idNo = res.data.card;
        form.avatarUrl = res.data.headerImg;
        form.portraitUrl = res.data.frontImg;
        form.emblemUrl = res.data.backImg;
        reviewMsg.value = res.data.review;
      } else {
        ElMessage({
          showClose: true,
          message: res.msg,
          type: "error",
          center: true,
        });
      }
    })
    .finally(() => {
      loading.value = false;
    });
};

const getUser = () => {
  getRealNameAuthResult().then((res: any) => {
    if (res.code === 1) {
      form.fullName = res.data.FullName;
      form.idNo = res.data.IdentityCard;
      const portrait = res.data.picList.find((item: any) => item.Type == 1);
      const emblem = res.data.picList.find((item: any) => item.Type == 2);
      form.portraitUrl = portrait.FilePath + portrait.UniqueFileName;
      form.emblemUrl = emblem.FilePath + emblem.UniqueFileName;
    }
  });
};

const handlePortraitSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  form.portraitUrl = res.data;
  console.log(res.data);
};

const handleEmblemSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  form.emblemUrl = res.data;
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  form.avatarUrl = res.data;
  console.log(res.data);
};

const beforeUpload: UploadProps["beforeUpload"] = (rawFile) => {
  const typeArr = ["image/jpeg", "image/png", "image/jpg"];
  if (!typeArr.includes(rawFile.type)) {
    ElMessage.error("请上传格式正确的图片!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > config.CONFIG_FileSize) {
    ElMessage.error(`图片大小不能超过${config.CONFIG_IMGURL}MB!`);
    return false;
  }
  return true;
};
</script>
<style scoped>
.uploader {
  border: 1px dashed #8c939d;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.uploader:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 78px;
  height: 78px;
  text-align: center;
}

.avatar {
  width: 78px;
  height: 78px;
}

.idCard {
  width: 285px;
  height: 180px;
}
.el-icon.id-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 180px;
  text-align: center;
}
</style>
