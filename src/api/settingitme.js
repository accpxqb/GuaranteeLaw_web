import request from "../utils/request";

// 获取用户信息 不判断是否登录
export function getListByValue(params) {
  return request({
    url: "/SettingItme/getListByValue",
    method: "get",
    params,
  });
}