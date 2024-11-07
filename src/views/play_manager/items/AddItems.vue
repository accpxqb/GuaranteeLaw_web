<template>
  <div class="box">
    <div class="titel" style="">请选择服务内容</div>
    <!-- <el-divider /> -->
    <div class="content">
      <el-checkbox-group v-model="managerItems" max="9" min="1">
        <div
          style="padding: 0px 10px; margin-top: 2em"
          v-for="item in allItems"
        >
          <div style="font-weight: bold; font-size: 16px">
            {{ item.ItemName }}
          </div>

          <template v-for="box in item.ChildrenList">
            <el-checkbox :label="box.ItemName" />
          </template>
        </div>
      </el-checkbox-group>
      <el-button
        type="primary"
        style="width: 150px; margin-top: 15px"
        @click="submit"
      >
        保存
      </el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import {
  getPlayItemsList,
  getPlayManagerItemsList,
  save,
} from "@/api/playmanageritems";
import { ElMessage, ElMessageBox } from "element-plus";

const submit = () => {
  if (managerItems.value.length == 0) {
    ElMessage.error("请选择服务内容");
    return;
  }

  save(managerItems.value).then((res) => {
    console.log(res);
    if (res.code) {
      ElMessage.success("成功");
    } else {
      ElMessage.error(res.msg);
    }
  });
};
const allItems = ref([]);
const managerItems = ref([]);

onMounted(() => {
  getAll();
  getItems();
});

const getAll = () => {
  getPlayItemsList().then((res) => {
    console.log(res);
    if (res.code) {
      allItems.value = res.data;
      console.log(allItems.value);
    }
  });
};
const getItems = () => {
  getPlayManagerItemsList().then((res) => {
    if (res.code) {
      managerItems.value = res.data;

      managerItems.value = managerItems.value.map((x) => x.ItemName);
      console.log(managerItems.value);
    }
  });
};
</script>
<style>
.el-checkbox-group div {
  font-size: 14px;
  /* display: block; */
  line-height: 30px;
}
.titel {
  padding: 20px 30px;
  border-bottom: 1px solid var(--el-border-color-light);
  margin-bottom: 20px;
}
.content {
  padding: 0px 30px;

  margin-bottom: 20px;
}
.box {
  margin-top: 20px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 10px;
  /* padding: 0px 0px 20px 10px; */
}
</style>
