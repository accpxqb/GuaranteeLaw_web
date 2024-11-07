<template>
  <div v-for="detail in list" style="margin-top: 1em">
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
  <div style="text-align: center; padding-top: 20px">
    <el-button
      v-if="maxlength > minlength"
      style="width: 120px"
      @click="showM"
      round
      >{{ btnTitle }}</el-button
    >
  </div>
</template>
<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  details: {
    type: Object,
  },
});

const minlength = ref(5);
const maxlength = computed(() => {
  return props.details.length;
});

const showlength = ref(minlength.value);
const btnTitle = ref("查看更多");

const list = computed(() => {
  return props.details.slice(0, showlength.value);
});
const showM = () => {
  if (btnTitle.value == "查看更多") {
    btnTitle.value = " 收起 ";
    showlength.value = maxlength.value;
  } else {
    btnTitle.value = "查看更多";
    showlength.value = minlength.value;
  }
};
</script>
<style scoped></style>
