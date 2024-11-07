import config from "./config";
/**
 * get user full name
 * @param {*} item
 * @returns
 */
export const getFullName = (item) => {
  if (!item.FirstName || !item.LastName) return "John Doe";
  return item.FirstName + item.LastName;
};

/**
 * is null or undefined
 * @param {*} value
 * @returns
 */
export const isNullOrUndefined = (value) => {
  return value === undefined || value === null;
};

/**
 * is empty
 * @param {*} value
 * @returns
 */
export const isEmpty = (value) => {
  return value === undefined || value === null || value === "";
};

/**
 * get user avatar
 * @param {*} item
 * @returns
 */
export const getAvatar = (photoPath, photoName) => {
  //console.log(photoPath, photoName);
  if (!photoPath || !photoName)
    return "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
  return config.CONFIG_IMGURL + photoPath + "/" + photoName;
};
/**
 * get user avatar
 * @param {*} item
 * @returns
 */
export const getAvatarNew = (photoPath) => {
  //console.log(photoPath, photoName);
  if (!photoPath)
    return "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
  return config.CONFIG_IMGURL + photoPath;
};

//通过name跳转
export function pushToName(name) {
  this.$router.push({ name: name });
}

//通过path跳转
export function pushToPath(path) {
  this.$router.push({ path: path });
}

//上传图片类型大小验证
export const beforePicUpload = (file) => {
  const isJPG = file.type === "image/jpg";
  const isPNG = file.type === "image/png";
  const isJPEG = file.type === "image/jpeg";

  if (!isJPG && !isPNG && !isJPEG) {
    ElMessage.error("上传头像图片只能是 JPG/PNG/JPEG 格式!");
    return;
  }
  console.log(file.size);
  if (file.size / 1024 / 1024 > config.CONFIG_FileSize) {
    ElMessage.error(`上传头像图片大小不能超过${config.CONFIG_FileSize}MB!`);
    return;
  }
};

/**
 * 获取上传图片header
 * @returns
 */
export const getHeader = () => {
  return {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
};

/**
 * 获取上传图片url
 * @param {*} path
 * @returns
 */
export const getUploadUrl = () => {
  return config.CONFIG_IMG_API + "Upload/universalUploadFile";
};

/**
 * 获取上传图片类型限制
 */
export const getUploadType = () => {
  return ".jpg,.png,.jpeg";
};

/**
 * js格式化时间 yyyy-MM-dd hh:mm
 * @param {*} date
 * @returns
 */
export const formatTime = (date) => {
  const arr = date.split("T");
  const timeArr = arr[1].split(":");
  return arr[0] + " " + timeArr[0] + ":" + timeArr[1];
};
