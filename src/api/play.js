import request from "../utils/request";
export function addPlayService(data) {
  return request({
    url: "/Play/addPlay",
    method: "post",
    data,
  });
}

export function getPlayService(params) {
  return request({
    url: "/Play/getPlay",
    method: "get",
    params,
  });
}

export function getPlayList(params) {
  return request({
    url: "/Play/getPlayList",
    method: "get",
    params,
  });
}

export function getPlayListByManagerId(params) {
  return request({
    url: "/Play/getPlayListByManagerId",
    method: "get",
    params,
  });
}

export function deletePlay(params) {
  return request({
    url: "/Play/deletePlay",
    method: "get",
    params,
  });
}
