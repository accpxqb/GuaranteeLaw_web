<template>
    <el-card v-bind="sourcing" class="greenHeaderCard" shadow="never" :body-style="{ padding: '10px' }">         
        <template #header>
            <slot name="cardHeader"></slot>
        </template>
        <div>
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="radius">
                        <el-popover placement="top-start" :width="300" trigger="hover"
                            :content="`${sourcing.Destination},${sourcing.Keyword}`">
                            <template #reference>
                                <el-text class="text" truncated>
                                    {{ $t('sourcingList.Keyword') + `:${sourcing.Destination},${sourcing.Keyword}` }}
                                </el-text>
                            </template>
                        </el-popover>
                    </div>
                </el-col>

                <el-col :span="4">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.Budget') }}: </el-text>
                        <el-text class="text">{{ budgetStr }} </el-text>
                    </div>
                </el-col>

                <el-col :span="8" v-if="sourcing.SingleRooms == 0 && sourcing.DoubleRooms == 0">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.Rooms') }}: </el-text>
                        <el-text class="text">{{ sourcing.Rooms + "间" }}</el-text>
                    </div>
                </el-col>

                <el-col :span="4" v-if="sourcing.SingleRooms != 0">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.SingleRooms') }}: </el-text>
                        <el-text class="text">{{ sourcing.SingleRooms ?? 0 }}</el-text>
                    </div>
                </el-col>

                <el-col :span="4" v-if="sourcing.DoubleRooms != 0">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.DoubleRooms') }}: </el-text>
                        <el-text class="text">{{ sourcing.DoubleRooms ?? 0 }}</el-text>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="form-row">
                <el-col :span="8">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.CheckIn') }}: </el-text>
                        <el-text class="text">{{ checkInStr }}</el-text>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.CheckOut') }}: </el-text>
                        <el-text class="text">{{ checkOutStr }}</el-text>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.Nights') }}: </el-text>
                        <el-text class="text">{{ sourcing.Nights + "晚" }}</el-text>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="form-row">
                <el-col :span="4">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.Residents') }}: </el-text>
                        <el-text class="text">{{ sourcing.Residents + "位" }}</el-text>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.Adults') }}: </el-text>
                        <el-text class="text">{{ sourcing.Adults + "位" }}</el-text>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.Children') }}: </el-text>
                        <el-text class="text" v-if="sourcing.Children && sourcing.Children > 0">{{ sourcing.Children + "位"
                        }}</el-text>
                        <el-text class="text" v-else>无</el-text>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.HotelLevel') }}: </el-text>
                        <el-text class="text" v-if="hotelLevelStr.length > 0">{{ hotelLevelStr }}</el-text>
                        <el-text class="text" v-else>不限制</el-text>
                    </div>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="form-row" align="middle"
                v-if="sourcing.Requirements && sourcing.Requirements != '' && sourcing.Requirements != '[]'">
                <el-col :span="24">
                    <el-text style="padding-left: 5px;" class="text">更多服务: </el-text>
                    <el-tag type="success" v-for="item in JSON.parse(sourcing.Requirements)" :key="item.value"
                        style="margin-left: 10px;">
                        {{ item.label }}
                    </el-tag>
                </el-col>
            </el-row>

            <el-row :gutter="20" class="form-row">
                <el-col :span="memoSpan">
                    <div class="radius">
                        <el-text class="text">{{ $t('sourcingList.Memo') }}: </el-text>
                        <el-text class="text">{{ sourcing.Memo }}</el-text>
                    </div>
                </el-col>
                <el-col :span="buttonSpan">
                    <div ref="buttonColRef">
                        <slot name="operationButton"></slot>
                    </div>
                </el-col>
            </el-row>
        </div>
        <slot name="managerRes"></slot>
    </el-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import type { Sourcing } from '@/types/sourcing'

interface Props {
    sourcing: Sourcing
}

const props = defineProps<Props>()

const buttonColRef = ref();
const memoSpan = ref(20)
const buttonSpan = ref(4)
onMounted(() => {
    console.log(props.sourcing)
    if (buttonColRef.value.childElementCount <= 0) {
        memoSpan.value = 24
        buttonSpan.value = 0
    }
})

const checkInStr = computed(() => {
    if (props.sourcing.CheckIn)
        return props.sourcing.CheckIn.toString().substring(0, 10)
    return ''
})

const checkOutStr = computed(() => {
    if (props.sourcing.CheckOut)
        return props.sourcing.CheckOut.toString().substring(0, 10)
    return ''
})

const hotelLevelStr = computed(() => {
    if (!props.sourcing.HotelLevel)
        return ''
    return JSON.parse(props.sourcing.HotelLevel).map((element: any) => element.label).join(";")
})

const budgetStr = computed(() => {
    return props.sourcing.Budget == null || props.sourcing.Budget == 0 ? "不限" : props.sourcing.Budget + "元/晚"
})
</script>

<style scoped>
.form-row {
    margin-top: 10px;
}

.el-card {
    border-radius: 15px;
}

.greenHeaderCard :deep(.el-card__header) {
    background-color: #27ae60;
}

.radius {
    height: 20px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    /* font-weight: bold; */
    line-height: 20px;
    padding: 7px;
}

.text {
    font-size: small;
}
</style>