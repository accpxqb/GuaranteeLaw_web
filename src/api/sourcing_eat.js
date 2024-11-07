import request from "@/utils/request";
export function addSourcing(data) {
  return request({
    url: "/SourcingEat/addSourcing",
    method: "post",
    data,
  });
}

export function getSourcingPropertyList(params) {
  return request({
    url: "/SourcingEatProperty/getSourcingPropertyList",
    method: "get",
    params,
  });
}

export function modifyProperty(params) {
  return request({
    url: "/SourcingEatProperty/modificationProperty",
    method: "get",
    params,
  });
}

export function editSourcingProperty(data) {
  return request({
    url: "/SourcingEatProperty/editSourcingProperty",
    method: "post",
    data,
  });
}

export function getModifyPropertyList(params) {
  return request({
    url: "/SourcingEatProperty/getModificationProperty",
    method: "get",
    params,
  });
}
