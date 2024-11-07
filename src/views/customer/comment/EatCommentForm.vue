<template>
  <el-card shadow="never">
    <el-form :model="form" ref="formRef" :rules="rules" label-position="top">
      <el-form-item>
        <el-input
          v-model="form.CommentContent"
          :rows="4"
          type="textarea"
          placeholder="分享体验心得，给其他人一个参考~"
          resize="none"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :action="uploadUrl"
          :headers="headers"
          :accept="accept"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="beforePicUpload"
          :on-success="handlePicSuccess"
          :limit="5"
          class="uploadImgList"
          :data="{ name: 'comment_eat', isCompress: true }"
        >
          <el-row>
            <el-col :span="24" style="text-align: center">
              <el-icon>
                <Plus />
              </el-icon>
            </el-col>
            <el-col :span="24" style="text-align: center">
              <el-text>还可上传{{ limit - fileList.length }}张</el-text>
            </el-col>
          </el-row>
        </el-upload>
      </el-form-item>
      <el-row>
        <el-col :span="6">
          <el-form-item prop="Taste">
            <el-text tag="b">味道</el-text>
            <el-rate
              v-model="form.Taste"
              :colors="colors"
              text-color="red"
              :texts="rateTexts"
              show-text
              style="margin-left: 5px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="Originality">
            <el-text tag="b">环境</el-text>
            <el-rate
              v-model="form.Originality"
              :colors="colors"
              text-color="red"
              :texts="rateTexts"
              show-text
              style="margin-left: 5px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="ServiceAttitude">
            <el-text tag="b">服务态度</el-text>
            <el-rate
              v-model="form.ServiceAttitude"
              :colors="colors"
              :texts="rateTexts"
              show-text
              style="margin-left: 5px"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item prop="CostPerformance">
            <el-text tag="b">性价比</el-text>
            <el-rate
              v-model="form.CostPerformance"
              :colors="colors"
              :texts="rateTexts"
              show-text
              style="margin-left: 5px"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row justify="end">
        <el-form-item>
          <el-button @click="handleBack()">取消</el-button>
          <el-button type="primary" @click="submitForm(formRef)">
            提交
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-card>

  <el-dialog v-model="dialogVisible">
    <el-image fill="cover" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import {
  type UploadProps,
  type UploadUserFile,
  type FormInstance,
  type FormRules,
  ElMessage,
} from "element-plus";
import { beforePicUpload } from "@/utils/uploadHelper";
import { deletePicture, deletePictures, addComment } from "@/api/comment_eat";
import config from "@/utils/config";
import { useRoute, useRouter } from "vue-router";
import { uploadUrl } from "@/utils/uploadHelper";

onUnmounted(() => {
  // console.log("unmounted");
  if (form.PicUrlList.length > 0) deletePictures(form.PicUrlList);
});

const form = reactive({
  OrderId: 0,
  ManagerId: 0,
  PicUrlList: [] as string[],
  CommentContent: "",
  /**
   * 服务态度
   */
  ServiceAttitude: 0,
  /**
   * 性价比
   */
  CostPerformance: 0,
  /**
   * 创意 ///环境
   */
  Originality: 0,
  /**
   * 味道
   */
  Taste: 0,
  IsFollowUp: false,
  IsPositive: false,
  IsReply: false,
});

const route = useRoute();
onMounted(() => {
  const { orderId, managerId } = route.query;
  if (orderId !== null) {
    form.OrderId = Number(orderId);
  } else {
    ElMessage.error("订单数据加载失败");
  }
  if (managerId !== null) {
    form.ManagerId = Number(managerId);
  } else {
    ElMessage.error("订单数据加载失败");
  }
});

const rateTexts = reactive(["差", "较差", "一般", "好", "完美"]);
const colors = ref(["#99A9BF", "#F7BA2A", "#FF9900"]);

const formRef = ref<FormInstance>();

const validateRate = (rule: any, value: number, callback: any) => {
  if (value === 0) {
    callback(new Error("请评分"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  ServiceAttitude: [{ validator: validateRate, trigger: "change" }],
  CostPerformance: [{ validator: validateRate, trigger: "change" }],
  Originality: [{ validator: validateRate, trigger: "change" }],
  Taste: [{ validator: validateRate, trigger: "change" }],
});

const router = useRouter();
let isSubmitting = false;
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (isSubmitting) return;
  console.log("form", form);
  await formEl.validate((valid, fields) => {
    if (valid) {
      isSubmitting = true;
      addComment(form).then((res: any) => {
        if (res.code === 1) {
          form.PicUrlList.length = 0;
          ElMessage.success("提交成功");
          router.push({ name: "MyComment" });
        } else {
          ElMessage.error("提交失败");
        }
      });
      //console.log('submit!')
    } else {
      console.log("error submit!", fields);
    }
  });
  isSubmitting = false;
};

const limit = ref(5);
const fileList = ref<UploadUserFile[]>([]);
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const accept = ref(".jpg,.png,.jpeg");
//const uploadUrl = ref(config.CONFIG_API + "Comment/UploadPic");
const headers = reactive({
  Authorization: "Bearer " + localStorage.getItem("token"),
});

const handleRemove: UploadProps["onRemove"] = (
  uploadFile: any,
  uploadFiles
) => {
  const url = uploadFile.response ? uploadFile.response.data : uploadFile.name;
  deletePicture({ url }).then((res: any) => {
    if (res.code === 1) {
      //从form.PicUrlList中删除
      const index = form.PicUrlList.findIndex((item) => item === url);
      if (index !== -1) form.PicUrlList.splice(index, 1);
      ElMessage.success("删除成功");
    } else {
      ElMessage.error("删除失败");
    }
  });
};

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

const handlePicSuccess: UploadProps["onSuccess"] = (res: any, uploadFile) => {
  if (res.code) {
    form.PicUrlList.push(res.data);
    ElMessage.success("上传成功");
  } else {
    ElMessage.error("上传失败");
  }
};
//返回orderList
const handleBack = () => {
  router.push({ name: "ClientCompleted" });
};
</script>
<style scoped>
.uploadImgList :deep(.el-upload-list__item) {
  width: 100px;
  height: 100px;
}

.uploadImgList :deep(.el-upload--picture-card) {
  width: 100px;
  height: 100px;
}

:root {
  --el-rate-text-color: red;
}
</style>
