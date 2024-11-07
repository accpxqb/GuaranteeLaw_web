import request from "../utils/request";

//绑定支付宝
export function bindAlipay(params) {
  return request({
    url: "/manager/bindAlipay",
    method: "get",
    params,
  });
}
//提现
export function withdrawal(params) {
  return request({
    url: "/manager/withdrawal",
    method: "get",
    params,
  });
}
//提现列表
export function revenueLogList(params) {
  return request({
    url: "/manager/revenueLogList",
    method: "get",
    params,
  });
}
//收入列表
export function incomeLog(params) {
  return request({
    url: "/manager/incomeLog",
    method: "get",
    params,
  });
}

/**
 *删除图片
 * @param {*} params
 * @returns
 */
export function deletePicture(params) {
  return request({
    url: "/manager/deletePicture",
    method: "get",
    params,
  });
}

/**
 *
 * @param {*} params
 * @returns
 */
export function deletePictures(data) {
  return request({
    url: "/manager/deletePictureList",
    method: "post",
    data,
  });
}

/**
 *
 * @param {*} data
 * @returns
 */
export function idCardVerification(data) {
  return request({
    url: "/manager/idCardVerification",
    method: "post",
    data,
  });
}

//营业执照认证
export function licenseVerification(data) {
  return request({
    url: "/manager/licenseVerification",
    method: "post",
    data,
  });
}

//获取身份证审核状态
export function getIdCardStatus(params) {
  return request({
    url: "/manager/getIdCardStatus",
    method: "get",
    params,
  });
}

//获取营业执照审核状态
export function getLicenseStatus(params) {
  return request({
    url: "/manager/getLicenseVerification",
    method: "get",
    params,
  });
}

export function applyManager(data) {
  return request({
    url: "/ManagerCheckIn/applyManager",
    method: "post",
    data,
  });
}

export function getApplyManager(params) {
  return request({
    url: "/ManagerCheckIn/getApplyManager",
    method: "get",
    params,
  });
}

export function modifyUser(data) {
  return request({
    url: "/Manager/modifyuser",
    method: "post",
    data,
  });
}
