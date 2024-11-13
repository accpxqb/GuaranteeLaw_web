import request from "../utils/request";

// 列表
export function getList(data) {
  return request({
    url: "/Theory/getList",
    method: "Post",
    data,
  });
}
//tag列表
export function getTagList(data) {
    return request({
      url: "/Theory/getTagList",
      method: "Post",
      data,
    });
  }
//flag列表
export function getHomeList(params) {
    return request({
      url: "/Theory/getHomeList",
      method: "Get",
      params,
    });
  }