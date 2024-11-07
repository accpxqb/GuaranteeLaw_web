import request from "../utils/request";

export function Send(mobile,isSettle =false) {
  return request({
    url: "/SMS/Send",
    params: { mobile: mobile,isSettle:isSettle }
  });
}
export function ReSend(smsId, mobile) {
  return request({
    url: "/SMS/ReSend",
    params: { smsId: smsId, mobile: mobile }
  });
}
export function Check(smsId, mobile, code) {
  var data={ smsId: smsId, mobile: mobile, code: code };
    return request({
      url: "/SMS/Check",
      method:"post",
      data
    });
  }
