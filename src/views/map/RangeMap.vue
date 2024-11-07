<template>
    <div class="map-page-container" style="height: 600px;">
        <el-amap :center="center" :zoom="zoom" @init="init">
            <el-amap-layer-vector>
                <el-amap-circle :center="layer.circleCenter" :radius="layer.radius" strokeColor="#00A634"
                    fillColor="#00A634" />
            </el-amap-layer-vector>
        </el-amap>
    </div>
</template>
  
<script >
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        centerStr: {
            type: String,
            default: "116.3474879,39.9432725"
        },
        radiusNum: {
            type: Number,
            default: 13 * 1000
        }
    },
    data() {
        return {
            zoom: 11,
            center: this.centerStr.split(','),
            draggable: false,
            visible: true,
            edit: false,
            layer: {
                circleCenter: this.centerStr.split(','),
                radius: this.radiusNum,//圆半径，单位:米
            }
        }
    },

    methods: {
        init(map) {
            //this.map = map;
            //console.log('init map: ', map);
        },
    },
    mounted() {
    }
})
</script>
  
<style scoped></style>
