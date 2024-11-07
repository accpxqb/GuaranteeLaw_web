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
      <div class="manager-card">
        <div style="display: flex">
          <div class="manager-card-tag">
            <el-image
              :src="lezhu"
              style="width: 1em; height: 1em; margin-right: 0.5em"
            ></el-image>

            乐住
          </div>
        </div>
        <div style="" class="info-card">
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
                <ManagerLevel :integral="manager.ManagerScoreInfo.Integral">
                </ManagerLevel
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
                  (manager.PersonalProfile ??=
                    "" == "" ? manager.PersonalProfile : "暂无简介")
                }}
              </el-text>
            </div>
          </div>
        </div>
      </div>

      <CreateSourcingForm
        v-if="isShow"
        :ManagerId="props.managerId"
      ></CreateSourcingForm>

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
              <div class="pj_percentage_font">环境</div>
            </el-row>
            <el-row>
              <div class="demo-progress">
                <el-progress
                  :percentage="environmentalScore * 20"
                  :format="format"
                />
              </div>
            </el-row>
            <el-row>
              <div class="pj_percentage_font">服务</div>
            </el-row>
            <el-row>
              <div class="demo-progress">
                <el-progress :percentage="serviceScore * 20" :format="format" />
              </div>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <div class="pj_percentage_font">卫生</div>
            </el-row>
            <el-row>
              <div class="demo-progress">
                <el-progress :percentage="healthScore * 20" :format="format" />
              </div>
            </el-row>
            <el-row>
              <div class="pj_percentage_font">设施</div>
            </el-row>
            <el-row>
              <div class="demo-progress">
                <el-progress
                  :percentage="facilityScore * 20"
                  :format="format"
                />
              </div>
            </el-row>
          </el-col>
        </el-row>
      </el-card>

      <el-row>
        <ManagerComment
          :manager-id="props.managerId"
          :manager-type="props.managerType"
        ></ManagerComment>
      </el-row>

      <div class="demoTitle">
        {{
          //@ts-ignore
          t("ManagerDetailVue.ScopeServices")
        }}
      </div>
      <div>
        <HotelList :user-id="props.managerId"></HotelList>
      </div>
    </el-space>
  </el-card>
</template>
<script lang="ts" setup>
import type { Manager, ManagerScoreInfo } from "@/types/manager";
import { getManager } from "../../../api/user";
import HotelList from "./HomepageHotelList.vue";
import CreateSourcingForm from "./CreateSourcingForm.vue";
import ManagerComment from "./ManagerComment.vue";
import { ref, onMounted, computed, reactive } from "vue";
import { ElMessage } from "element-plus";
import config from "../../../utils/config";
import { useI18n } from "vue-i18n";
import lezhu from "../../../assets/images/homepage-menu-icon/乐住选中@2x.png";

const { t } = useI18n();

const format = (percentage: any) => `${(percentage / 20).toFixed(2)}`;

const props = defineProps<{
  managerId: number;
  managerType: number;
}>();

const picList: any[] = reactive([]);
const manager = ref();
const managerScore = ref<ManagerScoreInfo>();
const isShow = ref(false);

onMounted(() => {
  if (props.managerId != 0) {
    getManager({
      ManagerId: props.managerId,
      ManagerType: props.managerType,
    }).then((res: any) => {
      if (res.code == 1) {
        manager.value = res.data;
        // console.log(manager.value);
        managerScore.value = manager.value?.ManagerScoreInfo;
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
    console.log(
      managerScore.value.TotalScore / managerScore.value.ScoringTimes / 4
    );
    return Number(
      (
        managerScore.value.TotalScore /
        managerScore.value.ScoringTimes /
        4
      ).toFixed(2)
    );
  } else {
    return 0;
  }
});

const healthScore = computed(() => {
  if (managerScore.value && typeof managerScore.value == "object") {
    return Number(
      (
        managerScore.value.HealthScore / managerScore.value.ScoringTimes
      ).toFixed(2)
    );
  } else {
    return 0;
  }
});

const facilityScore = computed(() => {
  if (managerScore.value && typeof managerScore.value == "object") {
    return Number(
      (
        managerScore.value.FacilityScore / managerScore.value.ScoringTimes
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
        managerScore.value.ServiceScore / managerScore.value.ScoringTimes
      ).toFixed(2)
    );
  } else {
    return 0;
  }
});

const environmentalScore = computed(() => {
  if (managerScore.value && typeof managerScore.value == "object") {
    return Number(
      (
        managerScore.value.EnvironmentalScore / managerScore.value.ScoringTimes
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
  background-color: #fff5ec;
  border-radius: 4px;
  border: #fc7e00 solid 1px;
}

.info-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1em;
}

.manager-card-tag {
  background-color: #fc7e00;
  border-radius: 0 0 4px 0;
  padding: 0.5em 1em 0.5em 1em;
  color: white;
  display: flex;
  align-items: center;
}
</style>
