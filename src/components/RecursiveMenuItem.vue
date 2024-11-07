<template>
  <el-sub-menu v-if="item.children" :index="item.name">
    <template #title>
      <span>{{ $t(item.name) }}</span>
    </template>

    <template v-for="child in item.children" :key="child.name">
      <RecursiveMenuItem
        :item="child"
        :parent-path="parentPath + '/' + item.path"
      ></RecursiveMenuItem>
    </template>
  </el-sub-menu>

  <el-menu-item v-else-if="item.onMenu" :index="parentPath + '/' + item.path">
    <span>{{ $t(item.name) }}</span>
  </el-menu-item>
</template>
<script lang="ts" setup>
import RecursiveMenuItem from "@/components/RecursiveMenuItem.vue";
import { onMounted } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  parentPath: {
    type: String,
    required: true,
    default: "",
  },
});
</script>
