<template>
  <template v-if="hotelList.length > 0">
    <el-card
      v-for="hotel in hotelList"
      :key="hotel.Id"
      style="margin-top: 10px"
      shadow="never"
    >
      <el-row align="middle">
        <el-col :span="4">
          <el-image
            class="rounded-img hotel-img"
            :src="hotel.HomePageUrl"
            :zoom-rate="1.2"
            :preview-src-list="hotel.SrcList"
            :initial-index="
              hotel.SrcList?.findIndex((e) => e == hotel.HomePageUrl)
            "
            fit="cover"
          >
            <template #error>
              <div class="image-slot">
                <el-icon>
                  <Picture />
                </el-icon>
              </div>
            </template>
          </el-image>
        </el-col>
        <el-col :span="20" style="margin-left: -5px">
          <el-descriptions>
            <template #title>
              <span style="font-size: 16px">{{ hotel.Name }}</span>
            </template>

            <el-descriptions-item>
              <div class="cell-item">
                <el-icon>
                  <location />
                </el-icon>
                {{
                  CodeToText[hotel.Province] +
                  "," +
                  CodeToText[hotel.City] +
                  "," +
                  CodeToText[hotel.Area] +
                  "," +
                  hotel.Address
                }}
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px; margin-left: 10px">
        <el-col>
          <el-collapse @change="showRooms(hotel.Id)">
            <el-collapse-item name="1">
              <template #title>
                <span style="font-size: 14px; font-weight: bold">
                  查看房间
                </span>
              </template>
              <template
                v-if="
                  roomMap.get(hotel.Id) != null &&
                  roomMap.get(hotel.Id).length > 0
                "
              >
                <template
                  v-for="(room, index) in roomMap.get(hotel.Id)"
                  :key="room.Id"
                >
                  <el-row align="middle" style="margin-top: 5px">
                    <el-col :span="3">
                      <el-image
                        class="rounded-img room-img"
                        :src="room.HomePageUrl"
                        :zoom-rate="1.2"
                        :preview-src-list="room.SrcList"
                        :initial-index="
                          hotel.SrcList?.findIndex(
                            (e) => e == hotel.HomePageUrl
                          )
                        "
                        fit="cover"
                      >
                        <template #error>
                          <div class="image-slot">
                            <el-icon>
                              <Picture />
                            </el-icon>
                          </div>
                        </template>
                      </el-image>
                    </el-col>
                    <el-col :span="21">
                      <el-row>
                        <el-col :span="24">
                          <span
                            style="
                              font-size: 14px;
                              font-weight: bold;
                              line-height: 20px;
                            "
                            >{{ room.RoomName }}</span
                          >
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col
                          :span="24"
                          style="
                            font-size: 12px;
                            color: var(--el-text-color-regular);
                          "
                        >
                          <span>
                            {{ roomInfo(room) }}
                          </span>
                          <el-divider direction="vertical" />
                          <span>
                            {{ room.RoomSize + "㎡" }}
                          </span>
                        </el-col>
                      </el-row>
                      <el-row style="margin-top: 10px">
                        <el-col :span="24">
                          <el-space wrap>
                            <el-tag
                              size="small"
                              type="warning"
                              v-for="item in room.TypeList"
                              key="index"
                            >
                              {{ item }}
                            </el-tag>
                          </el-space>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </template>
              </template>
              <template v-else>
                <el-empty description="无数据" />
              </template>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </el-card>
  </template>
  <el-empty v-else description="暂无服务内容" />
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, toRef } from "vue";
import { Location } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { getHotelListById, getHotelRoomList } from "@/api/hotel.js";
import { regionData, CodeToText } from "element-china-area-data";
import { ElMessage } from "element-plus";
import config from "@/utils/config.js";
import { number } from "@intlify/core-base";
interface Hotel {
  Id: number;
  Name: string;
  Province: string;
  ProvinceName?: string;
  City: string;
  CityName?: string;
  Area: string;
  AreaName?: string;
  Address: string;
  HotelLevel: number;
  PicList: Pic[];
  HomePageUrl?: string;
  SrcList?: string[];
  Districts?: string;
}
interface Pic {
  Url: string;
  IsHomePage: number;
}
interface HotelRoom {
  Id: number;
  HotelID: number;
  RoomName: string;
  RoomType: number;
  RoomSize: number;
  BedNumber: number;
  BedSize: number;
  PicList: Pic[];
  HomePageUrl?: string;
  SrcList?: string[];
  TypeList: string[];
  TypeBathing: string[];
  TypeNetwork: string[];
  TypeSanitary: string[];
  TypeService: string[];
}

const props = defineProps<{
  userId: number;
}>();

const tags = ref([
  { value: "Tag 2", label: "success" },
  { value: "Tag 3", label: "info" },
  { value: "Tag 4", label: "warning" },
  { value: "Tag 5", label: "danger" },
]);
const hotelList = ref<Hotel[]>([]);
onMounted(() => {
  getHotelListById({ id: props.userId }).then((res: any) => {
    hotelList.value = res.data ?? [];
    if (hotelList.value.length > 0) {
      hotelList.value.forEach((hotel) => {
        if (!hotel.SrcList) {
          hotel.SrcList = [];
        }
        if (hotel.PicList.length > 0) {
          hotel.PicList.forEach((pic: Pic) => {
            var url = config.CONFIG_IMGURL + pic.Url;
            hotel.HomePageUrl = pic.IsHomePage == 1 ? url : "";
            hotel.SrcList?.push(url);
          });
        }
        if (hotel.HomePageUrl == "" && hotel.SrcList != null) {
          hotel.HomePageUrl = hotel.SrcList[0];
        }
      });
    }
  });
});

const roomInfo = (room: HotelRoom) => {
  return (
    room.BedNumber +
    "张 " +
    config.CONFIG_BedSize.find((e) => e.value == 1)?.label +
    config.CONFIG_RoomType.find((e) => e.value == 1)?.label
  );
};

const roomMap = reactive(new Map());
const showRooms = (hotelID: number) => {
  if (roomMap.has(hotelID)) {
    return;
  }
  //promise params must be used object
  getHotelRoomList({ hotelID }).then((res: any) => {
    var roomList = res.data ?? [];
    if (roomList.length > 0) {
      roomList.forEach((room: HotelRoom) => {
        console.log(room);
        if (!room.SrcList) {
          room.SrcList = [];
        }
        if (room.PicList.length > 0) {
          room.PicList.forEach((pic: Pic) => {
            var url = config.CONFIG_IMGURL + pic.Url;

            room.HomePageUrl = pic.IsHomePage == 1 ? url : "";
            room.SrcList?.push(url);
          });
        }
        if (room.HomePageUrl == "" && room.SrcList != null) {
          room.HomePageUrl = room.SrcList[0];
        }
        if (!room.TypeList) {
          room.TypeList = [];
        }
        if (room.TypeBathing.length > 0)
          room.TypeList = room.TypeList.concat(room.TypeBathing);
        if (room.TypeNetwork.length > 0)
          room.TypeList = room.TypeList.concat(room.TypeNetwork);
        if (room.TypeSanitary.length > 0)
          room.TypeList = room.TypeList.concat(room.TypeSanitary);
        if (room.TypeService.length > 0)
          room.TypeList = room.TypeList.concat(room.TypeService);
      });
    }
    console.log(roomList);
    roomMap.set(hotelID, roomList);
  });
};

const router = useRouter();
</script>
<style scoped>
.cell-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  /* font-weight: 600; */
  color: --el-text-color-primary;
}

.rounded-img {
  border-radius: 8px;
}

.hotel-img {
  width: 120px;
  height: 120px;
}

.room-img {
  width: 80px;
  height: 80px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.image-slot .el-icon {
  font-size: 30px;
}
</style>
