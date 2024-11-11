import request from "../utils/request";

// 
export function getList(params) {
  return request({
    url: "/GuaranteeRegulations/getList",
    method: "get",
    params,
  });
}