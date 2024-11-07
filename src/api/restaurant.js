import request from "../utils/request";

export function saveBanquet(data) {
  return request({
    url: "/banquet/saveBanquet",
    method: "post",
    data,
  });
}

export function getBanquetList(data) {
  return request({
    url: "/banquet/getBanquetList",
    method: "post",
    data,
  });
}

export function getBanquetListById(data) {
  return request({
    url: "/banquet/getBanquetListById",
    method: "post",
    data,
  });
}

export function deleteBanquet(params) {
  return request({
    url: "/banquet/deleteBanquet",
    method: "get",
    params,
  });
}

export function savePackage(data) {
  return request({
    url: "/banquetPackage/savePackage",
    method: "post",
    data,
  });
}

export function getPackageList(data) {
  return request({
    url: "/banquetPackage/getListByBanquetId",
    method: "post",
    data,
  });
}

export function getPackageListByManagerId(data) {
  return request({
    url: "/banquetPackage/GetListByBanquetIdAndUserId",
    method: "post",
    data,
  });
}

export function deletePackage(params) {
  return request({
    url: "/banquetPackage/deletePackage",
    method: "get",
    params,
  });
}
