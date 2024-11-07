import request from "../utils/request";
// 登录
export function login(data) {
  return request({
    url: "/Login/login",
    method: "post",
    data,
  });
}
// 获取验证码
export function mailboxVerification(data) {
  return request({
    url: "/Login/mailboxVerification",
    method: "post",
    data,
  });
}
// 邮箱注册
export function register(data) {
  return request({
    url: "/Login/register",
    method: "post",
    data,
  });
}
// 邮箱登录
export function emailLogin(data) {
  return request({
    url: "/Login/emailLogin",
    method: "post",
    data,
  });
}

// 手机号登录
export function mobileLogin(data) {
  return request({
    url: "/Login/mobileLogin",
    method: "post",
    data,
  });
}

// 短信验证
export function mobileVerification(data) {
  return request({
    url: "/Login/mobileVerification",
    method: "post",
    data,
  });
}

// 手机号注册&登录
export function mobileLoginRegister(data) {
  return request({
    url: "/Login/mobileLoginRegister",
    method: "post",
    data,
  });
}

/**
 * 注册成为经理，获取验证码
 * @param {*} data
 * @returns
 */
export function mobileVerificationNew(data) {
  return request({
    url: "/Login/mobileVerificationNew",
    method: "post",
    data,
  });
}
