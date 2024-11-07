import request from "../utils/request";

//接单
export function editSourcingProperty(data) {
  return request({
    url: "/SourcingProperty/editSourcingProperty",
    method: "post",
    data,
  });
}
//获取接单列表
export function getSourcingPropertyList(params) {
  return request({
    url: "/SourcingProperty/getSourcingPropertyList",
    method: "get",
    params,
  });
}

export function getSourcingRoomById(params) {
  return request({
    url: "/SourcingProperty/getSourcingRoomById",
    method: "get",
    params,
  });
}
