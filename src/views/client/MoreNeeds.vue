<template>
    <el-row justify="center">
      <el-col :span="16">
        <SearchBar />
  
        <el-row justify="center" style="margin-top: 20px;">
        
          <el-col :span="24">
            <MorePostSourcingForm />
          </el-col>
        </el-row>
  
        <el-row justify="center" style="margin-top: 20px;">
          <el-col :span="24">
            <el-carousel :height="carouselHeight + 'px'">
              <el-carousel-item>
                <el-image ref="imageRef" :src="hotel_banner" fit="fill" />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
  
        <el-row justify="center">
          <el-col :span="24">
            <ManagerList  :type="1" />
          </el-col>
        </el-row>
        <!-- <RouterView></RouterView> -->
      </el-col>
    </el-row>
  </template>
  
  <script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { useElementSize } from '@vueuse/core'
  import hotel_banner from "@/assets/images/homepage/乐住banner.png";
  // import ads from '@/assets/images/homepage/ad.png'
  import SearchBar from '@/components/SearchBar.vue'
  import HomepageMenu from './components/HomepageMenu.vue'
  import MorePostSourcingForm from '@/views/client/components/MoreQuickPostSourcingForm.vue'
  import ManagerList from './components/RecommendedManagerList.vue'
  
  const imageRef = ref()
  const imageSize = useElementSize(imageRef)
  const carouselHeight = computed(() => {
    return imageSize.height.value
  })
  </script>
  
  <style>
  .common-layout {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  </style>