<template>
  <div style="display: grid; grid-template-columns: 80px 1fr" v-if="play">
    <el-image
      style="
        border-radius: var(--el-border-radius-base);
        width: 80px;
        height: 80px;
        grid-row-start: 1;
        grid-row-end: 4;
      "
      :src="config.CONFIG_IMGURL + play.PicList[0]"
    />
    <div
      style="
        display: flex;
        justify-content: space-between;
        margin-left: 15px;
        align-items: center;
      "
    >
      <!-- <el-button link> -->
      <span
        style="font-size: medium; font-weight: bold; cursor: pointer"
        @click="dialogVisible = true"
      >
        {{ play.PlayName }}
      </span>
      <!-- </el-button> -->
      <slot name="title_button"></slot>
    </div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 15px;
        font-size: small;
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
    </div>
    <div
      style="
        display: flex;
        align-items: center;
        font-size: small;
        margin-left: 15px;
      "
    >
      <span v-for="item in play.PlayAmenitys" style="margin-right: 1em">
        {{ item }}
      </span>
    </div>
  </div>
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
import { defineProps, onMounted, ref } from "vue";
import type { Play } from "@/types/play";
import config from "@/utils/config";

const props = defineProps({
  play: {
    type: Object as () => Play,
  },
});

const divHeight = ref(750);
onMounted(() => {
  if (window.devicePixelRatio < 2) {
    divHeight.value = 750 / window.devicePixelRatio;
  }
});

onMounted(() => {
  //console.log(props.play?.PlayDetails);
  if (props.play) {
    props.play.TotalPrice = props.play.PlayDetails.reduce(
      (prev, cur) => prev + (cur.Price ?? 0),
      0
    );
    console.log(props.play.TotalPrice);
  }
});
const dialogVisible = ref(false);
</script>
<style scoped>
.white-text {
  color: white;
}
.div-center {
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
