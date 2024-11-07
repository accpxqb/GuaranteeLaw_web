<template>
  <div style="display: flex; align-items: center" :v-if="eat">
    <el-image
      style="
        border-radius: var(--el-border-radius-base);
        width: 80px;
        height: 80px;
        cursor: pointer;
      "
      :src="config.CONFIG_IMGURL + eat.PackagePicList[0]"
      @click="dialogVisible = true"
    />
    <div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-left: 15px;
          align-items: center;
        "
      >
        <span
          style="font-size: medium; font-weight: bold; cursor: pointer"
          @click="dialogVisible = true"
        >
          <template v-if="eat.OrderNo">
            {{ `${eat.Banquet.Name}·${eat.PackageName}（${eat.Number}桌）` }}
          </template>
          <template v-else>{{ eat.PackageName }}</template>
        </span>
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          font-size: small;
          margin-left: 15px;
          margin-top: 1em;
        "
      >
        <span
          v-for="item in eat.PackageAmenitys"
          style="margin-right: 1em; color: #00a634"
        >
          {{ item }}
        </span>
      </div>
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
    <el-row justify="center" v-if="eat">
      <el-col :span="22">
        <el-row>
          <el-col :span="15" style="text-align: center">
            <el-radio-group v-model="radioPic" size="large" class="pic-radio">
              <el-radio-button label="饭店照片" />
              <el-radio-button label="套餐照片" />
            </el-radio-group>
          </el-col>
          <el-col :span="9" style="text-align: right">
            <el-button
              circle
              style="background-color: rgba(0, 0, 0, 0.8); border-color: white"
              @click="dialogVisible = false"
            >
              <el-icon color="white">
                <Close />
              </el-icon>
            </el-button>
          </el-col>
        </el-row>

        <el-row style="margin-top: 20px" :gutter="30">
          <el-col :span="15">
            <el-carousel
              trigger="click"
              :autoplay="false"
              indicator-position="outside"
              ref="myCarousel"
              :height="`${divHeight}px`"
            >
              <template v-if="radioPic == '饭店照片'">
                <el-carousel-item
                  v-for="pic in eat.Banquet.PicList"
                  class="div-center"
                >
                  <el-image :src="config.CONFIG_IMGURL + pic.Url" fit="cover" />
                </el-carousel-item>
                <el-carousel-item name="mapItem">
                  <Map
                    :fcenter="eat.Banquet.LongitudeLatitude"
                    :style="{ height: divHeight + 'px' }"
                  ></Map>
                </el-carousel-item>
              </template>
              <template v-if="radioPic == '套餐照片'">
                <el-carousel-item
                  v-for="pic in eat.PackagePicList"
                  class="div-center"
                >
                  <el-image :src="config.CONFIG_IMGURL + pic" fit="cover" />
                </el-carousel-item>
              </template>
            </el-carousel>
          </el-col>

          <el-col :span="9" v-if="radioPic == '套餐照片'">
            <el-scrollbar :max-height="`${divHeight}px`">
              <div>
                <div>
                  <el-text style="font-size: x-large" class="white-text">
                    {{ eat.PackageName }}
                  </el-text>
                </div>

                <!-- <div style="margin-top: 2em">
                  <div>
                    <el-text class="white-text" size="large">
                      服务内容
                    </el-text>
                  </div>
                  <div style="margin-top: 1em">
                    <el-text class="white-text" style="margin-right: 1em" v-for="item in play.PlayItems">
                      <el-icon>
                        <CircleCheck />
                      </el-icon>
                      {{ item }}
                    </el-text>
                  </div>
                </div> -->

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
                      v-for="item in eat.PackageAmenitys"
                    >
                      <el-icon>
                        <CircleCheck />
                      </el-icon>
                      {{ item }}
                    </el-text>
                  </div>
                </div>
                <div style="margin-top: 2em">
                  <div>
                    <el-text class="white-text" size="large">
                      订购须知
                    </el-text>
                  </div>
                  <div style="margin-top: 1em">
                    <el-text class="white-text">
                      {{ eat.PackageIntroduction }}
                    </el-text>
                  </div>
                </div>
              </div>
            </el-scrollbar>
          </el-col>
          <el-col :span="9" v-if="radioPic == '饭店照片'">
            <el-scrollbar :max-height="`${divHeight}px`">
              <div>
                <el-row>
                  <el-text style="font-size: x-large" class="white-text">
                    {{ eat.Banquet.Name }}
                  </el-text>
                </el-row>
                <el-row class="pic-row" align="middle">
                  <el-text class="white-text">
                    <el-icon>
                      <LocationFilled />
                    </el-icon>
                    {{ eat.Banquet.Districts + ", " + eat.Banquet.Address }}
                  </el-text>
                </el-row>
                <el-row style="margin-top: 5px">
                  <el-link @click="showMap">
                    <el-text tag="ins" class="white-text" size="small">
                      显示地图
                    </el-text>
                  </el-link>
                </el-row>
                <el-row style="margin-top: 30px">
                  <el-text class="white-text" style="white-space: pre-wrap">
                    {{ eat.Banquet.Profile }}
                  </el-text>
                </el-row>
              </div>
            </el-scrollbar>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script lang="ts" setup>
import { defineProps, onMounted, reactive, ref } from "vue";
import config from "@/utils/config";
import Map from "@/views/map/map.vue";
import { ElCarousel } from "element-plus";

const props = defineProps({
  eat: {
    type: Object as () => any,
  },
});

const myCarousel = ref<InstanceType<typeof ElCarousel>>();
const showMap = () => {
  if (myCarousel.value) myCarousel.value.setActiveItem("mapItem");
};

const radioPic = ref("套餐照片");
const divHeight = ref(750);
onMounted(() => {
  console.log(props.eat);
  if (window.devicePixelRatio < 2) {
    divHeight.value = 750 / window.devicePixelRatio;
  }
});

onMounted(() => {
  //console.log(props.play?.PlayDetails);
  console.log(props.eat);
  // if (props.play) {
  //   props.play.TotalPrice = props.play.PlayDetails.reduce(
  //     (prev, cur) => prev + (cur.Price ?? 0),
  //     0
  //   );
  //   console.log(props.play.TotalPrice);
  // }
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
