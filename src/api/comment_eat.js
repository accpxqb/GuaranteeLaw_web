import request from "@/utils/request";
/**
 *
 * @param {*} params
 * @returns
 */
export function deletePicture(params) {
  return request({
    url: "/commentEat/deletePicture",
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
    url: "/commentEat/deletePictureList",
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
    url: "/commentEat/addComment",
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
    url: "/commentEat/deleteComment",
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
    url: "/commentEat/replyComment",
    method: "post",
    data,
  });
}

export function deleteReply(params) {
  return request({
    url: "/commentEat/deleteReply",
    method: "get",
    params,
  });
}

export function followUp(data) {
  return request({
    url: "/commentEat/followUpComment",
    method: "post",
    data,
  });
}
