import request from "../utils/request";

export function Send(email,isSettle =false) {
  return request({
    url: "/EmailCode/Send",
    params: { email: email,isSettle:isSettle }
  });
}
export function ReSend(smsId, email) {
  return request({
    url: "/EmailCode/ReSend",
    params: { smsId: smsId, email: email }
  });
}
export function Check(smsId, email, code) {
  var data={ smsId: smsId, email: email, code: code };
    return request({
      url: "/EmailCode/Check",
      method:"post",
      data
    });
  }
