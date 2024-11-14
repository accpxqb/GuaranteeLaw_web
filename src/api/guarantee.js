import request from "../utils/request";

// 列表
export function getList(data) {
  return request({
    url: "/GuaranteeRegulations/getList",
    method: "Post",
    data,
  });
}
//tag列表
export function getTagList(data) {
    return request({
      url: "/GuaranteeRegulations/getTagList",
      method: "Post",
      data,
    });
  }
//flag列表
export function getHomeList(params) {
    return request({
      url: "/GuaranteeRegulations/getHomeList",
      method: "Get",
      params,
    });
  }
// 详情
export function getById(params) {
    return request({
      url: "/GuaranteeRegulations/getById",
      method: "Get",
      params,
    });
  }