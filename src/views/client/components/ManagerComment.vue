<template>
  <template v-if="commentList.length > 0">
    <el-card
      shadow="never"
      style="margin-top: 10px; width: 100%"
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
              <el-text tag="b">
                {{ comment.OrderObject.UserNickName }}
              </el-text>
            </el-row>
            <el-row>
              <el-text type="info">
                {{
                  comment.CommentObject.CreateTime?.split("T")[0] +
                  " | " +
                  getOrderName(comment.OrderType, comment.OrderObject)
                }}
              </el-text>
            </el-row>
          </div>
        </el-space>
      </el-row>
      <CommentCardV2
        :comment="comment.CommentObject"
        :customer="true"
        :order-type="comment.OrderType"
        :type="3"
      ></CommentCardV2>
    </el-card>
    <div style="width: 100%; text-align: center; margin-top: 20px">
      <el-button
        @click="getNextPage"
        round
        v-if="showMore"
        style="
          padding: 20px 40px 20px 40px;
          border-color: var(--el-text-color-regular);
        "
      >
        {{ $t("ManagerComment.SeeMore") }}
        <el-icon style="transform: rotate(90deg); margin-left: 4px">
          <DArrowRight />
        </el-icon>
      </el-button>
    </div>
  </template>
  <div v-else style="display: flex; justify-content: center; width: 100%">
    <el-empty description="暂无评价" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, computed } from "vue";
import type { CommentPageRequest } from "@/types/comment";
import { getCommentList } from "@/api/comment";
import CommentCardV2 from "@/views/components/comment/CommentCardV2.vue";
import config from "@/utils/config";

const pageRequest: CommentPageRequest = reactive({
  PastPage: 0,
  CurrentPage: 1,
  PageSize: 3,
});

const props = defineProps<{
  managerId: number;
  managerType: number;
}>();

const currentCount = ref(0);
const commentList: any[] = reactive([]);
onMounted(() => {
  if (props.managerId == 0) return;
  pageRequest.ManagerId = props.managerId;
  pageRequest.ManagerType = props.managerType;
  getComment();
});

const getNextPage = () => {
  pageRequest.CurrentPage++;
  getComment();
};

const getComment = () => {
  getCommentList(pageRequest).then((res) => {
    currentCount.value = res.data.count;
    res.data.data.forEach((item: any) => {
      commentList.push(item);
    });
    console.log(commentList);
  });
};

const showMore = computed(() => {
  return currentCount.value > commentList.length;
});

const getOrderName = (orderType: number, order: any) => {
  switch (orderType) {
    case 1:
      return order.HotelName;
    case 2:
      return order.PlayName;
    default:
      return "";
  }
};
</script>

<style scoped>
.pinglun_box {
  border-bottom: 1px solid var(--el-border-color);
  padding-bottom: 15px;
  margin-bottom: 15px;
}

.pinglun {
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.pinglun_title {
  font-size: 16px;
  color: var(--el-text-color-regular);
}

.managerreply {
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 0 10px;
}

.jiantoubg {
  width: 20px;
  height: 10px;
  background: url("../../../assets/images/homepageManager/jiantoubg.png")
    no-repeat center / cover;
  margin-left: 20px;
  margin-top: 10px;
}
</style>
