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
      label-position="top"
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
          :data="{ name: 'manager', isCompress: true }"
        >
          <img
            v-if="form.avatarUrl"
            :src="config.CONFIG_IMGURL + form.avatarUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span>生活照</span>
          <span style="font-size: smaller">（最多上传六张）</span>
        </template>
        <el-upload
          v-model:file-list="imgsForShow"
          :action="uploadUrl"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="6"
          :before-upload="beforeUpload"
          :on-success="handleUploadLifePicSuccess"
          :accept="accept"
          :headers="headers"
          :data="{ name: 'manager' }"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item prop="personalProfile">
        <template #label>
          <span>个人简介</span>
          <span style="font-size: smaller">（让客户更加直观的了解你）</span>
        </template>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入个人简介"
          v-model="form.personalProfile"
          maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-dialog v-model="dialogVisible" lock-scroll center>
    <el-image :src="dialogImageUrl" fit="contain" />
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import config from "@/utils/config";
import { type UploadProps, ElMessage, type FormInstance } from "element-plus";
import { modifyUser } from "@/api/manager";
import router from "@/router";
import { BusinessType } from "@/utils/enums";
import { getUserPersonalShow } from "@/api/managerprofile.js";
import { uploadUrl } from "@/utils/uploadHelper";

interface ProfileForm {
  avatarUrl: string;
  lifePicList?: string[];
  personalProfile?: string;
}

const formRef = ref<FormInstance>();
const form: ProfileForm = reactive({
  avatarUrl: "",
  lifePicList: [],
});

const rules = {
  avatarUrl: [{ required: true, message: "请上传头像", trigger: "change" }],
  personalProfile: [
    { required: true, message: "请输入个人简介", trigger: "blur" },
    { min: 10, max: 200, message: "长度在 10 到 200 个字符", trigger: "blur" },
  ],
};

const accept = ref(".jpg,.png,.jpeg");
//const uploadUrl = ref(config.CONFIG_API + "Manager/UploadLifeFile");
const headers = reactive({
  Authorization: "Bearer " + localStorage.getItem("token"),
});

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

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
  console.log(res.data);
};

const imgsForShow = ref([] as {}[]);
const handleUploadLifePicSuccess: UploadProps["onSuccess"] = (
  res,
  uploadFile
) => {
  form.lifePicList = form.lifePicList || [];
  form.lifePicList.push(res.data);
};

const handleRemove: UploadProps["onRemove"] = (
  uploadFile: any,
  uploadFiles
) => {
  if (form.lifePicList) {
    form.lifePicList.splice(
      form.lifePicList.findIndex((item) => item == uploadFile.filePath),
      1
    );
  }
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

let submitting = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      submitting.value = true;
      modifyUser({
        photoImg: form.avatarUrl,
        lifePicList: form.lifePicList,
        personalProfile: form.personalProfile,
        managerType: managerType.value,
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
const managerType = ref(0);
onMounted(() => {
  // get path
  const path = router.currentRoute.value.path;
  const type = path.split("/")[2];
  managerType.value = BusinessType[type as keyof typeof BusinessType];
  console.log("type", managerType.value);
  getUserPersonalShow({ managerType: managerType.value }).then((res: any) => {
    // console.log(res.data);
    if (res.code == 1) {
      const finder = res.data.usersExtends.find(
        (item: any) => item.ManagerType == managerType.value
      );
      form.avatarUrl = finder.PhotoImg;
      form.personalProfile = finder.PersonalProfile;
      res.data.LifePicList.forEach((element: any) => {
        imgsForShow.value.push({
          url: element.Url,
          uniqueFileName: element.FilePath.split("/").pop(),
          filePath: element.FilePath,
        });
        form.lifePicList?.push(element.FilePath);
      });
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
