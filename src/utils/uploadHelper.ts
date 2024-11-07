import { ElMessage, type UploadProps, type UploadUserFile } from 'element-plus'
import config from '@/utils/config'


export const uploadUrl = config.CONFIG_IMG_API + "upload/universalUploadFile";

export const beforePicUpload: UploadProps['beforeUpload'] = (rawFile) => {
    //判断图片格式
    if (!checkPicType(rawFile)) {
        ElMessage.error('picture must be JPG format!')
        return false
    }
    //判断图片大小
    if (!checkPicSize(rawFile)) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}

const checkPicType = (rawFile: File) => {
    const isJPG = rawFile.type === 'image/jpg'
    const isPNG = rawFile.type === 'image/png'
    const isJPEG = rawFile.type === 'image/jpeg'
    if (!isJPG && !isPNG && !isJPEG) {
        ElMessage.error('上传图片只能是 JPG/PNG/JPEG 格式!')
        return false
    }
    return true
}

const checkPicSize = (rawFile: File) => {
    const isLt2M = rawFile.size / 1024 / 1024 < config.CONFIG_FileSize
    if (!isLt2M) {
        ElMessage.error('上传图片大小不能超过 ' + config.CONFIG_FileSize + 'MB!')
        return false
    }
    return true
}
