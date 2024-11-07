<template>
  <el-button
    style="width: 100%"
    type="primary"
    size="large"
    @click="addPlay"
    v-if="!managerId"
  >
    新增项目
  </el-button>
  <template v-if="playList.length > 0">
    <el-card
      style="margin-top: 1em"
      shadow="never"
      v-for="(play, index) in playList"
    >
      <div style="display: grid; grid-template-columns: 100px 1fr">
        <el-image
          style="
            border-radius: var(--el-border-radius-base);
            width: 100px;
            height: 100px;
            grid-row-start: 1;
            grid-row-end: 4;
            cursor: pointer;
          "
          :src="config.CONFIG_IMGURL + play.PicList[0]"
          @click="showDialog(play)"
        />
        <div
          style="
            display: flex;
            justify-content: space-between;
            margin-left: 1em;
            align-items: center;
          "
        >
          <span style="font-size: x-large; font-weight: bold">
            {{ play.PlayName }}
          </span>
          <el-button-group v-if="!managerId">
            <el-button plain :icon="Edit" @click="editPlay(play)">
              编辑
            </el-button>
            <el-button plain :icon="Delete" @click="handelDelete(play)">
              删除
            </el-button>
          </el-button-group>
        </div>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-left: 1em;
          "
        >
          <div>
            <span
              v-for="item in play.PlayItems"
              style="color: var(--el-color-primary); margin-right: 1em"
            >
              {{ item }}
            </span>
          </div>
          <span style="font-weight: bold; color: #ff4e00">
            总价：{{ play.TotalPrice }}元
          </span>
        </div>
        <div style="display: flex; align-items: center">
          <span v-for="item in play.PlayAmenitys" style="margin-left: 1em">
            {{ item }}
          </span>
        </div>
      </div>
      <el-collapse
        v-model="activeNames"
        @change="handleChange"
        style="margin-top: 1em"
      >
        <el-collapse-item :name="index">
          <template #title>
            <span style="font-size: medium">套餐内容</span>
          </template>
          <div v-for="detail in play.PlayDetails" style="margin-top: 1em">
            <div style="display: flex; justify-content: space-between">
              <div style="display: flex">
                <el-text size="large" truncated style="width: 200px">
                  {{ detail.Name }}
                </el-text>
                <el-text size="large">
                  {{ detail.Number }}
                </el-text>
              </div>
              <div>
                <el-text size="large">{{ detail.Price }}元</el-text>
              </div>
            </div>
            <div>
              <el-text type="info">{{ detail.Notes }}</el-text>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </template>
  <el-empty v-else description="暂无服务内容" />
  <el-dialog
    v-model="dialogVisible"
    :show-close="false"
    fullscreen
    append-to-body
    destroy-on-close
    close-on-press-escape
    class="hotel-pic-dialog"
    style="background-color: rgba(0, 0, 0, 0.8)"
  >
    <el-row justify="center" v-if="play">
      <el-col :span="22">
        <div style="text-align: right">
          <el-button
            circle
            style="background-color: rgba(0, 0, 0, 0.8); border-color: white"
            @click="dialogVisible = false"
          >
            <el-icon color="white">
              <Close />
            </el-icon>
          </el-button>
        </div>

        <el-row style="margin-top: 20px" :gutter="30">
          <el-col :span="15">
            <el-carousel
              trigger="click"
              :autoplay="false"
              indicator-position="outside"
              ref="myCarousel"
              :height="`${divHeight}px`"
            >
              <el-carousel-item v-for="pic in play.PicList" class="div-center">
                <el-image :src="config.CONFIG_IMGURL + pic" fit="cover" />
              </el-carousel-item>
            </el-carousel>
          </el-col>

          <el-col :span="9">
            <el-scrollbar :max-height="`${divHeight}px`">
              <div>
                <div>
                  <el-text style="font-size: x-large" class="white-text">
                    {{ play.PlayName }}
                  </el-text>
                </div>

                <div style="margin-top: 2em">
                  <div>
                    <el-text class="white-text" size="large">
                      服务内容
                    </el-text>
                  </div>
                  <div style="margin-top: 1em">
                    <el-text
                      class="white-text"
                      style="margin-right: 1em"
                      v-for="item in play.PlayItems"
                    >
                      <el-icon><CircleCheck /></el-icon>
                      {{ item }}
                    </el-text>
                  </div>
                </div>

                <div style="margin-top: 2em">
                  <div>
                    <el-text class="white-text" size="large">
                      服务标签
                    </el-text>
                  </div>
                  <div style="margin-top: 1em">
                    <el-text
                      style="margin-right: 1em"
                      class="white-text"
                      v-for="item in play.PlayAmenitys"
                    >
                      <el-icon><CircleCheck /></el-icon>
                      {{ item }}
                    </el-text>
                  </div>
                </div>
                <div style="margin-top: 2em">
                  <el-text class="white-text">
                    {{ play.PlayIntroduction }}
                  </el-text>
                </div>
              </div>
            </el-scrollbar>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script lang="ts" setup>
import { Delete, Edit } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { getPlayList, deletePlay, getPlayListByManagerId } from "@/api/play";
import type { ResponsePlay, Play, PlayDetail } from "@/types/play";
import { useRouter } from "vue-router";
import config from "@/utils/config";
import { ElMessage, ElMessageBox } from "element-plus";

const props = defineProps<{
  managerId?: number;
}>();

const activeNames = ref<string[]>([]);
const handleChange = (val: string[]) => {
  activeNames.value = val;
};

const playList: Play[] = reactive([]);
onMounted(() => {
  console.log(props.managerId);
  let getPlays;
  if (props.managerId)
    getPlays = getPlayListByManagerId({ ManagerId: props.managerId });
  else getPlays = getPlayList();
  getPlays.then((res: any) => {
    console.log(res);
    if (res.code == 1) {
      res.data.forEach((element: ResponsePlay) => {
        const playDetailsU = JSON.parse(element.PlayDetails);
        const playItems = element.PlayItems.split(",");
        const playAmenitys = element.PlayAmenitys.split(",");
        const play: Play = {
          Id: element.Id,
          PlayName: element.PlayName,
          PicList: element.PicList,
          TotalPrice: element.TotalPrice,
          PlayDetails: playDetailsU,
          PlayItems: playItems,
          PlayAmenitys: playAmenitys,
          PlayIntroduction: element.PlayIntroduction,
        };
        playList.push(play);

        console.log(playList);
      });
    }
  });
});

const router = useRouter();
const addPlay = () => {
  router.push({ name: "AddPlay" });
};

const handelDelete = (play: Play) => {
  if (!play.Id) return;
  ElMessageBox.confirm("此操作将永久删除该套餐, 是否继续?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deletePlay({ Id: play.Id }).then((res: any) => {
        console.log(res);
        if (res.code == 1) {
          ElMessage.success("删除成功");
          playList.splice(playList.indexOf(play), 1);
        } else {
          ElMessage.error("删除失败");
        }
      });
    })
    .catch(() => {});
};

const editPlay = (play: Play) => {
  if (!play.Id) return;
  router.push({ name: "EditPlay", query: { id: play.Id } });
};

const dialogVisible = ref(false);
const play = ref();
const divHeight = ref(750);
onMounted(() => {
  if (window.devicePixelRatio < 2) {
    divHeight.value = 750 / window.devicePixelRatio;
  }
});

const showDialog = (p: Play) => {
  dialogVisible.value = true;
  play.value = p;
};
</script>
<style scoped>
.white-text {
  color: white;
}
</style>
