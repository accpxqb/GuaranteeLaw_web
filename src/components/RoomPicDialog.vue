<template>
  <el-dialog
    v-model="props.dialogVisible"
    :show-close="false"
    fullscreen
    append-to-body
    destroy-on-close
    :close-on-press-escape="false"
    class="hotel-pic-dialog"
    style="background-color: rgba(0, 0, 0, 0.8)"
  >
    <el-row justify="center" v-if="roomExpand">
      <el-col :span="22">
        <el-row>
          <el-col :span="15" style="text-align: center">
            <el-radio-group v-model="radioPic" size="large" class="pic-radio">
              <el-radio-button label="酒店照片" />
              <el-radio-button label="房间照片" />
            </el-radio-group>
          </el-col>
          <el-col :span="9" style="text-align: right">
            <el-button
              circle
              style="background-color: rgba(0, 0, 0, 0.8); border-color: white"
              @click="$emit('closeDialog')"
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
              :height="`${divHeight}px`"
              :autoplay="false"
              indicator-position="outside"
              ref="myCarousel"
            >
              <template v-if="radioPic == '酒店照片'">
                <el-carousel-item
                  v-for="pic in roomExpand.HotelPicList"
                  class="div-center"
                >
                  <el-image :src="pic.Url" fit="cover" />
                </el-carousel-item>
                <el-carousel-item name="mapItem">
                  <Map
                    :fcenter="roomExpand.LongitudeLatitude"
                    :style="{ height: divHeight + 'px' }"
                  ></Map>
                </el-carousel-item>
              </template>
              <template v-if="radioPic == '房间照片'">
                <el-carousel-item
                  v-for="pic in roomExpand.RoomPicList"
                  class="div-center"
                >
                  <el-image :src="pic.Url" fit="cover" />
                </el-carousel-item>
              </template>
            </el-carousel>
          </el-col>

          <el-col :span="9" v-if="radioPic == '酒店照片'">
            <el-scrollbar :max-height="`${divHeight}px`">
              <div>
                <el-row>
                  <el-text style="font-size: x-large" class="white-text">
                    {{ roomExpand.HotelName }}
                  </el-text>
                </el-row>
                <el-row class="pic-row" align="middle">
                  <el-text class="white-text">
                    <el-icon>
                      <LocationFilled />
                    </el-icon>
                    {{ roomExpand.Districts + ", " + roomExpand.Address }}
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
                    {{ roomExpand.HotelProfile }}
                  </el-text>
                </el-row>
              </div>
            </el-scrollbar>
          </el-col>

          <el-col :span="9" v-if="radioPic == '房间照片'">
            <el-scrollbar
              :max-height="`${divHeight}px`"
              style="padding-right: 10px"
            >
              <el-row>
                <el-text style="font-size: x-large" class="white-text">
                  {{ roomExpand.HotelName + "·" + roomExpand.RoomName }}
                </el-text>
              </el-row>
              <el-row class="pic-row" align="middle">
                <el-image
                  style="width: 14px; height: 14px"
                  :src="roomIcon"
                  fit="fill"
                />
                <el-text class="white-text" style="margin-left: 5px">
                  {{ roomExpand.RoomSize + "平方米" }}
                </el-text>
              </el-row>
              <el-row class="pic-row" align="middle">
                <el-image
                  style="width: 14px; height: 14px"
                  :src="bedIcon"
                  fit="fill"
                />
                <el-text class="white-text" style="margin-left: 5px">
                  {{ roomExpand.BedNumber + "张" + bedSize + "床" }}
                </el-text>
              </el-row>
              <el-row class="pic-row">
                <el-text class="white-text" style="white-space: pre-wrap">
                  {{ roomExpand.RoomProfile }}
                </el-text>
              </el-row>
              <el-row class="pic-row" v-if="toiletries?.length">
                <el-text class="white-text" size="large">洗浴用品</el-text>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-text
                  v-for="item in toiletries"
                  class="white-text"
                  style="margin-right: 12px"
                >
                  <el-icon :size="16">
                    <CircleCheck />
                  </el-icon>
                  {{ item.AmenityName }}
                </el-text>
              </el-row>
              <el-row class="pic-row" v-if="network?.length">
                <el-text class="white-text" size="large">网络通信</el-text>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-text
                  v-for="item in network"
                  class="white-text"
                  style="margin-right: 12px"
                >
                  <el-icon :size="16">
                    <CircleCheck />
                  </el-icon>
                  {{ item.AmenityName }}
                </el-text>
              </el-row>
              <el-row class="pic-row" v-if="bath?.length">
                <el-text class="white-text" size="large">卫浴设施</el-text>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-text
                  v-for="item in bath"
                  class="white-text"
                  style="margin-right: 12px"
                >
                  <el-icon :size="16">
                    <CircleCheck />
                  </el-icon>
                  {{ item.AmenityName }}
                </el-text>
              </el-row>
              <el-row class="pic-row" v-if="services?.length">
                <el-text class="white-text" size="large">服务标签</el-text>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-text
                  v-for="item in services"
                  class="white-text"
                  style="margin-right: 12px"
                >
                  <el-icon :size="16">
                    <CircleCheck />
                  </el-icon>
                  {{ item.AmenityName }}
                </el-text>
              </el-row>
            </el-scrollbar>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import bedIcon from "@/assets/images/床@2x.png";
import roomIcon from "@/assets/images/面积@2x.png";
import Map from "@/views/map/map.vue";
import { getSourcingRoomById } from "@/api/sourcingproperty.js";
import config from "@/utils/config.js";
import type { RoomExpand } from "@/types/room";
import { ElCarousel } from "element-plus";
import { computed } from "@vue/reactivity";

const props = defineProps<{
  dialogVisible: boolean;
  isSourcingRoom: boolean;
  roomId: number;
}>();

const radioPic = ref("房间照片");

const roomExpand = ref<RoomExpand>();

const toiletries = ref<{ AmenityType: number; AmenityName: string }[]>();
const network = ref<{ AmenityType: number; AmenityName: string }[]>();
const bath = ref<{ AmenityType: number; AmenityName: string }[]>();
const services = ref<{ AmenityType: number; AmenityName: string }[]>();

const myCarousel = ref<InstanceType<typeof ElCarousel>>();
const divHeight = ref(750);
onMounted(() => {
  if (window.devicePixelRatio < 2) {
    divHeight.value = 750 / window.devicePixelRatio;
  }
});
watch(
  () => props.roomId,
  (newVal, oldVal) => {
    if (newVal) {
      radioPic.value = "房间照片";
      getSourcingRoomById({ sourcingRoomId: newVal }).then((res) => {
        console.log(res.data);
        roomExpand.value = res.data;
        if (!roomExpand.value) return;
        let amenityArr: { AmenityType: number; AmenityName: string }[] =
          JSON.parse(roomExpand.value.Amenitys);
        toiletries.value = amenityArr.filter((x) => x.AmenityType == 0);
        network.value = amenityArr.filter((x) => x.AmenityType == 1);
        bath.value = amenityArr.filter((x) => x.AmenityType == 2);
        services.value = amenityArr.filter((x) => x.AmenityType == 3);
      });
    }
  }
);
const bedSize = computed(() => {
  if (!roomExpand.value) return "未知";
  let size = roomExpand.value.BedSize;
  return config.CONFIG_BedSize.find((x) => x.value == size)?.label;
});
const showMap = () => {
  if (myCarousel.value) myCarousel.value.setActiveItem("mapItem");
};
</script>
<style scoped>
.pic-radio :deep(.el-radio-button__inner) {
  width: 300px;
}

.white-text {
  color: white;
}

.pic-row {
  margin-top: 15px;
}

/* 设置div内所有元素居中 */
.div-center {
  text-align: center;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
