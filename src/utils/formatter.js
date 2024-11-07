//定义number_format方法
function number_format(number, decimals, dec_point, thousands_sep) {
  decimals = 2; //这里默认设置保留两位小数，也可以注释这句采用传入的参数
  /*
   * 参数说明：
   * number：要格式化的数字
   * decimals：保留几位小数
   * dec_point：小数点符号
   * thousands_sep：千分位符号
   * */
  number = (number + "").replace(/[^0-9+-Ee.]/g, "");
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point;
  var s = n.toString().split(".");
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  } else {
    s[1] = s[1].substring(0, prec); //小数点位数超出长度时截取前面的位数
  }
  return s.join(dec);
}
function email_format(email) {
  var index = email.indexOf("@");
  if (index > 0) {
    if (index > 10) {
      return email.substring(0, 5) + "***" + email.substring(index);
    } else {
      if (index > 1)
        return email.substring(0, index - 3 <= 0 ? 1 : index - 1) +"***" +email.substring(index);
      else 
        return "****" + email.substring(index);
    }
  } 
  else return email;
}
function mobile_format(mobile) {
  if (mobile.length == 11) {
      return mobile.substring(0, 3) + "****" + mobile.substring(7);
  } 
  else return mobile;
}
export {
  number_format, //通过此处导出方法
};
export {
  email_format,
};
export {
  mobile_format,
};
// 计算出时间戳的具体数据：比如将85400转化为 n时n分n秒
export function formateTimeStamp (timeStamp) {
  var hour;
  var min;
  var seconds;

  hour = parseInt(timeStamp / (60 * 60)) // 计算整数小时数
  var afterHour = timeStamp - hour * 60 * 60 // 取得算出小时数后剩余的秒数
  min = parseInt(afterHour / 60) // 计算整数分
  seconds = parseInt(timeStamp - hour * 60 * 60 - min * 60) // 取得算出分后剩余的秒数

  if (hour < 10) {
    hour = '0' + hour
  }

  if (min < 10) {
    min = '0' + min;
  }

  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  const restTime = {
    hour: hour,
    min: min,
    seconds: seconds
  }
  return restTime
}
export const getTimeValue = (start, end)=>{
  var stime =new Date(start).getTime();
  var etime = new Date(end).getTime();
  var usedTime = etime - stime;  //两个时间戳相差的毫秒数
  var days=Math.floor(usedTime/(24*3600*1000));
  //计算出小时数
  var leave1=usedTime%(24*3600*1000);    //计算天数后剩余的毫秒数
  var hours=Math.floor(leave1/(3600*1000));
  //计算相差分钟数
  var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
  var minutes=Math.floor(leave2/(60*1000));
  // var time = days + "天"+hours+"时"+minutes+"分";
  var time = days;
  return time;
}
 