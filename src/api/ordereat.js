import request from "@/utils/request";
/**
 *
 * @param {*} data
 * @returns
 */
export function createPlayOrder(data) {
  return request({
    url: "/ordereat/createOrder",
    method: "post",
    data: data,
  });
}
