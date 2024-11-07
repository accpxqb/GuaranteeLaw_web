<template>
  <div class="map-page-container" style="height: 600px;">
    <el-amap
      :center="center"
      :zoom="zoom"
      @init="init"
      
    >
    <!-- @click="add($event)" -->
    <!-- <el-amap-search-box
        :visible="visible"
        @select="selectPoi"
        @choose="choosePoi"
      />
      <el-amap-control-geolocation
        :visible="visible"
        @complete="getLocation"
      /> -->
    </el-amap>
  </div>
  <!-- <div class="toolbar">
    <button @click="add()">
      添加标号
    </button>
  </div> -->
</template>

<script >
import {defineComponent} from "vue";

export default defineComponent({
  props:{
    fcenter:{
      type: String,
      default:"117.122207,36.655352"
    }
    },
  data() {
    return {
      zoom: 13,
      center: this.fcenter.split(','),
      map: null,
      marker:null
    };
  },

  methods: {
    init(map) {     
      this.marker = new AMap.Marker({
        position: this.center
      });
      map.add(this.marker);
      this.map = map;
      console.log('map init: ', map)
    },
    add(e) {
      console.log('add: ', e);
      this.clearMarker()
      this.marker = new AMap.Marker({
        position: [e.lnglat.lng, e.lnglat.lat]
      });
      this.map.add(this.marker);
    },
     // 清除 marker
     clearMarker() {
      if (this.marker) {
        this.marker.setMap(null);
        this.marker = null;
      }
    },
    selectPoi(e){
      this.center=[e.poi.location.lng, e.poi.location.lat]
      this.add({lnglat:e.poi.location})
      console.log('selectPoi: ', e);
    },
    choosePoi(e){
      console.log('choosePoi: ', e);
    },
   
  
  },
  mounted(){
    console.log("cccc"+this.fcenter)
  }
})
</script>

<style>
</style>
