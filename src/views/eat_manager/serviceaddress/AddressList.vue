<template>
    <div class="demoTitle">
        <span>服务地址</span>
    </div>
    <div class="demo-form demo-block">
        <div class="source">
            <div>
                <el-space fill wrap>
                    <el-row v-for="address in list" :gutter="20" class="white-row"
                        style="border-bottom: 1px solid #ebebeb;padding: 20px 0px 20px; 0px ">

                        <el-col :span="14">
                            <div style="color: var(--el-text-color-primary);">{{ address.Districts + address.Address }}
                            </div>
                        </el-col>
                        <el-col :span="7">
                            <div style="color: var(--el-text-color-secondary); font-size: 14px;">服务半径{{ address.Radius }}公里
                                <el-button @click="showMap(address.Longitude, address.Latitude, address.Radius)"
                                    style="margin-left:10px;" link>查看地图</el-button>
                            </div>
                        </el-col>
                        <el-col :span="3" align="right">
                            <el-button type="danger" @click="btndel(address.Id)" link>{{ "删除" }}</el-button>
                        </el-col>

                    </el-row>
                    <el-row style="width: 100%;margin-top: 20px;">
                        <el-col :span="20">
                            <el-select v-model="AllAddress" filterable remote reserve-keyword
                                :placeholder="$t('voet874ct5qhxxfQWrnaS')" :remote-method="searchDistrict"
                                @change="handleSearchChange" class="iptWidth" style="width: 80%;">
                                <el-option v-for="item in districtList" :key="item.id"
                                    :label="item.district + ',' + item.name" :value="item.id" />
                            </el-select>
                        </el-col>
                        <el-col :span="4">
                            <el-button type="primary" @click="btnadd">新增</el-button>
                        </el-col>
                    </el-row>
                </el-space>
            </div>
        </div>
    </div>
    <div class="address-tips">
        <el-row style="color:#20ce49;">
            温馨提示：
        </el-row>
        <el-row>
            1.服务半径不可自主修改，修改需联系平台人员
        </el-row>
        <el-row>
            2.最多可添加3个服务地址，想要加更多联系平台
        </el-row>
        <el-row>
            3.谨慎添加服务地址，位置可影响接单
        </el-row>
    </div>

    <el-dialog v-model="dialogVisible" destroy-on-close>
        <Map :centerStr="curCenter" :radiusNum="curRadius" :style="{ height: '500px' }"></Map>
    </el-dialog>
</template>
<script setup>
import { useI18n } from "vue-i18n";
import { inputtips } from '@/api/amap'
import { add, getlist, del } from '@/api/serviceaddress_eat'
import { ElMessage } from 'element-plus'
import { ref, onMounted, computed } from 'vue'
import Map from '@/views/map/RangeMap.vue'
const { t } = useI18n();

const list = ref([])
onMounted(() => {
    reload()
});
const btndel = (id) => {
    del({ id }).then(res => {
        if (res.code) {
            ElMessage.success(t('seYmKnYBovjIfgebHoHsc'))
        } else {
            ElMessage.error(res.msg)
        }
        reload()
    })
}
const reload = () => {
    getlist().then(res => {
        if (res.code) {
            console.log(res.data)
            list.value = res.data
        }
    });
}
const btnadd = () => {
    console.log(AllAddress.value)
    if (!AllAddress.value) {
        ElMessage.error("请输入详细地址")
        return;
    }

    add(serviceAddress).then(res => {
        if (res.code) {
            ElMessage.success(t('seYmKnYBovjIfgebHoHsc'))
        } else {
            ElMessage.error(res.msg)
        }
        reload()
    });
}

const districtList = ref([])
const searchparams = ref({
    key: '790547f5b60a65b2b5f1be9475b2b2ce',
    keywords: '',
    datatype: 'all',
})
const serviceAddress = {}
const AllAddress = ref()
const handleSearchChange = (val) => {
    if (!val)
        return
    let tip = districtList.value.find(it => it.id == val)
    //console.log(tip)
    if (tip) {
        if (tip.location == "") {
            ElMessage.error("地址无效")
            return
        }
        let location = tip.location.split(',')
        serviceAddress.LongitudeLatitude = tip.location
        serviceAddress.Longitude = Number(location[0])
        serviceAddress.Latitude = Number(location[1])
        serviceAddress.Address = tip.name
        serviceAddress.Districts = tip.district
        serviceAddress.Province = tip.adcode.substring(0, 2) + "0000"
        serviceAddress.City = tip.adcode.substring(0, 4) + "00"
        serviceAddress.Area = tip.adcode
        //console.log(serviceAddress)
    }

}
const searchDistrict = (query) => {
    if (query) {
        searchparams.value.keywords = query
        inputtips(searchparams.value).then(res => {
            console.log(res)
            if (res.data.tips) {
                districtList.value = res.data.tips.filter(tip => {
                    if (tip.location && tip.location != "") {
                        return tip
                    }
                })
            }
        })
    }
}

const dialogVisible = ref(false)
const curCenter = ref()
const curRadius = ref(13 * 1000)
const showMap = (Longitude, Latitude, radius) => {
    curCenter.value = Longitude + ',' + Latitude
    curRadius.value = radius * 1000
    dialogVisible.value = true
}
</script>
<style scoped>
.source {
    padding-left: 24px !important;
    padding-right: 24px !important;
    padding-top: 0 !important;
    padding-bottom: 24px !important;
    border-bottom-left-radius: 20px !important;
    border-bottom-right-radius: 20px !important;
}

.address-tips {
    margin-bottom: 100px;
}

.address-tips .el-row {
    padding: 0px 20px 0px 20px;
    line-height: 30px;
    font-size: 14px;
}
</style>