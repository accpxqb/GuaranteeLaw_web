import request from "@/utils/request";
/**
 *
 * @param {*} params
 * @returns
 */
export function deletePicture(params) {
  return request({
    url: "/comment/deletePicture",
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
    url: "/comment/deletePictureList",
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
    url: "/comment/addComment",
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
    url: "/comment/deleteComment",
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
    url: "/comment/replyComment",
    method: "post",
    data,
  });
}

export function deleteReply(params) {
  return request({
    url: "/comment/deleteReply",
    method: "get",
    params,
  });
}

export function followUp(data) {
  return request({
    url: "/comment/followUpComment",
    method: "post",
    data,
  });
}

export function getCommentList(params) {
  return request({
    url: "/OrderBase/getCommentList",
    method: "get",
    params,
  });
}
