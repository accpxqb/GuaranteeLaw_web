import request from "../utils/request";

// 获取用户信息 不判断是否登录
export function getUserNoFilter(params) {
  return request({
    url: "/Login/getUserNoFilter",
    method: "get",
    params,
  });
}

export function getManagerInfo(data) {
  return request({
    url: "/user/getManagerInfo",
    method: "get",
  });
}
export function getSignedUser() {
  return request({
    url: "/manager/get",
    method: "get",
  });
}

export function GetCashoutSetting() {
  return request({
    url: "/manager/GetCashoutSetting",
    method: "get",
  });
}

export function SaveCashoutSetting(data) {
  return request({
    url: "/manager/SaveCashoutSetting",
    method: "post",
    data,
  });
}

export function GetManagerRevenue() {
  return request({
    url: "/manager/GetManagerRevenue",
    method: "get",
  });
}
export function GetSecuritySetting() {
  return request({
    url: "/manager/GetSecuritySetting",
    method: "get",
  });
}
export function SaveLoginPwdForSet(p) {
  return request({
    url: "/manager/SaveLoginPwdForSet",
    method: "get",
    params: { p: p },
  });
}
export function SaveLoginPwdForReset(p) {
  return request({
    url: "/manager/SaveLoginPwdForReset",
    method: "get",
    params: { p: p },
  });
}
export function SaveLoginPwdForEdit(oldp, p) {
  return request({
    url: "/manager/SaveLoginPwdForEdit",
    method: "get",
    params: { oldp: oldp, p: p },
  });
}
export function SavePayPwdForSet(p) {
  return request({
    url: "/manager/SavePayPwdForSet",
    method: "get",
    params: { p: p },
  });
}
export function SavePayPwdForReset(p) {
  return request({
    url: "/manager/SavePayPwdForReset",
    method: "get",
    params: { p: p },
  });
}
export function SavePayPwdForEdit(oldp, p) {
  return request({
    url: "/manager/SavePayPwdForEdit",
    method: "get",
    params: { oldp: oldp, p: p },
  });
}
export function SaveSecurityMobileForSet(smsId) {
  return request({
    url: "/manager/SaveSecurityMobileForSet",
    method: "get",
    params: { smsId: smsId },
  });
}
export function SaveSecurityMobileForEdit(smsId, smsId2) {
  return request({
    url: "/manager/SaveSecurityMobileForEdit",
    method: "get",
    params: { smsId: smsId, smsId2: smsId2 },
  });
}
export function SaveSecurityEmailForSet(smsId) {
  return request({
    url: "/manager/SaveSecurityEmailForSet",
    method: "get",
    params: { smsId: smsId },
  });
}
export function SaveSecurityEmailForEdit(smsId, smsId2) {
  return request({
    url: "/manager/SaveSecurityEmailForEdit",
    method: "get",
    params: { smsId: smsId, smsId2: smsId2 },
  });
}
export function CheckUserName(smsId) {
  return request({
    url: "/manager/CheckUserName",
    method: "get",
    params: { smsId: smsId },
  });
}
export function SaveLoginPwdForForgetPwd(smsId, p) {
  return request({
    url: "/manager/SaveLoginPwdForForgetPwd",
    method: "get",
    params: { smsId: smsId, p: p },
  });
}

/**
 *
 * @param {Object} params
 * @param {number} params.ManagerId
 * @param {number} params.ManagerType
 * @returns
 */
export function getManager(params) {
  return request({
    url: "/manager/getManager",
    method: "get",
    params,
  });
}

/**
 * 获取推荐的经理列表
 * @param {*} params
 * @returns list
 */
export function getRecommendManagers() {
  return request({
    url: "/user/getRecommendManagers",
    method: "get",
  });
}

/**
 * 通过名字查询经理人
 * @returns
 */
export function getManagerListByCondition(params) {
  return request({
    url: "/manager/getManagerListByCondition",
    method: "get",
    params,
  });
}

/**
 * 通过名字查询经理人
 * @returns
 */
export function getManagerByName(params) {
  return request({
    url: "/user/getManagerListByName",
    method: "get",
    params,
  });
}

/**
 * 修改用户资料
 * @returns
 */
export function modifyUserInformation(data) {
  return request({
    url: "/user/modifyUserInformation",
    method: "post",
    data,
  });
}

/**
 *
 */
export function getUserInfo() {
  return request({
    url: "/user/getUserInfo",
    method: "get",
  });
}

/**实名认证 */
export function realNameAuth(data) {
  return request({
    url: "/user/realName",
    method: "post",
    data,
  });
}

/**获取实名认证结果 */
export function getRealNameAuthResult() {
  return request({
    url: "/user/getRealName",
    method: "post",
  });
}
