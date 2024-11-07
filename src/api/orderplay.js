import request from "@/utils/request";
/**
 * 支付
 * @param {*} data
 * @returns
 */
export function payOrderPlay(data) {
  return request({
    url: "/orderPlay/payOrder",
    method: "post",
    data: data,
  });
}

/**
 *
 * @param {*} data
 * @returns
 */
export function createPlayOrder(data) {
  return request({
    url: "/orderPlay/createOrder",
    method: "post",
    data: data,
  });
}
