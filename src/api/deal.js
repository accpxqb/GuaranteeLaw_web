import request from "../utils/request";

export function getDealList(params) {
  return request({
    url: "/deal/getDealList",
    method: "get",
    params,
  });
}
export function getPlayDealList(params) {
  return request({
    url: "/dealPlay/getDealList",
    method: "get",
    params,
  });
}
export function getPlayDeal(params) {
  return request({
    url: "/DealPlay/getDeal",
    method: "get",
    params,
  });
}

export function getEatDealList(params) {
  return request({
    url: "/dealEat/getDealList",
    method: "get",
    params,
  });
}
export function getEatDeal(params) {
  return request({
    url: "/dealEat/getDeal",
    method: "get",
    params,
  });
}
