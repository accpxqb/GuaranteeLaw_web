<template>
  <el-card
    shadow="never"
    style="margin-top: 10px"
    v-for="comment in commentList"
    :key="comment.Id"
  >
    <el-row class="card-header">
      <el-space>
        <el-avatar
          fit="cover"
          :size="35"
          :src="config.CONFIG_IMGURL + comment.OrderObject.UserPhotoPath"
        >
        </el-avatar>
        <div>
          <el-row>
            <el-text>
              {{ "客户：" + comment.OrderObject.UserNickName }}
            </el-text>
          </el-row>
          <el-row>
            <el-text>
              {{
                comment.CommentObject.CreateTime?.split("T")[0] +
                "|" +
                comment.OrderObject.BabquetName
              }}
            </el-text>
          </el-row>
        </div>
      </el-space>
    </el-row>
    <CommentCardV2
      :comment="comment.CommentObject"
      :customer="false"
      :order-type="comment.OrderType"
      :type="2"
      @delete-reply="handleDelete"
    ></CommentCardV2>
    <ReplyCard
      :comment="comment"
      v-on:handle-reply="replySuccess"
      v-if="comment.CommentObject.ReplyList.length == 0"
    ></ReplyCard>
  </el-card>
  <el-pagination
    background
    layout="prev, pager, next, total"
    :total="total"
    v-model:current-page="pageRequest.CurrentPage"
    v-model:page-size="pageRequest.PageSize"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :hide-on-single-page="true"
  />
  <BaseEmpty v-show="total <= 0" description="暂无评价"></BaseEmpty>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import type { CommentPageRequest, CommentModel } from "@/types/comment";
import { deleteReply } from "@/api/comment_play";
import { getCommentList } from "@/api/comment";
import { ElMessage, ElMessageBox } from "element-plus";
import BaseEmpty from "@/components/BaseEmpty.vue";
import config from "@/utils/config";
import ReplyCard from "@/views/manager/comment/ReplyCard.vue";
import CommentCardV2 from "@/views/components/comment/CommentCardV2.vue";
import { BusinessType } from "@/utils/enums";

const pageRequest: CommentPageRequest = reactive({
  PastPage: 0,
  CurrentPage: 1,
  PageSize: 10,
  ManagerType: BusinessType.eat,
});

const commentList = ref();
const total = ref(0);
onMounted(() => {
  getComments();
});

const getComments = () => {
  getCommentList(pageRequest).then((res: any) => {
    console.log("cl", res.data.data);
    if (res.code == 1) {
      commentList.value = res.data.data;
      total.value = res.data.count;
    }
  });
};

const handleDelete = (commentId: number) => {
  if (commentId == 0) {
    ElMessage.error("删除失败");
    return;
  }
  ElMessageBox.confirm("此操作将永久删除该回复, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteReply({ commentId: commentId }).then((res: any) => {
        if (res.code == 1) {
          ElMessage.success("删除成功");
          setTimeout(() => {
            getComments();
          }, 200);
        } else {
          ElMessage.error("删除失败");
        }
      });
    })
    .catch(() => {});
};

const handleCurrentChange = (val: number) => {
  pageRequest.CurrentPage = val;
  getComments();
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};

const replySuccess = () => {
  getComments();
};
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: centers;
}
</style>
