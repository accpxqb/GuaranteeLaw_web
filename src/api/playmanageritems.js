import request from "../utils/request";
//获取所有服务
export function getPlayItemsList(data) {
  return request({
    url: "/playManagerItems/getPlayItemsList",
    method: "get",
    data,
  });
}
//获取经理服务
export function getPlayManagerItemsList(data) {
    return request({
      url: "/playManagerItems/getPlayManagerItemsList",
      method: "get",
      data,
    });
  }
//获取经理服务
export function save(data) {
    return request({
      url: "/playManagerItems/save",
      method: "post",
      data,
    });
  }