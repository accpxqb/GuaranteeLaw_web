<template>
  <SourcingPlayCard :sourcing="sourcing" v-loading="loading">
    <template #cardHeader>
      <div class="card-header">
        <span style="color: white">
          {{ "发布时间" + ": " + sourcing.CreateTime }}
        </span>
      </div>
    </template>
    <template #managerRes>
      <div class="title_div">
        <el-text tag="b" size="large">推荐服务</el-text>
        <el-select
          placeholder="请选择服务"
          v-model="selectedPlayList"
          multiple
          style="width: 300px"
          value-key="PlayId"
          :disabled="modified"
          @change="playChange"
        >
          <el-option
            v-for="item in playList"
            :key="item.Id"
            :label="item.PlayName"
            :value="item"
          />
        </el-select>
      </div>
      <el-card
        shadow="never"
        v-for="item in selectedPlayList"
        :key="item"
        style="margin-top: 1em"
      >
        <PlayInfo :play="item">
          <template #title_button>
            <el-button @click="editPlay(item)" size="small">修改</el-button>
          </template>
        </PlayInfo>
        <el-divider></el-divider>
        <PlayDetails :play-details="item.PlayDetails"></PlayDetails>
        <div
          style="
            margin-top: 1em;
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="width: 200px">
            <el-date-picker
              v-model="item.TimeRange"
              type="datetimerange"
              range-separator="—"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
              :editable="false"
              :clearable="false"
              format="YYYY-MM-DD HH:mm"
              :disabled-date="disabledDate"
              @change="timeChange"
            />
          </div>

          <span style="font-size: large; font-weight: bold; color: #ff4e00">
            总价：{{ item.TotalPrice }}元
          </span>
        </div>
      </el-card>
      <el-button
        type="primary"
        style="margin-top: 1em; width: 100%"
        @click="saveToDB"
        v-show="selectedPlayList.length > 0"
      >
        发送客户
      </el-button>
      <div style="margin-bottom: 100px"></div>
    </template>
  </SourcingPlayCard>

  <el-dialog v-model="showEditDialog" top="5vh" destroy-on-close>
    <el-alert
      :title="`客户留言：${currentPlay?.ModificationNotes}`"
      type="error"
      show-icon
      :closable="false"
      style="margin-bottom: 1em"
      v-if="currentPlay?.ModificationNotes"
    />
    <PlayServiceForm
      :play="currentPlay"
      :save-form="saveForm"
      :back-func="closeDialog"
    ></PlayServiceForm>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { getPlayDeal } from "@/api/deal";
import { useRouter } from "vue-router";
import SourcingPlayCard from "../components/sourcing/SourcingPlayCard.vue";
import { ElMessage } from "element-plus";
import { getPlayList } from "@/api/play";
import type { Play, ResponsePlay, PlayProperty } from "@/types/play";
import PlayInfo from "../components/play/PlayInfo.vue";
import PlayDetails from "../components/play/PlayDetails.vue";
import PlayServiceForm from "./PlayServiceForm.vue";
import {
  editSourcingProperty,
  getNeedModifyProperty,
} from "@/api/sourcing_play";

const router = useRouter();
const sourcing = ref<any>({});
const sourcingId = ref();
const modified = ref(false);

const loading = ref(true);
onMounted(() => {
  sourcingId.value = router.currentRoute.value.query.sourcingId;
  modified.value = Number(router.currentRoute.value.query.IsModification) >= 1;
  const funcs = [getPlayListData()];
  if (sourcingId.value) funcs.push(getDealInfo());
  if (modified.value && sourcingId.value) funcs.push(getNeedModify());
  Promise.all(funcs).then(() => {
    setTimeout(() => {
      loading.value = false;
    }, 300);
  });
});

/**
 * 获取需求明细
 */
const getDealInfo = () => {
  getPlayDeal({ sourcingId: sourcingId.value })
    .then((res: any) => {
      if ((res.code = 1)) {
        sourcing.value = res.data.SourcingPlayInfo;
        sourcing.value.CreateTime = sourcing.value.CreateTime.substring(
          0,
          16
        ).replace("T", " ");
      }
      if (res.code == 0) {
        ElMessage.error(res.msg);
        router.push({ name: "PlayDealList" });
      }
    })
    .finally(() => {
      return Promise.resolve();
    });
};

/**获取需要修改的列表 */
const getNeedModify = () => {
  getNeedModifyProperty({ sourcingId: sourcingId.value })
    .then((res: any) => {
      if (res.code == 1) {
        console.log("sourcing", sourcing.value);
        res.data.forEach((element: any) => {
          const playDetails = JSON.parse(element.PlayDetails);
          const playItems = element.PlayItems.split(",");
          const playAmenitys = element.PlayAmenitys.split(",");
          const play: PlayProperty = {
            Id: element.Id,
            PlayId: element.PlayId,
            PlayName: element.PlayName,
            PicList: element.Urls,
            TotalPrice: element.TotalPrice,
            PlayIntroduction: element.PlayIntroduction,
            ModificationNotes: element.ModificationNotes,
            PlayDetails: playDetails,
            PlayItems: playItems,
            PlayAmenitys: playAmenitys,
            BeginTime: element.BeginTime,
            EndTime: element.EndTime,
            TimeRange: [element.BeginTime, element.EndTime],
          };
          selectedPlayList.value.push(play);
        });
        console.log("res", selectedPlayList.value);
      }
    })
    .finally(() => {
      return Promise.resolve();
    });
};

/**
 * 获取服务列表
 */
const playList: Play[] = reactive([]);
const selectedPlayList = ref<PlayProperty[]>([]);
const getPlayListData = () => {
  getPlayList()
    .then((res: any) => {
      if (res.code == 1) {
        res.data.forEach((element: ResponsePlay) => {
          playList.push(initPlay(element));
        });
      }
    })
    .finally(() => {
      return Promise.resolve();
    });
};

const initPlay = (element: ResponsePlay) => {
  const playDetails = JSON.parse(element.PlayDetails);
  const playItems = element.PlayItems.split(",");
  const playAmenitys = element.PlayAmenitys.split(",");
  return {
    Id: element.Id,
    PlayId: element.Id,
    PlayName: element.PlayName,
    PicList: element.PicList,
    TotalPrice: element.TotalPrice,
    PlayDetails: playDetails,
    PlayItems: playItems,
    PlayAmenitys: playAmenitys,
    PlayIntroduction: element.PlayIntroduction,
  };
};

//服务选择事件
const playChange = (val: any) => {
  console.log("in");
  const last = val[val.length - 1];
  last.BeginTime = sourcing.value.BeginTime;
  last.EndTime = sourcing.value.EndTime;
  last.TimeRange = [
    new Date(sourcing.value.BeginTime),
    new Date(sourcing.value.EndTime),
  ];
};

/**
 * 服务弹窗
 */
const showEditDialog = ref(false);
const currentPlay = ref<PlayProperty>();
const editPlay = (val: PlayProperty) => {
  console.log(val);
  currentPlay.value = val;
  showEditDialog.value = true;
};

const closeDialog = () => {
  showEditDialog.value = false;
};

/**
 * 传给playServiceForm的保存方法
 */
const saveForm = (val: PlayProperty) => {
  //替换
  const index = selectedPlayList.value.findIndex((item) => item.Id === val.Id);
  if (index !== -1) {
    val.Id = selectedPlayList.value[index].Id;
    val.PlayId = selectedPlayList.value[index].PlayId;
    val.ModificationNotes = selectedPlayList.value[index].ModificationNotes;
    val.BeginTime = selectedPlayList.value[index].BeginTime;
    val.EndTime = selectedPlayList.value[index].EndTime;
    val.TimeRange = selectedPlayList.value[index].TimeRange;
    console.log("val", val);
    selectedPlayList.value.splice(index, 1, val);
  }
  showEditDialog.value = false;
};

/**
 * 保存到数据库
 */
const submitting = ref(false);
const saveToDB = () => {
  const timeZone = new Date().getTimezoneOffset() / 60;
  const submitData = selectedPlayList.value.map((element) => {
    const idTemp = element.Id;
    delete element.Id;
    return {
      ...element,
      sourcingId: sourcingId.value,
      propertyId: modified.value ? idTemp : 0,
      BeginTime: new Date(
        new Date(element.TimeRange![0]).getTime() - timeZone * 60 * 60 * 1000
      ),
      EndTime: new Date(
        new Date(element.TimeRange![1]).getTime() - timeZone * 60 * 60 * 1000
      ),
    };
  });
  console.log(submitData);
  submitting.value = true;
  //return;
  editSourcingProperty(submitData)
    .then((res: any) => {
      if (res.code == 1) {
        ElMessage.success("接单成功");
        router.push({ name: "PlayDealList" });
      }else{
        ElMessage.error(res.msg);
      }
    })
    .finally(() => {
      submitting.value = false;
    });
};

//time must be greater than or equal today
const disabledDate = (time: { getTime: () => number }) => {
  const date = new Date();
  const millisecond =
    date.getHours() * 60 * 60 * 1000 +
    date.getMinutes() * 60 * 1000 +
    date.getSeconds() * 1000 +
    date.getMilliseconds();
  return time.getTime() < Date.now() - millisecond;
};

//时间选择
const timeChange = (val: any) => {
  console.log(val);
};
</script>
<style scoped>
.title_div {
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 0.5em;
}
:deep(.el-select__tags-text) {
  color: var(--el-color-primary);
  font-weight: bold;
}
</style>
