<template>
  <el-card class="homepage-card" v-bind="manager" shadow="never">
    <div style="display: flex; align-items: center">
      <div style="width: 120px; height: 120px">
        <el-avatar
          style="width: 120px; height: 120px"
          shape="square"
          :src="config.CONFIG_IMGURL + '/' + manager.PhotoPath"
        >
          <img
            src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
          />
        </el-avatar>
      </div>
      <div style="margin-left: 20px; flex: auto">
        <div style="display: flex; justify-content: space-between">
          <div style="display: flex; align-items: center">
            <span style="font-weight: bold">
              {{ manager.FullName }}
            </span>
            <ManagerLevel
              :integral="manager.ManagerScoreInfo.Integral"
              style="margin-left: 10px"
            ></ManagerLevel>
          </div>
          <el-tag size="large" type="success" effect="dark">
            {{ rating }}分
          </el-tag>
        </div>
        <div
          style="display: flex; justify-content: space-between; margin-top: 5px"
        >
          <div>
            <span style="font-size: 14px">好评率{{ goodRate }}%</span>
            <span style="font-size: 14px; margin-left: 10px">
              {{
                `已服务${manager.ManagerScoreInfo.CumulativePersonnel}位客户`
              }}
            </span>
          </div>
          <el-link type="success" :underline="false" @click="toDetail(manager)">
            {{ "查看详情>" }}
          </el-link>
        </div>
        <div style="margin-top: 5px">
          <el-text v-if="manager.PersonalProfile" class="profile-text profile">
            {{ manager.PersonalProfile }}
          </el-text>
          <span v-else class="profile-text null-profile"> 暂无简介 </span>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import type { Manager } from "@/types/manager";
import { computed } from "vue";
import { useRouter } from "vue-router";
import config from "@/utils/config";
import { BusinessType } from "@/utils/enums";

interface Props {
  manager: Manager;
}
const props = defineProps<Props>();

const router = useRouter();
const toDetail = (item: Manager) => {
  const extend = item.usersExtends[0] as any;
  const type = extend?.ManagerType;
  var path = router.resolve({
    path: "/homepageManager",
    query: {
      managerId: item.Id,
      managerType: type,
    },
  });
  window.open(path.href, "_blank");
};
const goodRate = computed(() => {
  if (
    !props.manager ||
    !props.manager.ManagerScoreInfo ||
    !props.manager.ManagerScoreInfo.ScoringTimes
  )
    return 0;
  if (
    props.manager.ManagerScoreInfo.PositiveNumber === 0 ||
    props.manager.ManagerScoreInfo.ScoringTimes === 0
  )
    return 0;
  return Math.round(
    (props.manager.ManagerScoreInfo.PositiveNumber /
      props.manager.ManagerScoreInfo.ScoringTimes) *
      100
  );
});

const rating = computed(() => {
  const extend = props.manager.usersExtends[0] as any;
  const type = extend.ManagerType;
  let count = 4;
  if (type == BusinessType.hotel || type == BusinessType.eat) count = 4;
  else if (type == BusinessType.play) count = 3;
  if (
    !props.manager ||
    !props.manager.ManagerScoreInfo ||
    !props.manager.ManagerScoreInfo.ScoringTimes
  )
    return 0;
  if (
    props.manager.ManagerScoreInfo.TotalScore === 0 ||
    props.manager.ManagerScoreInfo.ScoringTimes === 0
  )
    return 0;
  return (
    props.manager.ManagerScoreInfo.TotalScore /
    props.manager.ManagerScoreInfo.ScoringTimes /
    count
  ).toFixed(2);
});
</script>
<style scoped>
@import "@/styles/client/homepage.css";

.description-span {
  font-size: small;
  color: #666;
}

.el-descriptions :deep(.el-descriptions__body) {
  background-color: #f5f5f5;
}
.profile {
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 3;
  text-overflow: ellipsis;
}
.null-profile {
  display: inline-block;
  height: 3em;
}
.profile-text {
  font-size: small;
  color: #666;
}
</style>
