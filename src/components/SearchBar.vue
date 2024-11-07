<template>
  <el-row align="middle" style="margin-top: 20px">
    <el-col :span="4">
      <a href="/">
        <el-image
          :src="logo"
          fit="fill"
          :style="{ height: `${logoHeight}px`, width: `${logoWidth}px` }"
        />
      </a>
    </el-col>
    <el-col :span="20">
      <el-row class="search-row" align="middle">
        <el-col :span="21" style="padding-left: 10px">
          <!-- <el-select v-model="pageRequest.Name" :placeholder="$t('searchbarVue.Default')" filterable remote
                        :remote-method="remoteMethod" :loading="loading" style="width: 100%;" @change="handleSelected">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select> -->
          <el-input
            v-model="pageRequest.Name"
            :placeholder="$t('searchbarVue.Default')"
            class="input-no-border"
            v-click-outside="onClickOutside"
            ref="inputRef"
            clearable
            maxlength="4"
          />
          <el-popover
            placement="bottom-start"
            :width="400"
            teleported
            :show-arrow="false"
            popper-style="padding:0"
            ref="popoverRef"
            :virtual-ref="inputRef"
            trigger="click"
            virtual-triggering
            v-if="searchHistory.history.length > 0"
          >
            <el-table
              :data="searchHistory.history"
              style="width: 100%"
              :show-header="false"
              v-if="searchHistory.history.length > 0"
            >
              <el-table-column width="300">
                <template #default="scope">
                  <div @click="pageRequest.Name = scope.row.name">
                    <el-text>
                      <el-icon>
                        <Clock />
                      </el-icon>
                      {{ scope.row.name }}
                    </el-text>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="right">
                <template #default="scope">
                  <el-button
                    size="small"
                    @click="deleteHistory(scope.row)"
                    link
                  >
                    <el-icon>
                      <Close />
                    </el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-popover>
        </el-col>
        <el-col :span="3" style="padding-right: 5px">
          <el-button
            type="success"
            round
            size="large"
            style="width: 100%"
            @click="toSearchPage"
          >
            {{ $t("searchbarVue.SearchBtn") }}
          </el-button>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, unref } from "vue";
import { useDevicePixelRatio } from "@vueuse/core";
import logo from "@/assets/images/logo.png";
import { getManagerByName } from "@/api/user";
import type { PageRequest } from "@/types/page-request";
import { getFullName } from "@/utils/helper";
import { useRouter } from "vue-router";
import { useSearchHistoryStore, useSearchStore } from "@/stores/counter";
import { ClickOutside as vClickOutside } from "element-plus";

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
});
const inputRef = ref();
const popoverRef = ref();

const onClickOutside = () => {
  if (searchHistory.history.length > 0)
    unref(popoverRef).popperRef?.delayHide?.();
};

interface ManagerPageRequest extends PageRequest {
  Name?: string;
  Rating: number;
}
const pageRequest: ManagerPageRequest = reactive({
  Rating: 0,
  PastPage: 0,
  CurrentPage: 1,
  PageSize: 10,
});

const logoHeight = ref();
const logoWidth = ref();
const { pixelRatio } = useDevicePixelRatio(); //same as window.devicePixelRatio

const searchStore = useSearchStore();
const searchHistory = useSearchHistoryStore();
onMounted(() => {
  if (!isEmpty(searchStore.name)) {
    pageRequest.Name = searchStore.name;
  }
  if (window.devicePixelRatio < 2) {
    logoHeight.value = 55 / pixelRatio.value;
    logoWidth.value = 188 / pixelRatio.value;
  }
});

//判断是否是空字符串
function isEmpty(str: any) {
  if (str === null) return true;
  if (str === undefined || str === "undefined") return true;
  if (str === "") return true;
  return false;
}

const loading = ref(false);
const options = ref();
const remoteMethod = (query: string) => {
  //判断键盘输入的值是否为空
  if (query && query !== "") {
    loading.value = true;
    //判断键盘输入的值是否为中文
    if (/[\u4e00-\u9fa5]/.test(query)) {
      loading.value = false;
      pageRequest.Name = query;
      searchStore.name = query;
      //调用接口
      getManagerByName(pageRequest).then((res) => {
        options.value = res.data.map((item: any) => {
          return {
            value: item.Id,
            label: getFullName(item),
          };
        });
      });
    } else {
      loading.value = false;
      options.value = [];
    }
  }
};

const router = useRouter();
const handleSelected = (value: string) => {
  var path = router.resolve({
    path: "/homepageManager",
    query: { managerId: value },
  });
  searchStore.name = options.value.find(
    (item: any) => item.value === value
  ).label;
  pageRequest.Name = searchStore.name;
  window.open(path.href, "_blank");
};

const toSearchPage = () => {
  searchStore.name = pageRequest.Name ?? "";
  if (!isEmpty(searchStore.name)) {
    //查找历史中和现在输入的值是否相同
    let index = searchHistory.history.findIndex(
      (item: any) => item.name === pageRequest.Name
    );
    if (index !== -1) {
      //删除相同的值
      searchHistory.history.splice(index, 1);
    }
    if (searchHistory.history.length >= 10) {
      searchHistory.history.pop();
    }
    searchHistory.history.unshift({ name: pageRequest.Name, date: new Date() });
  }
  router.push({ name: "SearchManager", query: { name: pageRequest.Name,ManagerType:props.type } });
};

const deleteHistory = (row: {}) => {
  //删除row
  searchHistory.history.splice(searchHistory.history.indexOf(row), 1);
};
</script>

<style scoped>
.search-row {
  border: 2px solid #00a634;
  border-radius: 25px;
  padding-top: 4px;
  padding-bottom: 4px;
}

.input-no-border :deep(.el-input__wrapper) {
  background-color: #ffffff;
  box-shadow: 0 0 0 0;
}

.el-select {
  --el-select-border-color-hover: none;
  --el-select-input-focus-border-color: none;
}

.el-select :deep(.el-input__wrapper) {
  border: none;
  box-shadow: none;
  font-size: 16px;
}

.el-select :deep(.el-input__inner) {
  cursor: text;
}

:deep(.el-table__inner-wrapper::before) {
  height: 0 !important;
}

.el-table :deep(.el-table__cell) {
  border: none !important;
}
</style>
