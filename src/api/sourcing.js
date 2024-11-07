import request from "../utils/request";

export function addSourcing(data) {
  return request({
    url: "/sourcing/addSourcing",
    method: "post",
    data,
  });
}

export function getSourcingList(params) {
  return request({
    // url: "/sourcing/getSourcingList",
    url: "/sourcingBase/getSourcingList",
    method: "get",
    params,
  });
}

export function getSourcing(params) {
  return request({
    url: "/sourcing/getSourcing",
    method: "get",
    params,
  });
}

export function cancelPosting(params) {
  return request({
    url: "/sourcing/cancelPosting",
    method: "get",
    params,
  });
}
export function cancelPostingBase(params) {
  return request({
    url: "/sourcingBase/cancelPosting",
    method: "get",
    params,
  });
}

//根据userId获取sourcing数量
export function getSourcingCountGroupByStatus(params) {
  return request({
    url: "/sourcing/getSourcingCountGroupByStatus",
    method: "get",
    params,
  });
}

//根据managerId获取sourcing数量
export function GetSourcingCountGroupByStatusForM(params) {
  return request({
    url: "/sourcing/getSourcingCountGroupByStatusForM",
    method: "get",
    params,
  });
}
