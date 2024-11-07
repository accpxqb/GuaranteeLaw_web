import request from "../utils/request";
// 获取用户信息
export function getUser(params) {
  return request({
    url: "/user/getUserProfile",
    method: "get",
    params,
  });
}

export function getUserPersonalShow(params) {
  return request({
    url: "/manager/getUserPersonalShow",
    method: "get",
    params,
  });
}

export function editUser(data) {
  return request({
    url: "/user/modifyuser",
    method: "post",
    data,
  });
}

export function editRegisterUser(data) {
  return request({
    url: "/user/modifyregisteruser",
    method: "post",
    data,
  });
}

export function editUserWithLifePhotos(data) {
  return request({
    url: "/user/modifyuserwithlifephotos",
    method: "post",
    data,
  });
}
export function uploadFormFile(data) {
  return request({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: "/user/uploadPhotoFile",
    method: "post",
    data,
  });
}
export function uploadLifeFile(data) {
  return request({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: "/user/uploadLifeFile",
    method: "post",
    data,
  });
}
export function delLifeFile(data) {
  return request({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: "/user/delLifeFile",
    method: "post",
    data,
  });
}
export function SettleFile(data) {
  return request({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: "/user/SettleFile",
    method: "post",
    data,
  });
}

export function delSettleFile(data) {
  return request({
    headers: {
      "Content-Type": "multipart/form-data",
    },
    url: "/user/delSettleFile",
    method: "post",
    data,
  });
}
