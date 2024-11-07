<template>
  <el-card class="box-card" style="border-radius: 8px" shadow="never">
    <template #header>
      <div style="color: white">
        <span>个人资料</span>
      </div>
    </template>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
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

      <el-form-item label="昵称" prop="nickName">
        <el-input
          v-model="form.nickName"
          placeholder="请输入昵称"
          :maxlength="16"
          style="width: 300px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ElMessage, type FormInstance, type UploadProps } from "element-plus";
import { onMounted, reactive, ref } from "vue";
import config from "@/utils/config";
import { modifyUserInformation, getUserInfo } from "@/api/user";
import { uploadUrl } from "@/utils/uploadHelper";

const formRef = ref<FormInstance>();
interface UserForm {
  avatarUrl: string;
  nickName: string;
}
const form: UserForm = reactive({
  avatarUrl: "",
  nickName: "",
});

const rules = {
  avatarUrl: [{ required: true, message: "请上传头像", trigger: "change" }],
  nickName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
};

const accept = ref(".jpg,.png,.jpeg");
//const uploadUrl = ref(config.CONFIG_API + "User/UploadFile");
//const uploadUrl = ref(config.CONFIG_API + "upload/universalUploadFile");

const headers = reactive({
  Authorization: "Bearer " + localStorage.getItem("token"),
});

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

const handleAvatarSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  form.avatarUrl = res.data;
  //console.log(res.data);
};

const submitting = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  await formEl.validate((valid, fields) => {
    if (valid) {
      submitting.value = true;
      modifyUserInformation({
        photoPath: form.avatarUrl,
        nickName: form.nickName,
      })
        .then((res: any) => {
          if (res.code === 1) {
            ElMessage({
              showClose: true,
              message: "保存成功",
              type: "success",
              center: true,
            });
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
          submitting.value = false;
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

onMounted(() => {
  getUserInfo().then((res: any) => {
    console.log(res);
    if (res.code === 1) {
      form.avatarUrl = res.data.PhotoPath;
      form.nickName = res.data.NickName;
    }
  });
});
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

:deep(.el-card__header) {
  background-color: var(--el-color-primary) !important;
  border-bottom: none;
}
</style>
