<template>
  <div
    class="demo-form demo-block"
    style="width: 100%; border: 0px; min-height: 800px"
  >
    <SourcingCard :sourcing="sourcing" style="margin-bottom: 20px">
      <template #cardHeader>
        <div class="card-header" v-if="sourcing.CreateTime">
          <span>{{
            "发布时间" +
            ": " +
            sourcing.CreateTime.toString().substring(0, 16).replace("T", " ")
          }}</span>
        </div>
      </template>
    </SourcingCard>

    <div style="background-color: #f5f5f5; padding: 12px">
      <!-- <el-space wrap size="default" fill> -->
      <el-row :gutter="20" justify="space-between">
        <el-col :span="10">
          <div>{{ $t("AddSourcing.Recommend") }}</div>
        </el-col>
        <el-col :span="10" style="text-align: right">
          <!-- <el-button style="width: 100%;" type="primary">
                        {{ $t('addHotelVue.Title') }}
                    </el-button> -->
          <el-select
            class="addhotelSty"
            v-model="hotelList"
            multiple
            :placeholder="$t('addHotelVue.Title')"
            style="width: 240px"
          >
            <el-option
              v-for="item in hotelListOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
      <!-- </el-space> -->
    </div>
    <div>
      <!--  循环酒店 -->
      <div
        v-for="hotel in hotelListBind"
        style="background-color: var(--el-fill-color-blank)"
      >
        <el-row>
          <el-col
            :span="5"
            class="row_hotel"
            style="border-top-left-radius: 5px; border-right: 0px"
          >
            <el-space wrap size="default" fill>
              <el-row justify="center">
                <img
                  :src="getImgUrl(hotel)"
                  style="width: 114px; height: 114px"
                />
              </el-row>
              <el-row justify="center">
                <div style="font-weight: bold">{{ hotel.Name }}</div>
              </el-row>
              <el-row justify="center">
                <div style="font-size: 13px">
                  <el-icon>
                    <Location />
                  </el-icon>
                  {{ hotel.AllAddress }}
                </div>
              </el-row>
              <el-row justify="center">
                <el-button type="primary" @click="btnShowMap(hotel)" link>
                  {{ $t("AddSourcing.ShowMap") }}
                </el-button>
              </el-row>
            </el-space>
          </el-col>
          <el-col
            :span="19"
            class="row_hotel"
            style="border-top-right-radius: 5px"
          >
            <el-space wrap size="default" fill>
              <!-- 房间行 -->
              <el-row
                justify="center"
                v-for="(room, index) in hotel.RoomListBind"
                :key="room.newId"
                class="roomrow"
              >
                <el-col :span="3">
                  <img
                    :src="getImgUrl(room)"
                    style="width: 68px; height: 68px"
                  />
                </el-col>
                <el-col :span="21">
                  <el-row :gutter="20">
                    <el-col :span="24">
                      <el-space wrap fill>
                        <el-row :gutter="20">
                          <el-col :span="6">
                            <div class="roomName">{{ room.RoomName }}</div>
                          </el-col>
                          <el-col :span="12">
                            <div class="roomDescribe">
                              {{ room.BedNumber }}张{{ room.BedSize }}米{{
                                config.CONFIG_RoomType.find(
                                  (x) => x.value == room.RoomType
                                ).label
                              }}
                              |
                              {{ room.RoomSize }}m² |有窗 | 禁烟
                            </div>
                          </el-col>
                          <el-col :span="4">
                            <el-popover :width="325" trigger="click">
                              <template #reference>
                                <el-button
                                  class="addser"
                                  size="small"
                                  style="width: 100%"
                                  type="primary"
                                >
                                  {{ $t("AddSourcing.AddService") }}
                                </el-button>
                                <!-- <el-icon class="el-icon--right"><ArrowDown /></el-icon> -->
                              </template>
                              <el-space
                                direction="vertical"
                                alignment="flex-start"
                                :fill="true"
                              >
                                <el-row :gutter="20" justify="space-between">
                                  <el-col :span="12">
                                    <div class="addservice-title">
                                      {{ $t("addHotelRoomVue.TypeBathing") }}
                                    </div>
                                  </el-col>
                                  <el-col :span="12" style="text-align: right">
                                    <el-input
                                      v-if="inputVisible0"
                                      ref="InputRef0"
                                      v-model="inputValue"
                                      class="ml-1 w-20"
                                      size="small"
                                      maxlength="15"
                                      :autofocus="true"
                                      @keyup.enter="handleInputConfirm(room)"
                                      @blur="handleInputConfirm(room)"
                                    />
                                    <el-button
                                      v-else
                                      class="button-new-tag ml-1"
                                      icon="Plus"
                                      type="primary"
                                      size="small"
                                      v-on:click="showInput(0)"
                                    >
                                      {{ $t("addHotelRoomVue.AddTag") }}
                                    </el-button>
                                  </el-col>
                                </el-row>

                                <el-row :gutter="20" justify="space-between">
                                  <el-col :span="24">
                                    <el-space>
                                      <el-checkbox-group
                                        v-model="room.TypeBathing"
                                      >
                                        <el-checkbox
                                          v-for="city in room.TypeBathings"
                                          :key="city"
                                          :label="city"
                                          size="large"
                                          >{{ city }}</el-checkbox
                                        >
                                      </el-checkbox-group>
                                    </el-space>
                                  </el-col>
                                </el-row>
                                <el-row :gutter="20" justify="space-between">
                                  <el-col :span="12">
                                    <div class="addservice-title">
                                      {{ $t("addHotelRoomVue.TypeNetwork") }}
                                    </div>
                                  </el-col>
                                  <el-col :span="12" style="text-align: right">
                                    <el-input
                                      v-if="inputVisible1"
                                      ref="InputRef1"
                                      v-model="inputValue"
                                      class="ml-1 w-20"
                                      size="small"
                                      maxlength="15"
                                      :autofocus="true"
                                      @keyup.enter="handleInputConfirm(room)"
                                      @blur="handleInputConfirm(room)"
                                    />
                                    <el-button
                                      v-else
                                      class="button-new-tag ml-1"
                                      icon="Plus"
                                      type="primary"
                                      size="small"
                                      @click="showInput(1)"
                                    >
                                      {{ $t("addHotelRoomVue.AddTag") }}
                                    </el-button>
                                  </el-col>
                                </el-row>
                                <el-row :gutter="20" justify="space-between">
                                  <el-col :span="24">
                                    <el-space>
                                      <el-checkbox-group
                                        v-model="room.TypeNetwork"
                                      >
                                        <el-checkbox
                                          v-for="city in room.TypeNetworks"
                                          :key="city"
                                          :label="city"
                                          size="large"
                                          >{{ city }}</el-checkbox
                                        >
                                      </el-checkbox-group>
                                    </el-space>
                                  </el-col>
                                </el-row>
                                <el-row :gutter="20" justify="space-between">
                                  <el-col :span="12">
                                    <div class="addservice-title">
                                      {{ $t("addHotelRoomVue.TypeSanitary") }}
                                    </div>
                                  </el-col>
                                  <el-col :span="12" style="text-align: right">
                                    <el-input
                                      v-if="inputVisible2"
                                      ref="InputRef2"
                                      v-model="inputValue"
                                      class="ml-1 w-20"
                                      size="small"
                                      maxlength="15"
                                      :autofocus="true"
                                      @keyup.enter="handleInputConfirm(room)"
                                      @blur="handleInputConfirm(room)"
                                    />
                                    <el-button
                                      v-else
                                      class="button-new-tag ml-1"
                                      icon="Plus"
                                      type="primary"
                                      size="small"
                                      @click="showInput(2)"
                                    >
                                      {{ $t("addHotelRoomVue.AddTag") }}
                                    </el-button>
                                  </el-col>
                                </el-row>
                                <el-row :gutter="20" justify="space-between">
                                  <el-col :span="24">
                                    <el-space>
                                      <el-checkbox-group
                                        v-model="room.TypeSanitary"
                                      >
                                        <el-checkbox
                                          v-for="city in room.TypeSanitarys"
                                          :key="city"
                                          :label="city"
                                          size="large"
                                          >{{ city }}</el-checkbox
                                        >
                                      </el-checkbox-group>
                                    </el-space>
                                  </el-col>
                                </el-row>

                                <el-row :gutter="20" justify="space-between">
                                  <el-col :span="12">
                                    <div class="addservice-title">
                                      {{ $t("addHotelRoomVue.TypeService") }}
                                    </div>
                                  </el-col>
                                  <el-col :span="12" style="text-align: right">
                                    <el-input
                                      v-if="inputVisible3"
                                      ref="InputRef3"
                                      v-model="inputValue"
                                      class="ml-1 w-20"
                                      size="small"
                                      maxlength="15"
                                      :autofocus="true"
                                      @keyup.enter="handleInputConfirm(room)"
                                      @blur="handleInputConfirm(room)"
                                    />
                                    <el-button
                                      v-else
                                      class="button-new-tag ml-1"
                                      icon="Plus"
                                      type="primary"
                                      size="small"
                                      @click="showInput(3)"
                                    >
                                      {{ $t("addHotelRoomVue.AddTag") }}
                                    </el-button>
                                  </el-col>
                                </el-row>
                                <el-row :gutter="20" justify="space-between">
                                  <el-col :span="24">
                                    <el-space>
                                      <el-checkbox-group
                                        v-model="room.TypeService"
                                      >
                                        <el-checkbox
                                          v-for="city in room.TypeServices"
                                          :key="city"
                                          :label="city"
                                          size="large"
                                          >{{ city }}</el-checkbox
                                        >
                                      </el-checkbox-group>
                                    </el-space>
                                  </el-col>
                                </el-row>
                              </el-space>
                            </el-popover>
                          </el-col>
                          <el-col :span="2" style="text-align: center">
                            <div
                              @click="removeRoom(hotel, room)"
                              style="width: 100%; cursor: pointer"
                            >
                              <el-icon>
                                <Delete />
                              </el-icon>
                            </div>
                          </el-col>
                        </el-row>
                        <el-row :gutter="20" style="margin-top: 6px">
                          <el-col :span="6">
                            <!-- @input="formatValueUnitPrice(room)" -->
                            <el-input
                              v-model="room.UnitPrice"
                              size="small"
                              :oninput="formatValueUnitPrice(room)"
                              :placeholder="$t('AddSourcing.RoomPrice')"
                            >
                              <template #append>
                                {{ $t("AddSourcing.Price") }}
                              </template>
                            </el-input>
                          </el-col>
                          <el-col :span="5">
                            <el-input
                              v-model="room.DaysIn"
                              size="small"
                              :placeholder="$t('AddSourcing.Days')"
                              :oninput="formatValueDaysIn(room)"
                            >
                              <template #append>
                                {{ $t("AddSourcing.Day") }}
                              </template>
                            </el-input>
                          </el-col>
                          <el-col :span="5">
                            <!-- oninput="value=value.replace(/[^0-9]/g,'')" -->
                            <el-input
                              v-model="room.RoomNumber"
                              size="small"
                              :placeholder="$t('AddSourcing.RoomNumbers')"
                              :oninput="formatValueRoomNumber(room)"
                            >
                              <template #append>
                                {{ $t("AddSourcing.Room") }}
                              </template>
                            </el-input>
                          </el-col>
                          <el-col :span="8">
                            <div class="roomTotal" style="">
                              {{ $t("AddSourcing.AllPrice") }}：{{
                                getRoomTotal(room)
                              }}元
                            </div>
                          </el-col>
                        </el-row>
                      </el-space>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>

              <el-row justify="start">
                <el-col :span="18">
                  <el-select
                    @change="changeRooms(hotel)"
                    v-model="hotel.RoomList"
                    multiple
                    :placeholder="$t('AddSourcing.AddRoom')"
                    style="width: 240px"
                    class="changeRooms"
                  >
                    <el-option
                      v-for="item in hotel.RoomsOption"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </el-space>
          </el-col>
        </el-row>
        <el-row
          justify="end"
          class="row_hotel"
          style="
            border-bottom-left-radius: 5px;
            border-bottom-right-radius: 5px;
            border-top: 0px;
          "
        >
          <el-col :span="6">
            <div class="row_hotel_footer">
              {{ $t("AddSourcing.Total") }}：<label
                >{{ getHotelTotal(hotel) }}元</label
              >
            </div>
          </el-col>
        </el-row>
      </div>
      <!--  循环酒店 结束-->
      <el-row>
        <el-col :span="24">
          <el-button
            v-if="sendCustomer"
            id="sendCustomer"
            @click="subSendCustomer()"
            type="primary"
            style="width: 100%"
            >发送客户</el-button
          >
        </el-col>
      </el-row>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="70%"
    top="0"
    destroy-on-close
    append-to-body
  >
    <Map :fcenter="center"></Map>
  </el-dialog>
</template>
<script setup>
import { regionData, CodeToText } from "element-china-area-data";
import {
  ref,
  reactive,
  onMounted,
  watch,
  nextTick,
  getCurrentInstance,
} from "vue";
import { useI18n } from "vue-i18n";
import {
  getHotelList,
  getHotelRoomList,
  getFlags,
} from "../../../api/hotel.js";
import { getSourcing } from "../../../api/sourcing";
import config from "../../../utils/config";
import { ElMessage } from "element-plus";
import { editSourcingProperty } from "../../../api/sourcingproperty.js";
import Map from "../../map/map.vue";
import { useRoute, useRouter } from "vue-router";
import SourcingCard from "../../components/sourcing/SourcingCard.vue";
import { v4 as uuidv4 } from "uuid";

const inputValue = ref("");

const inputVisible0 = ref(false);
const inputVisible1 = ref(false);
const inputVisible2 = ref(false);
const inputVisible3 = ref(false);

const showInput = (flag) => {
  if (flag == 0) {
    inputVisible0.value = true;
  }
  if (flag == 1) {
    inputVisible1.value = true;
  }
  if (flag == 2) {
    inputVisible2.value = true;
  }
  if (flag == 3) {
    inputVisible3.value = true;
  }
  flagType.value = flag;
};

const handleInputConfirm = (room) => {
  if (inputValue.value) {
    addFlag(room);
  }
  inputVisible0.value = false;
  inputVisible1.value = false;
  inputVisible2.value = false;
  inputVisible3.value = false;
  inputValue.value = "";
};

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const dialogVisible = ref(false);
const dialogTitle = ref("");
const center = ref([]);
const TypeBathings = ref([]);
const TypeNetworks = ref([]);
const TypeSanitarys = ref([]);
const TypeServices = ref([]);

const sendCustomer = ref(false);
const sourcing = ref({});
const hotelList = ref([]);
const hotelListBind = ref();
const hotelListData = ref([]);
const hotelListOption = ref([]);

const selfFlag = ref("");
const addService = ref(false);
const flagType = ref(-1);
const btnShowMap = (hotel) => {
  dialogVisible.value = true;
  // center.value=[117.129889,36.651211]
  center.value = hotel.LongitudeLatitude;
  dialogTitle.value = hotel.Districts + hotel.Address;
};
const subSendCustomer = () => {
  let data = hotelListBind.value.filter((hotel) => {
    if (hotelList.value.indexOf(hotel.Id) > -1) {
      hotel.OrderId = route.query.OrderId;
      return hotel;
    }
  });
  console.log(data);
  editSourcingProperty(data).then((res) => {
    console.log(res);
    if (res.code) {
      ElMessage.success(t("AddSourcing.Success"));
      router.back(-1);
    } else {
      ElMessage.error(res.msg);
    }
  });
};

const formatValueUnitPrice = (room) => {
   if (room.UnitPrice == null) return;
  let value = room.UnitPrice + "";
  // 使用正则表达式过滤输入，只保留数字和小数点
  value = value.replace(/[^0-9.]/g, "");
  // 如果输入值以多个小数点开头，则只保留第一个小数点
  if (value.split(".").length > 2) {
    const parts = value.split(".");
    value = parts[0] + "." + parts.slice(1).join("");
  }
  if(value>1000000){
    ElMessage.error("金额太大了！");
    return (room.UnitPrice = 0);
  }
  return (room.UnitPrice = value);
};
const formatValueDaysIn = (room) => {
  if (room.DaysIn == null) return;
  let value = room.DaysIn + "";
  // 使用正则表达式过滤输入，只保留数字和小数点
  value = value.replace(/[^0-9]/g, "");

  return (room.DaysIn = value);
};
const formatValueRoomNumber = (room) => {
  if (room.RoomNumber == null) return;
  let value = room.RoomNumber + "";
  // 使用正则表达式过滤输入，只保留数字和小数点
  value = value.replace(/[^0-9]/g, "");

  return (room.RoomNumber = value);
};
const getRoomTotal = (room) => {
  let total = room.UnitPrice * room.DaysIn * room.RoomNumber;
  if (isNaN(total)) total = 0;
  return total.toFixed(2);
};
const getHotelTotal = (hotel) => {
  sendCustomer.value = true;
  let total = 0;
  if (hotel.RoomListBind != undefined) {
    hotel.RoomListBind.forEach((room) => {
      total += room.UnitPrice * room.DaysIn * room.RoomNumber;
    });
  }

  if (isNaN(total)) total = 0;

  //判断是否显示发送客户按钮
  hotelList.value.forEach((hotelId) => {
    let hhh = hotelListBind.value.find((x) => x.Id == hotelId);

    if (hhh.RoomListBind != undefined && hhh.RoomListBind.length != 0) {
      hhh.RoomListBind.forEach((room) => {
        if (room.UnitPrice * room.DaysIn * room.RoomNumber <= 0)
          sendCustomer.value = false;
      });
    } else {
      sendCustomer.value = false;
    }
  });

  return total.toFixed(2);
};
const getImgUrl = (hotel) => {
  let url = "";
  if (
    hotel.PicList !== undefined &&
    hotel.PicList != null &&
    hotel.PicList.length > 0
  ) {
    hotel.PicList.forEach((element) => {
      if (element.IsHomePage) {
        url = config.CONFIG_IMGURL + element.Url;
      }
    });
    if (url == "") url = config.CONFIG_IMGURL + hotel.PicList[0].Url;
  }

  return url;
};
const addFlag = (room) => {
  if (inputValue.value == "") return;

  if (flagType.value == 0) {
    if (room.TypeBathings.indexOf(inputValue.value) != -1) return;
    room.TypeBathings.push(inputValue.value);
    room.TypeBathing.push(inputValue.value);
    addService.value = false;
  }
  if (flagType.value == 1) {
    if (room.TypeNetworks.indexOf(inputValue.value) != -1) return;
    room.TypeNetworks.push(inputValue.value);
    room.TypeNetwork.push(inputValue.value);
    addService.value = false;
  }
  if (flagType.value == 2) {
    if (room.TypeSanitarys.indexOf(inputValue.value) != -1) return;
    room.TypeSanitarys.push(inputValue.value);
    room.TypeSanitary.push(inputValue.value);
    addService.value = false;
  }
  if (flagType.value == 3) {
    if (room.TypeServices.indexOf(inputValue.value) != -1) return;
    room.TypeServices.push(inputValue.value);
    room.TypeService.push(inputValue.value);
    addService.value = false;
  }
  console.log(TypeServices.value);
  console.log(room);
};
const btnAddService = (flag) => {
  addService.value = true;
  flagType.value = flag;
};
const apiGetHotelList = () => {
  getHotelList().then((res) => {
    if (res.code) {
      hotelListData.value = res.data;
      res.data.forEach((element) => {
        hotelListOption.value.push({ value: element.Id, label: element.Name });
      });
      hotelListData.value.forEach((element) => {
        // element.AllAddress=CodeToText[element.Province]+CodeToText[element.City]+CodeToText[element.Area]+element.Address;
        element.AllAddress = element.Districts + element.Address;
      });
      console.log(hotelListData.value);
    }
  });
};
const removeRoom = (hotel, room) => {
  console.log(room);
  console.log(hotel.RoomListBind);
  const index = hotel.RoomListBind.findIndex((v) => v.newId == room.newId);
  if (index != -1) hotel.RoomListBind.splice(index, 1);
};
const changeRooms = (hotel) => {
  if (hotel.RoomListBind == undefined) hotel.RoomListBind = [];
  let newRoomstr = JSON.stringify(
    hotel.RoomsData.find((x) => x.Id == hotel.RoomList[0])
  );
  let newRoom = JSON.parse(newRoomstr);
  newRoom.TypeService.forEach((element) => {
    if (TypeServices.value.indexOf(element) == -1) {
      TypeServices.value.push(element);
    }
  });
  newRoom.newId = uuidv4();
  if (newRoom.TypeBathings == undefined) newRoom.TypeBathings = TypeBathings;
  if (newRoom.TypeNetworks == undefined) newRoom.TypeNetworks = TypeNetworks;
  if (newRoom.TypeSanitarys == undefined) newRoom.TypeSanitarys = TypeSanitarys;
  if (newRoom.TypeServices == undefined) {
    newRoom.TypeServices = TypeServices;
  }
  newRoom.DaysIn = sourcing.value.Nights;
  hotel.RoomListBind.push(newRoom);
  hotel.RoomList = [];
};

watch(hotelList, () => {
  hotelListBind.value = hotelListData.value.filter((element) => {
    if (hotelList.value.indexOf(element.Id) > -1) {
      getHotelRoomList({ hotelId: element.Id }).then((res) => {
        if (res.code) {
          element.RoomsData = res.data;

          if (element.RoomsOption == undefined) {
            element.RoomsOption = [];
            res.data.forEach((room) => {
              element.RoomsOption.push({
                value: room.Id,
                label: room.RoomName,
              });
            });
          }
          if (element.RoomList == undefined) {
            element.RoomList = [];
          }
        }
      });
      console.log(element);
      return element;
    }
  });
});

onMounted(() => {
  getSourcing({ Id: route.query.OrderId }).then((res) => {
    if (res.code) {
      sourcing.value = res.data;
    } else {
      ElMessage.error(res.msg);
      route.back();
    }
    console.log(res);
  });

  getFlags().then((res) => {
    if (res.code) {
      var arr = res.data;
      arr.forEach((i) => {
        if (i.Type == 0) TypeBathings.value.push(i.Name);
        if (i.Type == 1) TypeNetworks.value.push(i.Name);
        if (i.Type == 2) TypeSanitarys.value.push(i.Name);
        if (i.Type == 3) TypeServices.value.push(i.Name);
      });
      //  console.log(TypeBathings.value)
    } else {
      ElMessage.error(res.msg);
    }
  });
  apiGetHotelList();
});
</script>

<style scoped>
:deep(.el-dialog__header) {
  padding: 0;
}

.demo-radius .radius {
  height: 20px;

  border: 1px solid var(--el-border-color);
  border-radius: 0;

  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
  line-height: 20px;
  padding: 20px;
}

.amenity {
  padding: 10px;
  border: 1px solid #f5f5f5;
  font-size: 13px;
  background-color: #f5f5f5;
  color: var(--el-color-primary);
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

.row_hotel {
  border: 1px solid var(--el-border-color);
  padding: 20px;
  /* border-radius: 5px; */
}

.row_hotel img {
  border-radius: 10px;
}

:deep(.el-input-group__append) {
  padding: 0 5px;
}

.roomName {
  font-size: 14px;
  font-weight: 600;
}

.roomDescribe {
  font-size: 11px;
}

.roomTotal {
  font-size: 13px;
  font-weight: bold;
  width: 100%;
  height: 100%;
  text-align: right;
  /* line-height: 80px; */
}

.row_hotel_footer {
  font-size: 16px;
  font-weight: bold;
  text-align: right;
}

.row_hotel_footer label {
  color: red;
}

.addservice-title {
  padding-top: 5px;
}

.addhotelSty :deep(.el-tag.el-tag--info) {
  /* --el-tag-text-color:#27ae60; */
  color: #27ae60;
  font-weight: bold;
}

.addhotelSty :deep(.el-input__inner::placeholder) {
  color: #27ae60;
  font-weight: bold;
}

.changeRooms :deep(.el-input__inner::placeholder) {
  color: #f5f5f5;
  font-weight: bold;
}

.changeRooms :deep(.el-input__wrapper) {
  background-color: #27ae60 !important;
  box-shadow: 0 0 0 0;
}

.changeRooms :deep(.el-icon) {
  color: #f5f5f5;
}

.roomrow {
  border-bottom: 1px #f5f5f5 solid !important;
}

.addser :deep(.el-button--small) {
  font-size: 10px !important;
  --el-button-size: 20px !important;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  height: 10px;
}
</style>
