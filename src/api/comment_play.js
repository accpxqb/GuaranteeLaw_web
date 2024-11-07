import request from "@/utils/request";
/**
 *
 * @param {*} params
 * @returns
 */
export function deletePicture(params) {
  return request({
    url: "/commentPlay/deletePicture",
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
    url: "/commentPlay/deletePictureList",
    method: "post",
    data,
  });
}

/**
 *
 * @param {*} data
 * @returns
 */
export function addComment(data) {
  return request({
    url: "/commentPlay/addComment",
    method: "post",
    data,
  });
}

/**
 * 删除评价
 * @param {*} params
 * @returns
 */
export function deleteComment(params) {
  return request({
    url: "/commentPlay/deleteComment",
    method: "get",
    params,
  });
}

/**
 * 回复
 * @param {} data
 * @returns
 */
export function replyComment(data) {
  return request({
    url: "/commentPlay/replyComment",
    method: "post",
    data,
  });
}

export function deleteReply(params) {
  return request({
    url: "/commentPlay/deleteReply",
    method: "get",
    params,
  });
}

export function followUp(data) {
  return request({
    url: "/commentPlay/followUpComment",
    method: "post",
    data,
  });
}
