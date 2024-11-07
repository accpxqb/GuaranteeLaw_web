<template>
  <el-card shadow="never" v-loading="isSubmit">
    <template v-if="showUpload">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="110px"
        class="demo-ruleForm"
        status-icon
      >
        <el-form-item label="姓名" prop="fullName">
          <el-input
            v-model="form.fullName"
            placeholder="请输入姓名"
            minlength="2"
            maxlength="8"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份证号" prop="card">
          <el-input
            v-model="form.card"
            placeholder="请输入身份证号"
            minlength="18"
            maxlength="18"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-row justify="space-between">
          <el-col :span="12" align="center">
            <el-form-item prop="frontImg">
              <el-upload
                class="uploader"
                :action="uploadUrl"
                :accept="accept"
                :headers="headers"
                :show-file-list="false"
                :on-success="handleFrontSuccess"
                :before-upload="beforePicUpload"
                :on-remove="handleFrontRemove"
                :data="data"
              >
                <el-image
                  v-if="form.frontImg"
                  :src="config.CONFIG_IMGURL + form.frontImg"
                />
                <el-image v-else :src="frontImg" class="uploader-icon" />
              </el-upload>
            </el-form-item>
            <el-row justify="center" style="margin-top: 10px">
              上传身份证人像面
            </el-row>
          </el-col>
          <el-col :span="12" align="center">
            <el-form-item prop="backImg">
              <el-upload
                class="uploader"
                :action="uploadUrl"
                :accept="accept"
                :headers="headers"
                :show-file-list="false"
                :on-success="handleBackSuccess"
                :before-upload="beforePicUpload"
                :on-remove="handleBackRemove"
                :data="data"
              >
                <el-image
                  v-if="form.backImg"
                  :src="config.CONFIG_IMGURL + form.backImg"
                />
                <el-image
                  v-else
                  :src="backImg"
                  class="uploader-icon"
                  fit="scale-down"
                /> </el-upload
            ></el-form-item>
            <el-row justify="center" style="margin-top: 10px">
              上传身份证国徽面
            </el-row>
          </el-col>
        </el-row>
        <el-row justify="center" style="margin-top: 20px">
          <el-button
            size="large"
            style="width: 120px"
            type="primary"
            @click="submit(formRef)"
            >提交
          </el-button>
        </el-row>
      </el-form>
    </template>
    <template v-else-if="showSuccess">
      <el-row justify="center">
        <el-image
          :src="successImg"
          style="width: 100px; height: 100px"
        ></el-image>
      </el-row>
      <el-row justify="center" class="mt-20"> 提交成功 </el-row>
      <el-row justify="center" class="mt-20">
        <el-button
          size="large"
          style="width: 120px"
          type="primary"
          @click="router.push({ name: 'CustomerHome' })"
        >
          返回
        </el-button>
      </el-row>
    </template>
    <template v-else-if="showReject">
      <el-row justify="center">
        <el-image :src="rejectImg" style="width: 100px; height: 100px" />
      </el-row>
      <el-row justify="center" class="mt-20"> 审核不通过 </el-row>
      <el-row justify="center" class="mt-20"> 原因：{{ reason }} </el-row>
      <el-row justify="center" class="mt-20">
        <el-button
          size="large"
          style="width: 120px"
          type="primary"
          @click="reUpload"
        >
          重新上传
        </el-button>
      </el-row>
    </template>
  </el-card>
</template>
<script lang="ts" setup>
import { reactive, ref, onUnmounted, onMounted, computed } from "vue";
import {
  ElMessage,
  type FormInstance,
  type FormRules,
  type UploadProps,
} from "element-plus";
import frontImg from "@/assets/images/verification/人像面@2x.png";
import backImg from "@/assets/images/verification/国徽面@2x.png";
import config from "@/utils/config";
import { useRouter } from "vue-router";
import {
  beforePicUpload,
  getHeader,
  getUploadType,
  getUploadUrl,
} from "@/utils/helper";
import successImg from "@/assets/images/verification/成功@2x.png";
import rejectImg from "@/assets/images/verification/审核未通过@2x.png";
import { IdVerifyStatus } from "@/utils/enums";
import { realNameAuth, getRealNameAuthResult } from "@/api/user";

const uploadUrl = getUploadUrl();
const accept = getUploadType();
const headers = reactive(getHeader());
const data = reactive({ name: "user" });

const formRef = ref<FormInstance>();
const form = reactive({
  fullName: "",
  card: "",
  frontImg: "",
  backImg: "",
});

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
  card: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
      message: "请输入正确的身份证号",
      trigger: "blur",
    },
  ],
  frontImg: [
    { required: true, message: "请上传身份证人像面", trigger: "change" },
  ],
  backImg: [
    { required: true, message: "请上传身份证国徽面", trigger: "change" },
  ],
});

const status = ref(2);
const reason = ref("");
const router = useRouter();
onMounted(() => {
  status.value = Number(router.currentRoute.value.query.status);
  console.log(status.value);
  if (status.value == IdVerifyStatus.None) {
  } else if (status.value == IdVerifyStatus.Approved) {
    router.push("/manager/home");
  } else if (status.value == IdVerifyStatus.Rejected) {
    getRealNameAuthResult().then((res: any) => {
      console.log("r", res);
      if (res.code == 1) {
        reason.value = res.data.Comment;
      }
    });
  }
});

const showUpload = computed(() => {
  return status.value === IdVerifyStatus.None;
});

const showSuccess = computed(() => {
  return (
    status.value === IdVerifyStatus.Approved ||
    status.value === IdVerifyStatus.Pending
  );
});

const showReject = computed(() => {
  return status.value === IdVerifyStatus.Rejected;
});

let subSuccess = false;
onUnmounted(() => {
  if (subSuccess) return;
});

const handleFrontSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  if (res.code == 1) {
    form.frontImg = res.data;
    ElMessage.success("上传成功");
  } else {
    ElMessage.error("上传失败");
  }
};

const handleBackSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  if (res.code == 1) {
    form.backImg = res.data;
    ElMessage.success("上传成功");
  } else {
    ElMessage.error("上传失败");
  }
};

const handleFrontRemove: UploadProps["onRemove"] = (uploadFile: any) => {
  const url = uploadFile.response ? uploadFile.response.data : uploadFile.name;
  form.frontImg = "";
};

const handleBackRemove: UploadProps["onRemove"] = (uploadFile: any) => {
  const url = uploadFile.response ? uploadFile.response.data : uploadFile.name;
  form.backImg = "";
};

const isSubmit = ref(false);
const submit = async (formEl: FormInstance | undefined) => {
  if (isSubmit.value) return;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      isSubmit.value = true;
      realNameAuth(form).then((res: any) => {
        if (res.code === 1) {
          ElMessage.success("提交成功");
          subSuccess = true;
          status.value = IdVerifyStatus.Pending;
        } else {
          ElMessage.error("提交失败");
        }
      });
    }
  });
  isSubmit.value = false;
};
const reUpload = () => {
  status.value = IdVerifyStatus.None;
};
</script>
<style scoped>
.uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  text-align: center;
  justify-content: center;
  display: flex;
  width: 342px;
  height: 216px;
}

.uploader:hover {
  border-color: var(--el-color-primary);
}

.uploader-icon {
  color: #8c939d;
  width: 177px;
  height: 138px;
  text-align: center;
}

.mt-20 {
  margin-top: 20px;
}
</style>
