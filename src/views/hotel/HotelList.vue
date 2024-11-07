<template>
  <el-row>
    <el-col :span="24">
      <el-button type="primary" style="width: 100%" @click="addHotel">
        新增酒店
      </el-button>
    </el-col>
  </el-row>
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
      <el-col :span="20">
        <el-descriptions>
          <template #title>
            <span style="font-size: x-large">{{ hotel.Name }}</span>
          </template>
          <template #extra>
            <el-space class="clear-margin-space">
              <el-button type="primary" @click="addHotelRoom(hotel.Id)">
                新增房型
              </el-button>
              <el-dropdown :teleported="true" trigger="click">
                <el-button type="primary">
                  更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button link @click="editHotel(hotel.Id)"
                        >编辑</el-button
                      >
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button link @click="deleteHotelEvent(hotel.Id)"
                        >删除</el-button
                      >
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-space>
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
    <el-row style="margin-top: 10px">
      <el-col>
        <el-collapse @change="showRooms(hotel.Id)">
          <el-collapse-item name="1">
            <template #title>
              <span style="font-size: medium; font-weight: bold">
                查看房型
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
                <!-- <el-divider /> -->
                <el-row align="middle" style="margin-top: 10px">
                  <el-col :span="3">
                    <el-image
                      class="rounded-img room-img"
                      :src="room.HomePageUrl"
                      :zoom-rate="1.2"
                      :preview-src-list="room.SrcList"
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
                  <el-col :span="3">
                    <el-text>{{ room.RoomName }}</el-text>
                  </el-col>
                  <el-col :span="6">
                    <el-text>
                      {{ roomInfo(room) }}
                    </el-text>
                    <el-divider direction="vertical" />
                    <el-text>
                      {{ room.RoomSize + "㎡" }}
                    </el-text>
                  </el-col>
                  <el-col :span="3" :offset="9">
                    <el-button link @click="editHotelRoom(hotel.Id, room.Id)">{{
                      "修改"
                    }}</el-button>
                    <el-divider direction="vertical" />
                    <el-button
                      link
                      @click="deleteRoomEvent(hotel.Id, room.Id)"
                      >{{ "删除" }}</el-button
                    >
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

<script lang="ts" setup>
import { ref, onMounted, reactive } from "vue";
import { Location } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import {
  getHotelList,
  getHotelRoomList,
  deleteHotel,
  deleteHotelRoom,
} from "@/api/hotel.js";
import { regionData, CodeToText } from "element-china-area-data";
import { ElMessage, ElMessageBox } from "element-plus";
import config from "@/utils/config.js";
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
}

const hotelList = ref<Hotel[]>([]);
onMounted(() => {
  getHotelList().then((res: any) => {
    hotelList.value = res.data ?? [];
    if (hotelList.value.length > 0) {
      hotelList.value.forEach((hotel) => {
        // if (hotel.Province) {
        //     let p = regionData.find((e: any) => e.value == hotel.Province)
        //     hotel.ProvinceName = p.label
        //     let c = p.children.find((e: any) => e.value == hotel.City)
        //     hotel.CityName = c.label
        //     let d = c.children.find((e: any) => e.value == hotel.Area)
        //     hotel.AreaName = d.label
        // }

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
      });
    }
    console.log(roomList);
    roomMap.set(hotelID, roomList);
  });
};

const router = useRouter();
const addHotel = () => {
  router.push({ name: "AddHotel" });
};
const editHotel = (hotelId: number) => {
  if (isNaN(hotelId)) {
    return;
  }
  router.push({ name: "AddHotel", query: { hotelId: hotelId } });
};
const deleteHotelEvent = (hotelId: number) => {
  if (isNaN(hotelId)) {
    return;
  }
  ElMessageBox.confirm("确认删除此酒店吗?", "删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteHotel({ hotelId: hotelId }).then((res: any) => {
        if (res.code === 1) {
          ElMessage({
            message: "删除成功",
            type: "success",
          });
          setTimeout(() => {
            location.reload();
          }, 300);
        } else {
          ElMessage.error(res.msg);
        }
      });
    })
    .catch(() => {
      // catch error
    });
};

const addHotelRoom = (hotelId: number) => {
  if (isNaN(hotelId)) {
    return;
  }
  router.push({ name: "AddHotelRoom", query: { hotelId: hotelId } });
};
const editHotelRoom = (hotelId: number, roomId: number) => {
  if (isNaN(roomId)) {
    return;
  }
  router.push({
    name: "AddHotelRoom",
    query: { hotelId: hotelId, roomId: roomId },
  });
};
const deleteRoomEvent = (hotelId: number, roomId: number) => {
  if (isNaN(roomId)) {
    return;
  }
  ElMessageBox.confirm("确认删除此房型吗?", "删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteHotelRoom({ roomId: roomId })
        .then((res: any) => {
          if (res.code === 1) {
            ElMessage({
              message: "删除成功",
              type: "success",
            });
            setTimeout(() => {
              let roomList = roomMap.get(hotelId);
              let index = roomList.findIndex(
                (e: { Id: number }) => e.Id == roomId
              );
              roomList.splice(index, 1);
            }, 300);
          } else {
            ElMessage.error(res.msg);
          }
        })
        .catch(() => {
          // catch error
        });
    })
    .catch(() => {
      // catch error
    });
};
</script>
<style scoped>
@import "@/styles/element/clear-space-margin.css";

.cell-item {
  display: flex;
  align-items: center;
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
