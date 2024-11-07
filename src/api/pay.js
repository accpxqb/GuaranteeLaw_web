import request from "../utils/request";

export function paytest(data) {
  return request({
    url: "/api/user/test",
    method: "post",
    data,
  });
}