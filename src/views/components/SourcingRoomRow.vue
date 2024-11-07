<template>
    <el-row class="row-margin" justify="center" align="middle" v-bind="room" >
        <el-col :xl="2" :lg="3">
            <el-image style="width: 84px; height: 84px; border-radius: 10px; cursor: pointer;" :src="getRoomImgUrl(room)"
                fit="cover" :preview-teleported="true" @click="updateDialog(true, room.SourcingRoomId ?? room.Id)">
                <template #error>
                    <div class="image-slot">
                        <el-icon>
                            <Picture />
                        </el-icon>
                    </div>
                </template>
            </el-image>
        </el-col>
        <el-col :xl="22" :lg="21" style="padding-left:9px;">
            <el-row justify="center" align="middle">
                <el-col :span="18">
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <div class="roomName">{{ `${hotelName}·${room.RoomName}` }}</div>
                        </el-col>
                    </el-row>
                    <el-row style="margin-top: 15px;">
                        <el-col :span="24">
                            <el-text size="small">
                                {{
                                    `${room.BedNumber}张${getBedSize(room)}米${getRoomType(room)}|${room.RoomSize}m²|有窗|禁烟`
                                }}
                            </el-text>
                            <el-link type="primary" style="font-size: small;margin-left: 10px;"
                                @click="updateDialog(true, room.SourcingRoomId ?? room.Id)">查看客房信息</el-link>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6" style="text-align: right;">
                    <el-popover :width="200" trigger="hover" placement="top">
                        <template #reference>
                            <div style="cursor: pointer; color:#27ae60;">
                                总价：{{ room.Amount ?? room.UnitPrice * room.LOS }}元</div>
                        </template>
                        <div class="popover_title">
                            <el-row>价格详情</el-row>
                            <el-row><label>价格已包括所有房间服务</label></el-row>
                        </div>
                        <div class="popover_content">
                            <el-row>
                                <el-col :span="12"><label>房间每天价格</label></el-col>
                                <el-col :span="12" style="text-align: right;">
                                    <label>{{ room.UnitPrice }}元</label></el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12"><label>入住天数</label></el-col>
                                <el-col :span="12" style="text-align: right;">
                                    <label>{{ room.LOS }}天</label>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12"><label>房间数量</label></el-col>
                                <el-col :span="12" style="text-align: right;">
                                    <label>1间</label>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24" style="text-align: right;color: #27ae60;">
                                    {{ room.Amount ?? room.UnitPrice * room.LOS }}元
                                </el-col>
                            </el-row>
                        </div>
                    </el-popover>
                </el-col>
            </el-row>
        </el-col>
    </el-row>
</template>
<script lang='ts' setup>
import { inject } from 'vue'
import config from '@/utils/config'
import type { OrderRoom, Room } from '@/types/room'

interface Props {
    room: OrderRoom,
    hotelName: string
}
const props = defineProps<Props>()

const { updateDialog } = inject('dialog') as { updateDialog: (vis: boolean, id: number) => void }

const getRoomImgUrl = (room: Room) => {
    if (!Array.isArray(room.PicList) || room.PicList.length === 0)
        return ''
    let p = room.PicList.find(x => x.IsHomePage == 1)
    let url = p ? p.Url : room.PicList[0].Url
    return url.indexOf('http') == 0 ? url : config.CONFIG_IMGURL + url 
}

const getRoomType = (room: Room) => {
    return config.CONFIG_RoomType.find(x => x.value == room.RoomType)?.label ?? "Unknown"
}

const getBedSize = (room: Room) => {
    return config.CONFIG_BedSize.find(x => x.value == room.BedSize)?.label ?? "Unknown"
}
</script>

<style scoped>
.roomName {
    font-size: 14px;
    font-weight: 600;
}

.popover_title {
    background-color: #27ae60;
    color: white;
    max-width: 200;
    font-size: 14px;
    margin-top: -12px;
    margin-right: -12px;
    margin-left: -12px;
    padding: 12px;
}

.popover_title label {

    font-size: 11px;
}

.popover_content {
    max-width: 100%;
    font-size: 14px;
}

.popover_content label {
    font-size: 11px;
}

.popover_content :deep(.el-row) {
    margin-top: 5px;
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

.row-margin {
    margin: 10px 10px 10px 10px;
}
</style>