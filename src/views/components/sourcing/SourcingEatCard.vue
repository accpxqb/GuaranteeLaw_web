<template>
    <el-card
      v-bind="sourcing"
      class="greenHeaderCard"
      shadow="never"
      :body-style="{ padding: '10px' }"
    >
      <template #header>
        <slot name="cardHeader"></slot>
      </template>
      <div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="radius">
              <el-popover                
                placement="top-start"
                :width="300"
                trigger="hover"
                :content="`${sourcing.Destination},${sourcing.Keyword}`"
              >
                <template #reference>
                  <el-text class="text" truncated>
                    {{ "乐食地点" + `:${sourcing.Destination},${sourcing.Keyword}` }}
                  </el-text>
                </template>
              </el-popover>
           
            </div>
          </el-col>
  
          <el-col :span="6">
            <div class="radius">
              <el-text class="text">总预算: </el-text>
              <el-text class="text">{{ budgetStr }} </el-text>
            </div>
          </el-col>
  
          <el-col :span="6">
            <div class="radius">
              <el-text class="text">乐食人数: </el-text>
              <el-text class="text">{{ sourcing.NumberPeople + "人" }}</el-text>
            </div>
          </el-col>
        </el-row>
  
        <el-row :gutter="20" class="form-row">
            <el-col :span="8">
                <div class="radius">
                <el-text class="text">预定桌数: </el-text>
                <el-text class="text">{{ sourcing.NumberTables }}</el-text>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="radius">
                <el-text class="text">开始时间: </el-text>
                <el-text class="text">{{ BeginTimeStr }}</el-text>
                </div>
            </el-col>         
           
        </el-row>
  
     
        <el-row
          :gutter="20"
          class="form-row"
          align="middle"
          v-if="
          sourcing&&
            sourcing.Requirements &&
            sourcing.Requirements != '' &&
            sourcing.Requirements != '[]'
          "
        >
          <el-col :span="24">
            <el-text style="padding-left: 5px" class="text">更多服务:</el-text>
            <el-tag
              type="success"
              v-for="item in JSON.parse(sourcing.Requirements)"
              :key="item.value"
              style="margin-left: 10px"
            >
              {{ item.label }}
            </el-tag>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="form-row">
          <el-col :span="memoSpan">
            <div class="radius">
              <el-text class="text">{{ $t("sourcingList.Memo") }}: </el-text>
              <el-text class="text">{{ sourcing.Memo }}</el-text>
            </div>
          </el-col>
          <el-col :span="buttonSpan">
            <div ref="buttonColRef">
              <slot name="operationButton"></slot>
            </div>
          </el-col>
        </el-row>
      </div>
      <slot name="managerRes"></slot>
    </el-card>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  
  const props = defineProps({
    sourcing: {
      type: Object,
    },
  });
  
  const buttonColRef = ref();
  const memoSpan = ref(20);
  const buttonSpan = ref(4);
  onMounted(() => {     
    if (buttonColRef.value.childElementCount <= 0) {
      memoSpan.value = 24;
      buttonSpan.value = 0;
    }
  });
  
  const BeginTimeStr = computed(() => {
    if (props.sourcing.BeginTime) {
      if (props.sourcing.BeginTime.toString().substring(11, 19) == "00:00:00") {
        return props.sourcing.BeginTime.toString().substring(0, 10);
      }
      return props.sourcing.BeginTime.toString().replace("T", " ");
    }
  
    return "";
  });
  
   
  
  
  const budgetStr = computed(() => {
    return props.sourcing.Budget == null || props.sourcing.Budget == 0
      ? "不限"
      : props.sourcing.Budget + "元";
  });
  </script>
  
  <style scoped>
  .form-row {
    margin-top: 10px;
  }
  
  .el-card {
    border-radius: 15px;
  }
  
  .greenHeaderCard :deep(.el-card__header) {
    background-color: #27ae60;
  }
  
  .radius {
    height: 20px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    /* font-weight: bold; */
    line-height: 20px;
    padding: 7px;
  }
  
  .text {
    font-size: small;
  }
  </style>
  