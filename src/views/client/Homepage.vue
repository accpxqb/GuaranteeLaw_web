<template>
  <el-row justify="center">
    <el-col :span="16">
      <SearchBar :type="type.toString()" />

      <el-row justify="center" style="margin-top: 20px">
        <!-- <el-col :span="4" style="padding-right: 10px">
          <HomepageMenu @welearthtype="welearthType" />
        </el-col> -->
        <el-col
          :span="24"
          style="border-radius: 4px; background-color: #f5f5f5"
        >
          <div class="menu_div">
            <div
              :class="{
                menu_div_item: true,
                hotel_clicked: type == BusinessType.hotel,
              }"
              @click="click('hotel')"
            >
              <el-image
                :src="type == BusinessType.hotel ? hotelClickedIcon : hotelIcon"
                style="width: 1em; height: 1em"
              >
              </el-image>
              <span
                :class="{
                  menu_div_item_text: true,
                  menu_div_item_text_clicked: type == BusinessType.hotel,
                }"
              >
                乐住
              </span>
            </div>
            <div
              :class="{
                menu_div_item: true,
                play_clicked: type == BusinessType.play,
              }"
              @click="click('play')"
            >
              <el-image
                :src="type == BusinessType.play ? playClickedIcon : playIcon"
                style="width: 1em; height: 1em"
              ></el-image>
              <span
                :class="{
                  menu_div_item_text: true,
                  menu_div_item_text_clicked: type == BusinessType.play,
                }"
              >
                乐玩
              </span>
            </div>
            <div
              :class="{
                menu_div_item: true,
                eat_clicked: type == BusinessType.eat,
              }"
              @click="click('eat')"
            >
              <el-image
                :src="type == BusinessType.eat ? eatClickedIcon : eatIcon"
                style="width: 1em; height: 1em"
              ></el-image>
              <span
                :class="{
                  menu_div_item_text: true,
                  menu_div_item_text_clicked: type == BusinessType.eat,
                }"
              >
                乐食
              </span>
            </div>
          </div>
          <div
            style="
              display: flex;
              margin-left: 1em;
              margin-right: 1em;
              margin-bottom: -0.5em;
            "
          >
            <div class="triangle_div">
              <div
                class="triangle_hotel"
                v-show="type == BusinessType.hotel"
              ></div>
            </div>

            <div class="triangle_div">
              <div
                class="triangle_play"
                v-show="type == BusinessType.play"
              ></div>
            </div>

            <div class="triangle_div">
              <div class="triangle_eat" v-show="type == BusinessType.eat"></div>
            </div>
          </div>
          <CreateSourcingForm v-if="type == BusinessType.hotel" />
          <PlaySourcingForm v-if="type == BusinessType.play" />
          <EatSourcingForm v-if="type == BusinessType.eat" />
        </el-col>
      </el-row>

      <el-row justify="center" style="margin-top: 20px">
        <el-col :span="24">
          <el-carousel :height="carouselHeight + 'px'">
            <el-carousel-item>
              <el-image ref="imageRef" :src="banner" fit="fill" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>

      <el-row justify="center" v-for="item in types" :key="item">
        <el-col :span="24">
          <ManagerList :type="item" />
        </el-col>
      </el-row>
      <!-- <RouterView></RouterView> -->
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useElementSize } from "@vueuse/core";
import hotel_banner from "@/assets/images/homepage/乐住banner.png";
import play_banner from "@/assets/images/homepage/乐玩banner.png";
import eat_banner from "@/assets/images/homepage/乐食banner.png";
import SearchBar from "@/components/SearchBar.vue";
import HomepageMenu from "./components/HomepageMenu.vue";
import CreateSourcingForm from "./components/CreateSourcingForm.vue";
import PlaySourcingForm from "./components/PlaySourcingForm.vue";
import EatSourcingForm from "./components/EatSourcingForm.vue";
import ManagerList from "./components/RecommendedManagerList.vue";
import { BusinessType } from "@/utils/enums";
import hotelIcon from "@/assets/images/homepage-menu-icon/乐住@2x.png";
import hotelClickedIcon from "@/assets/images/homepage-menu-icon/乐住选中@2x.png";
import playIcon from "@/assets/images/homepage-menu-icon/乐玩@2x.png";
import playClickedIcon from "@/assets/images/homepage-menu-icon/乐玩选中@2x.png";
import eatIcon from "@/assets/images/homepage-menu-icon/乐食@2x.png";
import eatClickedIcon from "@/assets/images/homepage-menu-icon/乐食选中@2x.png";

const welearthType = (n: any) => {
  console.log(n);
  type.value = n;
};
const type = ref(1);
const types = ref([1, 2, 3]);
const imageRef = ref();
const imageSize = useElementSize(imageRef);
const carouselHeight = computed(() => {
  return imageSize.height.value;
});
const options = {
  hotel: {
    banner: hotel_banner,
    type: BusinessType.hotel,
  },
  play: {
    banner: play_banner,
    type: BusinessType.play,
  },
  eat: {
    banner: eat_banner,
    type: BusinessType.eat,
  },
};
const banner = ref(hotel_banner);
const click = (n: keyof typeof options) => {
  // console.log(options);
  banner.value = options[n].banner;
  type.value = options[n].type;

  types.value.sort((a, b) => {
    if (a === type.value) return -1; // 如果a为type.value，a排在最前面
    if (b === type.value) return 1; // 如果b为type.value，b排在最前面

    return a - b; // 其他情况按升序排列
  });
  // console.log(types.value);
};
</script>

<style>
.common-layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.menu_div {
  display: flex;
  border-radius: 4px;
  background-image: url("@/assets/images/menu_bg.png");
  background-size: cover;
  margin: 1em 1em 0 1em;
}

.menu_div_item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 4em;
  width: 15%;
  text-align: center;
}

.menu_div_item_text {
  font-size: large;
  margin-left: 0.5em;
}

.menu_div_item_text_clicked {
  color: white;
}

.menu_div_item:hover {
  cursor: pointer;
}

.hotel_clicked {
  background-color: #fc7e00;
  border-radius: 4px;
}

.play_clicked {
  background-color: #00a8f4;
  border-radius: 4px;
}

.eat_clicked {
  background-color: #ff4181;
  border-radius: 4px;
}

.triangle_div {
  display: flex;
  width: 15%;
  justify-content: center;
}

.triangle_hotel {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 10px 0 10px;
  border-color: #fc7e00 transparent transparent transparent;
}

.triangle_play {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 10px 0 10px;
  border-color: #00a8f4 transparent transparent transparent;
}

.triangle_eat {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 10px 10px 0 10px;
  border-color: #ff4181 transparent transparent transparent;
}
</style>
