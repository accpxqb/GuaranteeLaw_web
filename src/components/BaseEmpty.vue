<template>
  <el-empty :description="description" :image="empty" :image-size="400" />
</template>
<script setup>
import empty from "@/assets/images/空页面@2x.png";

const props = defineProps({
  description: {
    type: String,
    default: "暂无数据",
  },
});
</script>
