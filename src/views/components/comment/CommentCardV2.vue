<template>
  <div style="margin-top: 0.5em">
    <div style="border-radius: 4px; background-color: #f5f5f5; padding: 1em">
      <div>
        <el-text style="white-space: pre-wrap" v-if="comment.CommentContent">
          {{ comment.CommentContent }}
        </el-text>
        <template
          v-else-if="
            !comment.CommentContent || comment.CommentContent.length == 0
          "
        >
          <el-text v-if="type == commentType.customerSelf">
            您没有填写评价内容
          </el-text>
          <el-text v-else>自动评价</el-text>
        </template>
      </div>
      <div
        v-if="comment.PicUrlList !== null && comment.PicUrlList.length"
        style="margin-top: 10px"
      >
        <el-image
          style="width: 50px; height: 50px; margin-right: 10px"
          :src="config.CONFIG_IMGURL + pic"
          :zoom-rate="1.2"
          :preview-src-list="[config.CONFIG_IMGURL + pic]"
          :initial-index="0"
          fit="cover"
          v-for="(pic, index) in comment.PicUrlList"
          :key="index"
        />
      </div>
    </div>
    <div class="rate_div" v-if="orderType == BusinessType.hotel">
      <div>
        <el-text tag="b">环境</el-text>
        <el-rate v-model="comment.EnvironmentalScore" disabled />
      </div>

      <div>
        <el-text tag="b">卫生</el-text>
        <el-rate v-model="comment.HealthScore" disabled />
      </div>

      <div>
        <el-text tag="b">服务</el-text>
        <el-rate v-model="comment.ServiceScore" disabled />
      </div>

      <div>
        <el-text tag="b">设施</el-text>
        <el-rate v-model="comment.FacilityScore" disabled />
      </div>
    </div>
    <div class="rate_div" v-if="orderType == BusinessType.play">
      <div>
        <el-text tag="b">服务态度</el-text>
        <el-rate v-model="comment.ServiceAttitude" disabled />
      </div>
      <div>
        <el-text tag="b">性价比</el-text>
        <el-rate v-model="comment.CostPerformance" disabled />
      </div>
      <div>
        <el-text tag="b">创意</el-text>
        <el-rate v-model="comment.Originality" disabled />
      </div>
    </div>
    <div class="rate_div" v-if="orderType == BusinessType.eat">
      <div>
        <el-text tag="b">味道</el-text>
        <el-rate v-model="comment.Taste" disabled />
      </div>
      <div>
        <el-text tag="b">服务态度</el-text>
        <el-rate v-model="comment.ServiceAttitude" disabled />
      </div>
      <div>
        <el-text tag="b">性价比</el-text>
        <el-rate v-model="comment.CostPerformance" disabled />
      </div>
      <div>
        <el-text tag="b">卫生</el-text>
        <el-rate v-model="comment.Originality" disabled />
      </div>
    </div>
    <el-row
      v-if="comment.ReplyList.length > 0"
      style="
        margin-top: 1em;
        background-color: #f5f5f5;
        border-radius: 4px;
        padding: 1em;
      "
    >
      <div class="card-header" style="width: 100%">
        <el-text tag="b">经理回复</el-text>
        <el-button
          type="danger"
          link
          v-if="!customer && !comment.ReplyList[0].IsDelete"
          @click="$emit('deleteReply', comment.ReplyList[0].Id)"
        >
          删除
        </el-button>
      </div>
      <el-text style="margin-top: 0.5em">
        {{ comment.ReplyList[0].CommentContent }}
      </el-text>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, onUnmounted } from "vue";
import config from "@/utils/config";
import { BusinessType } from "@/utils/enums";

const enum commentType {
  customerSelf = 1,
  managerSelf = 2,
  managerDetail = 3,
}
const props = defineProps<{
  comment: any;
  customer: boolean;
  orderType: BusinessType;
  type: commentType;
}>();

onMounted(() => {
  //console.log(props.comment);
  console.log(props.orderType);
});
</script>
<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rate_div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1em;
  width: 90%;
}

.rate_div div {
  display: flex;
  align-items: center;
}
</style>
