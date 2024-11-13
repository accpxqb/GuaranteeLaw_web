import request from "../utils/request";

// 列表
export function getList(data) {
  return request({
    url: "/case/getList",
    method: "Post",
    data,
  });
}
//tag列表
export function getTagList(data) {
    return request({
      url: "/case/getTagList",
      method: "Post",
      data,
    });
  }
//flag列表
export function getHomeList(params) {
    return request({
      url: "/case/getHomeList",
      method: "Get",
      params,
    });
  }