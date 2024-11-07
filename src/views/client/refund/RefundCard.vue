<template>
  <div style="padding: 20px">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="auto">
      <el-form-item label="退款原因" prop="RefundReason">
        <el-select
          v-model="form.RefundReason"
          placeholder="请选择退款原因"
          style="width: 100%"
        >
          <el-option label="不想要了" value="不想要了"></el-option>
          <el-option label="临时有别的安排" value="临时有别的安排"></el-option>
          <el-option label="协商退款" value="协商退款"></el-option>
          <el-option label="其他" value="其他"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退款金额" prop="RefundAmount">
        <el-row style="width: 100%">
          <el-col :span="12" style="width: 100%">
            <el-input-number
              v-model="form.RefundAmount"
              placeholder="请输入退款金额"
              :controls="false"
              :min="0"
              :max="maxRefundAmount"
              :precision="2"
            >
            </el-input-number>
          </el-col>
          <el-col :span="12" style="width: 100%">
            <el-text>本单最多可退{{ maxRefundAmount }}元</el-text>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="退款描述" prop="Notes">
        <el-input
          v-model="form.Notes"
          placeholder="请输入退款描述"
          type="textarea"
          :rows="3"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <template #label>
          <span style="white-space: pre-line">
            <el-row> 上传图片 </el-row>
            <el-row>
              <el-text size="small">(最多五张)</el-text>
            </el-row>
          </span>
        </template>
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
          :data="{ name: 'refund' }"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm(formRef)"
          size="large"
          style="width: 100%"
          >提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-dialog v-model="dialogVisible">
    <el-image :src="dialogImageUrl"></el-image>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import {
  ElMessage,
  type FormInstance,
  type FormRules,
  type UploadProps,
  type UploadUserFile,
} from "element-plus";
import config from "@/utils/config";
import type { Refund } from "@/types/refund";
import {
  refund,
  deletePicture,
  getRefundById,
  getRefundByOrderId,
} from "@/api/refund";
import { uploadUrl } from "@/utils/uploadHelper";

const formRef = ref<FormInstance>();

interface Props {
  orderId?: number;
  maxRefundAmount?: number;
  type: "add" | "edit";
}
const props = defineProps<Props>();

const fileList = ref<UploadUserFile[]>([]);

const form = ref<Refund>({
  OrderId: 0,
  RefundReason: "",
  RefundAmount: 0,
  Notes: "",
  Pictures: [],
});

onMounted(() => {
  if (!props.orderId || !props.maxRefundAmount || !props.type) return;
  if (props.type === "edit") {
    getRefundByOrderId({ orderId: props.orderId }).then((res: any) => {
      if (res.code === 1) {
        form.value = { ...res.data };
        form.value.Pictures.forEach((element) => {
          fileList.value.push({
            url: config.CONFIG_IMGURL + element,
            name: element,
          });
        });
      }
    });
  } else if (props.type === "add") {
    form.value.OrderId = props.orderId;
    form.value.RefundAmount = props.maxRefundAmount;
  }
});

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const accept = ref(".jpg,.png,.jpeg");
//const uploadUrl = ref(config.CONFIG_API + "Refund/UploadPic");
const headers = reactive({
  Authorization: "Bearer " + localStorage.getItem("token"),
});

const rules = reactive<FormRules>({
  RefundAmount: [
    { required: true, message: "请输入退款金额", trigger: "blur" },
    {
      type: "number",
      min: 0.01,
      message: "退款金额不能小于0",
      trigger: "blur",
    },
  ],
  RefundReason: [
    { required: true, message: "请选择退款原因", trigger: "change" },
  ],
  Notes: [{ required: true, message: "请输入退款描述", trigger: "blur" }],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      refund(form.value).then((res: any) => {
        if (res.code === 1) {
          ElMessage.success("提交成功");
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } else {
          ElMessage.error("提交失败");
        }
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const handleRemove: UploadProps["onRemove"] = (
  uploadFile: any,
  uploadFiles
) => {
  const url = uploadFile.response ? uploadFile.response.data : uploadFile.name;
  // deletePicture({ url }).then((res: any) => {
  // if (res.code === 1) {
  const index = form.value.Pictures.findIndex((item) => item === url);
  if (index !== -1) form.value.Pictures.splice(index, 1);
  // ElMessage.success("删除成功");
  // } else {
  //   ElMessage.error("删除失败");
  // }
  // });
};
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

const beforePicUpload: UploadProps["beforeUpload"] = (rawFile) => {
  //判断图片格式
  if (!checkPicType(rawFile)) {
    ElMessage.error("picture must be JPG format!");
    return false;
  }
  //判断图片大小
  if (!checkPicSize(rawFile)) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};

const checkPicType = (rawFile: File) => {
  const isJPG = rawFile.type === "image/jpg";
  const isPNG = rawFile.type === "image/png";
  const isJPEG = rawFile.type === "image/jpeg";
  if (!isJPG && !isPNG && !isJPEG) {
    ElMessage.error("上传图片只能是 JPG/PNG/JPEG 格式!");
    return false;
  }
  return true;
};

const checkPicSize = (rawFile: File) => {
  const isLt2M = rawFile.size / 1024 / 1024 < config.CONFIG_FileSize;
  if (!isLt2M) {
    ElMessage.error("上传图片大小不能超过" + config.CONFIG_FileSize + "MB!");
    return false;
  }
  return true;
};

const handlePicSuccess: UploadProps["onSuccess"] = (res, uploadFile) => {
  if (res.code) {
    form.value.Pictures.push(res.data);
    ElMessage.success("上传成功");
  } else {
    ElMessage.error("上传失败");
  }
  console.log(res.data);
};
</script>
