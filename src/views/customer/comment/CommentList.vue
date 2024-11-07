<template>
  <el-card
    shadow="never"
    v-for="comment in commentList"
    :key="comment.Id"
    style="margin-bottom: 10px"
  >
    <div class="card-header">
      <div>
        <div style="display: flex; align-items: center">
          <el-avatar
            fit="cover"
            :size="35"
            :src="config.CONFIG_IMGURL + comment.OrderObject.ManagerPhotoPath"
          >
          </el-avatar>

          <el-text style="margin-left: 1em" tag="b">
            {{
              $t("ManagerResponseVue.Manager") +
              ": " +
              comment.OrderObject.ManagerName
            }}
          </el-text>
        </div>
        <div style="display: flex; align-items: center; margin-top: 0.5em">
          <el-avatar
            :size="18"
            :src="leZhu"
            v-if="comment.OrderType == BusinessType.hotel"
          />
          <el-avatar
            :size="18"
            :src="leWan"
            v-if="comment.OrderType == BusinessType.play"
          />
          <el-avatar
            :size="18"
            :src="leShi"
            v-if="comment.OrderType == BusinessType.eat"
          />
          <el-text style="margin-left: 1em" type="info">
            {{ comment.CommentObject.CreateTime?.split("T")[0] + " |" }}
            <template v-if="comment.OrderType == BusinessType.hotel">
              {{ comment.OrderObject.HotelName }}
            </template>
            <template v-if="comment.OrderType == BusinessType.play">
              {{ comment.OrderObject.PlayName }}
            </template>
            <template v-if="comment.OrderType == BusinessType.eat">
              {{ comment.OrderObject.BabquetName }}
            </template>
          </el-text>
        </div>
      </div>
      <el-button @click="handleDelete(comment)">删除评价</el-button>
    </div>

    <CommentCardV2
      :comment="comment.CommentObject"
      :customer="true"
      :order-type="comment.OrderType"
      :type="1"
    />
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
import type { CommentInfo, CommentPageRequest } from "@/types/comment";
import {
  getCommentList,
  deleteComment as deleteHotelComment,
} from "@/api/comment";
import { deleteComment as deletePlayComment } from "@/api/comment_play";
import config from "@/utils/config";
import { ElMessage, ElMessageBox } from "element-plus";
import CommentCardV2 from "@/views/components/comment/CommentCardV2.vue";
import BaseEmpty from "@/components/BaseEmpty.vue";
import leWan from "@/assets/images/乐玩@2x.png";
import leZhu from "@/assets/images/乐住@2x.png";
import leShi from "@/assets/images/乐食.png";
import { BusinessType } from "@/utils/enums";

const pageRequest: CommentPageRequest = reactive({
  PastPage: 0,
  CurrentPage: 1,
  PageSize: 10,
});

const commentList = ref();
const total = ref(0);
onMounted(() => {
  getComments();
});

const getComments = () => {
  getCommentList(pageRequest).then((res: any) => {
    if (res.code == 1) {
      console.log("res", res.data);
      total.value = res.data.count;
      commentList.value = res.data.data;
    }
  });
};

const handleDelete = (comment: any) => {
  if (!comment.CommentObject.Id || comment.CommentObject.Id == 0) {
    ElMessage.error("删除失败");
    return;
  }
  let deleteFunc: ((params: { commentId: number }) => Promise<any>) | null =
    null;
  switch (comment.OrderType) {
    case 1:
      deleteFunc = deleteHotelComment;
      break;
    case 2:
      deleteFunc = deletePlayComment;
      break;
    default:
      break;
  }
  if (!deleteFunc) {
    ElMessage.error("删除失败");
    return;
  } else {
    ElMessageBox.confirm("此操作将永久删除该评价, 是否继续?", "删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        deleteFunc!({ commentId: comment.CommentObject.Id }).then(
          (res: any) => {
            console.log(res);
            ElMessage.success("删除成功");
            setTimeout(() => {
              getComments();
            }, 300);
          }
        );
      })
      .catch(() => {});
  }
  //弹窗确认
};

const handleCurrentChange = (val: number) => {
  pageRequest.CurrentPage = val;
  getComments();
};

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
