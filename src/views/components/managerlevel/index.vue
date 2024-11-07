<template>
 <el-tag class="managerlvele"  clang="managerlevel" type=""  effect="plain" >
    <el-icon>
        <img width="14" :src="level" />
        <!-- <el-image style="width: 18px;height: 18px;" :src="level" fit="fill" /> -->
    </el-icon>         
    {{levelName}}
</el-tag>
 

</template>
<script   setup>
import { ref, computed, onMounted } from 'vue'
import level from "@/assets/images/homepage-menu-icon/星星@2x.png";
 
 
 
const managerColor = ref("#f34a29")
const levelName = ref("钻石达人")
 

const props = defineProps({
     integral: {
        type: Number,
        default:0,
     }
    }    
)
onMounted(() => {
    // console.log(props.integral)   
    if (props.integral<50000) {
        levelName.value="黄金达人"
        // managerColor.value="#fa8d77"
    }
    if (props.integral<10000) {
        levelName.value="银星达人"
        // managerColor.value="#f3beb4"
    }
    if (props.integral<1000) {
        levelName.value="新晋达人"
        // managerColor.value="#ebdbd7"
    }
})

</script>

<style scoped>
.managerlvele{
    border: 0px;
    color: #FC6100;
    font-weight: bold;
    /* background-color: #ffffff; */
    /* 使用 transparent 关键字，表示完全透明 */
    background-color: transparent; 
    line-height: 16px;
}
</style>
