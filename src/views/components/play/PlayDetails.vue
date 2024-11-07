<template>
  <div v-for="detail in playDetails" style="margin-top: 1em">
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex">
        <el-text truncated style="width: 200px">
          {{ detail.Name }}
        </el-text>
        <el-text style="margin-left: 5em">
          {{ detail.Number }}
        </el-text>
      </div>
      <div>
        <el-text>{{ detail.Price }}元</el-text>
      </div>
    </div>
    <div>
      <el-text type="info" size="small">{{ detail.Notes }}</el-text>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PlayDetail } from "@/types/play";

const props = defineProps({
  playDetails: {
    type: Array as () => PlayDetail[],
  },
});
</script>
<style scoped></style>
