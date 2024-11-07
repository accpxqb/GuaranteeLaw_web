<template>
  <div
    style="
      background-color: #f5f5f5;
      border-radius: 10px;
      padding: 10px;
      margin-top: 10px;
    "
  >
    <el-row>
      <el-input
        placeholder="请输入回复内容"
        v-model="replayContent"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        :maxlength="200"
        show-word-limit
      >
      </el-input>
    </el-row>
    <el-row style="margin-top: 10px" justify="end">
      <el-button
        type="primary"
        size="small"
        @click="submitReplay"
        :disabled="disableButton"
      >
        提交
      </el-button>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import { replyComment } from "@/api/comment_eat";
import { replyComment as replayPlayComment } from "@/api/comment_play";
import { replyComment as replayHotelComment } from "@/api/comment";

const props = defineProps<{
  comment: any;
}>();

const emits = defineEmits(["handleReply"]);

const replayContent = ref("");

const disableButton = computed(() => {
  console.log(!replayContent.value || replayContent.value.trim() == "");
  return !replayContent.value || replayContent.value.trim() == "";
});

const isSubmitting = ref(false);
const submitReplay = () => {
  if (replayContent.value == "") {
    ElMessage.error("请输入回复内容");
    return;
  }
  isSubmitting.value = true;
  let submitFunction = null;
  switch (props.comment.OrderType) {
    case 1:
      submitFunction = replayHotelComment;
      break;
    case 2:
      submitFunction = replayPlayComment;
      break;
    case 3:
      submitFunction = replyComment;
    default:
      break;
  }
  if (!submitFunction) {
    ElMessage.error("回复失败");
    return;
  }
  submitFunction({
    parentId: props.comment.CommentObject.Id,
    orderId: props.comment.OrderObject.Id,
    userId: props.comment.OrderObject.managerId,
    commentContent: replayContent.value,
    serviceAttitude: 0,
    costPerformance: 0,
    originality: 0,
    isPositive: false,
    isFollowUp: false,
    isReply: true,
    managerId: props.comment.OrderObject.ManagerId,
    picUrlList: [],
    replyList: [],
  }).then((res: any) => {
    if (res.code == 1) {
      ElMessage.success("回复成功");
      // setTimeout(() => {
      //   getComments();
      // }, 200);
      emits("handleReply");
    } else {
      isSubmitting.value = false;
      ElMessage.error("删除失败");
    }
  });
  isSubmitting.value = false;
};
</script>
<style scoped></style>
