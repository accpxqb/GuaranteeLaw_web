<template>
  <el-card shadow="never" v-loading="isSubmit">
    <template v-if="showUpload">
      <el-row justify="space-between">
        <el-col :span="24" align="center">
          <el-upload
            class="uploader"
            :action="uploadUrl"
            :accept="accept"
            :headers="headers"
            :show-file-list="false"
            :on-success="handleImgSuccess"
            :before-upload="beforePicUpload"
            :data="{ name: 'manager' }"
          >
            <el-image v-if="licenseUrl" :src="config.CONFIG_IMGURL + showUrl" />
            <el-image v-else :src="licenseImg" class="uploader-icon" />
          </el-upload>
        </el-col>
      </el-row>
      <el-row justify="center" style="margin-top: 10px"> 上传营业执照 </el-row>
      <el-row justify="center" class="mt-20">
        <el-button
          size="large"
          style="width: 120px"
          type="primary"
          @click="submit"
        >
          提交
        </el-button>
      </el-row>
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
          @click="back"
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
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { ElMessage, type UploadProps } from "element-plus";
import licenseImg from "@/assets/images/verification/营业执照@2x.png";
import { beforePicUpload } from "@/utils/helper";
import { useRouter } from "vue-router";
import {
  deletePicture,
  getLicenseStatus,
  licenseVerification,
} from "@/api/manager";
import config from "@/utils/config";
import successImg from "@/assets/images/verification/成功@2x.png";
import rejectImg from "@/assets/images/verification/审核未通过@2x.png";
import { BusinessType, ManagerType, LicenseVerifyStatus } from "@/utils/enums";
import { uploadUrl } from "@/utils/uploadHelper";

const accept = ref(".jpg,.png,.jpeg");
//const uploadUrl = ref(config.CONFIG_API + "Manager/UploadPic");
const headers = reactive({
  Authorization: "Bearer " + localStorage.getItem("token"),
});

const licenseUrl = ref("");
const showUrl = ref("");

const status = ref(0);
const reason = ref("");
const managerType = ref();
onMounted(() => {
  managerType.value = router.currentRoute.value.query.type;
  getLicenseStatus({
    managerType: managerType.value,
  }).then((res: any) => {
    if (res.code === 1) {
      //console.log("onMounted", res.data);
      const result = res.data;
      status.value = result.LicenseVerificationStatus;
      if (status.value == LicenseVerifyStatus.Rejected) {
        reason.value = result.Comment;
      }
    }
  });
});

const showUpload = computed(() => {
  return status.value === LicenseVerifyStatus.None;
});

const showSuccess = computed(() => {
  return (
    status.value === LicenseVerifyStatus.Approved ||
    status.value === LicenseVerifyStatus.Pending
  );
});

const showReject = computed(() => {
  return status.value === LicenseVerifyStatus.Rejected;
});

let subSuccess = false;
onUnmounted(() => {
  if (subSuccess) return;
  if (!licenseUrl.value) return;
  deletePicture({ licenseUrl }).then((res: any) => {
    if (res.code === 1) {
      console.log("删除成功");
    } else {
      console.log("删除失败");
    }
  });
});

const handleImgSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  if (res.code == 1) {
    //分割字符串
    showUrl.value = res.data;
    licenseUrl.value = res.data;
    // let arr = showUrl.value.split("/");
    // licenseUrl.value = arr[1] + "/" + arr[2];
    ElMessage.success("上传成功");
  } else {
    ElMessage.error("上传失败");
  }
};
const isSubmit = ref(false);
const router = useRouter();
const submit = () => {
  if (isSubmit.value) return;
  if (!licenseUrl.value) {
    ElMessage.error("请上传营业执照图片");
    return;
  }
  isSubmit.value = true;
  licenseVerification({
    url: licenseUrl.value,
    managerType: managerType.value,
  }).then((res: any) => {
    if (res.code === 1) {
      ElMessage.success("提交成功");
      subSuccess = true;
      status.value = LicenseVerifyStatus.Pending;
    } else {
      ElMessage.error("提交失败");
    }
  });
  isSubmit.value = false;
};

const reUpload = () => {
  status.value = LicenseVerifyStatus.None;
};

const back = () => {
  console.log(router.currentRoute.value);
  if (managerType.value == BusinessType.hotel) {
    router.push({
      name: "HotelHome",
    });
  } else if (managerType.value == BusinessType.play) {
    router.push({
      name: "PlayHome",
    });
  }
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
  width: 420px;
  height: 297px;
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
