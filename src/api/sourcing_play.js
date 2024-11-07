import request from "@/utils/request";
export function addSourcing(data) {
  return request({
    url: "/SourcingPlay/addSourcing",
    method: "post",
    data,
  });
}

export function editSourcingProperty(data) {
  return request({
    url: "/SourcingPlayProperty/editSourcingProperty",
    method: "post",
    data,
  });
}

export function getNeedModifyProperty(params) {
  return request({
    url: "/SourcingPlayProperty/getModificationProperty",
    method: "get",
    params,
  });
}

export function getSourcingPropertyList(params) {
  return request({
    url: "/SourcingPlayProperty/getSourcingPropertyList",
    method: "get",
    params,
  });
}

export function modifyProperty(params) {
  return request({
    url: "/SourcingPlayProperty/modificationProperty",
    method: "get",
    params,
  });
}
