import request from "../utils/request";

export function getRevenue(params) {
  return request({
    url: "/Promotion/getRevenue",
    method: "get",
    params,
  });
}

//获取推广用户列表
export function getPersonnelList(params) {
  return request({
    url: "/Promotion/getPersonnelList",
    method: "get",
    params,
  });
}

//获取推广收益列表
export function getIncomeList(params) {
  return request({
    url: "/Promotion/getIncomeList",
    method: "get",
    params,
  });
}

//获取收益明细
export function getIncomeDetailList(params) {
  return request({
    url: "/Promotion/getIncomeDetailList",
    method: "get",
    params,
  });
}

//获取收益发放记录
export function getPaymentList(params) {
  return request({
    url: "/Promotion/getPaymentList",
    method: "get",
    params,
  });
}
