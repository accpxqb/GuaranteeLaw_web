import request from "@/utils/request";

export function refund(data) {
  return request({
    url: "/refund/refund",
    method: "post",
    data,
  });
}

//删除照片
export function deletePicture(params) {
  return request({
    url: "/refund/deletepicture",
    method: "get",
    params,
  });
}

/**
 * 根据退款id获取退款信息
 * @param {*} params
 * @returns
 */
export function getRefundById(params) {
  return request({
    url: "/refund/getRefund",
    method: "get",
    params,
  });
}

/**
 * 根据订单id获取退款信息
 * @param {*} params
 * @returns
 */
export function getRefundByOrderId(params) {
  return request({
    url: "/refund/getRefundByOrderId",
    method: "get",
    params,
  });
}

/**
 * 取消退款
 * @param {*} params
 * @returns
 */
export function cancelRefund(params) {
  return request({
    url: "/refund/canceledRefund",
    method: "get",
    params,
  });
}

/**
 * 同意退款
 * @param {*} data
 * @returns
 */
export function agreeRefund(data) {
  return request({
    url: "/refund/RefundReview",
    method: "post",
    data,
  });
}

/**
 * 申请客服介入
 * @param {*} data
 * @returns
 */
export function csIntervention(data) {
  return request({
    url: "/refund/intervention",
    method: "post",
    data,
  });
}
