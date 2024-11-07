<template>
  <el-card
    style="margin-top: 20px; border: none; background-color: white"
    :body-style="{ padding: '0px' }"
    shadow="never"
  >
    <el-space
      direction="vertical"
      :size="20"
      :fill="true"
      style="width: 100%"
      v-if="manager"
    >
      <div class="manager-card" shadow="never">
        <div style="display: flex">
          <div class="manager-card-tag">
            <el-image
              :src="lewan"
              style="width: 1em; height: 1em; margin-right: 0.5em"
            ></el-image>
            乐玩
          </div>
        </div>
        <div class="info-card">
          <div>
            <el-image
              :src="config.CONFIG_IMGURL + manager.PhotoPath"
              :zoom-rate="1.2"
              :preview-src-list="picList"
              fit="cover"
              style="height: 130px; width: 130px; border-radius: 100px"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
          </div>

          <div style="margin-left: 1em; flex: auto">
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              "
            >
              <span style="font-size: x-large"
                >{{ manager.FullName }}
                <ManagerLevel :integral="managerScore.Integral"> </ManagerLevel
              ></span>

              <el-button type="primary" @click="isShow = !isShow">
                {{ t("ManagerDetailVue.Send") }}
              </el-button>
            </div>
            <div style="margin-top: 0.5em">
              <span style="font-size: medium">
                {{ t("ManagerDetailVue.PositiveRate") }}
                {{ goodRate }}
                %
              </span>
              <span style="font-size: medium; margin-left: 1em">
                已服务{{
                  managerScore ? managerScore?.CumulativePersonnel : 0
                }}位客户
              </span>
            </div>
            <div style="margin-top: 0.5em">
              <el-text>
                {{
                  manager.PersonalProfile ? manager.PersonalProfile : "暂无简介"
                }}
              </el-text>
            </div>
          </div>
        </div>
      </div>

      <PlaySourcingForm
        v-if="isShow"
        :manager-id="managerId"
      ></PlaySourcingForm>

      <el-card shadow="never" style="color: var(--el-text-color-primary)">
        <el-row>
          <div style="line-height: 20px">
            评价 ({{ managerScore?.ScoringTimes }}位客户真实评价)
          </div>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="4">
            <el-row>
              <div class="pj_font">{{ totalScore > 4 ? "很好" : "一般" }}</div>
            </el-row>
            <el-row>
              <div class="pj_font" style="font-size: 30px">
                {{ totalScore }}
              </div>
            </el-row>
          </el-col>
          <el-col :span="4"></el-col>
          <el-col :span="8">
            <el-row>
              <div class="pj_percentage_font">创意</div>
            </el-row>
            <el-row>
              <div class="demo-progress">
                <el-progress
                  :percentage="originalityScore * 20"
                  :format="format"
                />
              </div>
            </el-row>
            <el-row>
              <div class="pj_percentage_font">服务态度</div>
            </el-row>
            <el-row>
              <div class="demo-progress">
                <el-progress :percentage="serviceScore * 20" :format="format" />
              </div>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <div class="pj_percentage_font">性价比</div>
            </el-row>
            <el-row>
              <div class="demo-progress">
                <el-progress
                  :percentage="costPerformanceScore * 20"
                  :format="format"
                />
              </div>
            </el-row>
          </el-col>
        </el-row>
      </el-card>

      <el-row>
        <ManagerComment
          :manager-id="managerId"
          :manager-type="managerType"
        ></ManagerComment>
      </el-row>

      <div class="demoTitle">服务内容</div>
      <div>
        <PlayList :manager-id="managerId"></PlayList>
      </div>
    </el-space>
  </el-card>
</template>
<script lang="ts" setup>
import { getManager } from "../../../api/user";
import ManagerComment from "../components/ManagerComment.vue";
import PlayList from "@/views/play_manager/PlayList.vue";
import { ref, onMounted, computed, reactive } from "vue";
import config from "../../../utils/config";
import { useI18n } from "vue-i18n";
import PlaySourcingForm from "../components/PlaySourcingForm.vue";
import lewan from "../../../assets/images/homepage-menu-icon/乐玩选中@2x.png";

const { t } = useI18n();

const format = (percentage: any) => `${(percentage / 20).toFixed(2)}`;

const props = defineProps<{
  managerId: number;
  managerType: number;
}>();

const picList: any[] = reactive([]);
const manager = ref();
const managerScore = ref();
const isShow = ref(false);

onMounted(() => {
  if (props.managerId != 0) {
    getManager({
      ManagerId: props.managerId,
      ManagerType: props.managerType,
    }).then((res: any) => {
      if (res.code == 1) {
        manager.value = res.data;
        managerScore.value = manager.value?.ManagerScorePlayInfo;
        const extend = manager.value?.usersExtends.find(
          (item: any) => item.ManagerType == props.managerType
        );
        manager.value.PhotoPath = extend.PhotoImg;
        manager.value.PersonalProfile = extend.PersonalProfile;
        manager.value.LifePicList.forEach((item: any) => {
          picList.push(item.Url);
        });
      }
    });
  }
});

const goodRate = computed(() => {
  if (managerScore.value && typeof managerScore.value == "object") {
    return Math.round(
      (100 * managerScore.value.PositiveNumber) /
        managerScore.value.ScoringTimes
    );
  } else {
    return 0;
  }
});

//计算评分
const totalScore = computed(() => {
  if (managerScore.value && typeof managerScore.value == "object") {
    return Number(
      (
        managerScore.value.TotalScore /
        managerScore.value.ScoringTimes /
        3
      ).toFixed(2)
    );
  } else {
    return 0;
  }
});

const originalityScore = computed(() => {
  if (managerScore.value && typeof managerScore.value == "object") {
    return Number(
      (
        managerScore.value.Originality / managerScore.value.ScoringTimes
      ).toFixed(2)
    );
  } else {
    return 0;
  }
});

const serviceScore = computed(() => {
  if (managerScore.value && typeof managerScore.value == "object") {
    return Number(
      (
        managerScore.value.ServiceAttitude / managerScore.value.ScoringTimes
      ).toFixed(2)
    );
  } else {
    return 0;
  }
});

const costPerformanceScore = computed(() => {
  if (managerScore.value && typeof managerScore.value == "object") {
    return Number(
      (
        managerScore.value.CostPerformance / managerScore.value.ScoringTimes
      ).toFixed(2)
    );
  } else {
    return 0;
  }
});
</script>
<style scoped>
@import "../../../styles/client/homepage.css";

.demoTitle {
  height: 50px;
  background-color: #27ae60;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  color: white;
  max-width: 100%;
  text-align: center;
  font-size: 20px;
  line-height: 50px;
}

.pj_font {
  width: 100%;
  text-align: center;
  line-height: 40px;
}

.pj_percentage_font {
  text-align: left;
  font-size: 16px;
}

.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 300px;
}

.manager-card {
  background-color: #f1f8fc;
  border-radius: 4px;
  border: #00a8f4 solid 1px;
}

.info-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1em;
}

.manager-card-tag {
  background-color: #00a8f4;
  border-radius: 0 0 4px 0;
  padding: 0.5em 1em 0.5em 1em;
  color: white;
  display: flex;
  align-items: center;
}
</style>
