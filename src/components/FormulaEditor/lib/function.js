/**
 * 函数列表
 */
const _ = require("lodash");
const dayjs = require("dayjs");
const weekOfYear = require("dayjs/plugin/weekOfYear");
const quarterOfYear = require("dayjs/plugin/quarterOfYear");
const isoWeek = require("dayjs/plugin/isoWeek");
dayjs.extend(weekOfYear);
dayjs.extend(quarterOfYear);
dayjs.extend(isoWeek);
/*自定义数学函数*/
const M = {
  sum(v) {
    v = v || [];
    if (v.length === 0) {
      return 0;
    }
    let arr = [];
    v.forEach((num) => {
      let t = 0;
      try {
        t = num.toString().split(".")[1].length;
      } catch (e) {
        t = 0;
      }
      arr.push(t);
    });
    let m = Math.pow(10, _.max(arr));
    let newV = [];
    v.forEach((num) => {
      newV.push(num * m);
    });
    return _.sum(newV) / m;
  },
  //加法函数
  add(arg1, arg2) {
    if (isNaN(arg1) || isNaN(arg2)) {
      throw new Error("The parameters must be Numbers：" + arg1 + "," + arg2);
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    let r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (Math.round(arg1 * m) + Math.round(arg2 * m)) / m;
  },
  //减法函数
  subtract(arg1, arg2) {
    if (isNaN(arg1) || isNaN(arg2)) {
      throw new Error("The parameters must be Numbers：" + arg1 + "," + arg2);
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    let r1, r2, m;
    try {
      r1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      r1 = 0;
    }
    try {
      r2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (Math.round(arg1 * m) - Math.round(arg2 * m)) / m;
  },
  //乘法函数
  multiply(arg1, arg2) {
    if (isNaN(arg1) || isNaN(arg2)) {
      throw new Error("The parameters must be Numbers：" + arg1 + "," + arg2);
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    let m = 0;
    let s1 = arg1.toString();
    let s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length;
    } catch (e) {
      console.error(e);
    }
    try {
      m += s2.split(".")[1].length;
    } catch (e) {
      console.error(e);
    }
    return (Number(s1.replace(".", "")) * Number(s2.replace(".", ""))) / Math.pow(10, m);
  },
  //除法函数
  divide(arg1, arg2) {
    if (isNaN(arg1) || isNaN(arg2)) {
      throw new Error("The parameters must be Numbers：" + arg1 + "," + arg2);
    }
    arg1 = Number(arg1);
    arg2 = Number(arg2);
    let t1, t2, m;
    try {
      t1 = arg1.toString().split(".")[1].length;
    } catch (e) {
      t1 = 0;
    }
    try {
      t2 = arg2.toString().split(".")[1].length;
    } catch (e) {
      t2 = 0;
    }
    m = Math.pow(10, Math.max(t1, t2));
    return Math.round(arg1 * m) / Math.round(arg2 * m);
  },
};

export default {
  // 绝对值
  ABS: function (num) {
    return Math.abs(num);
  },
  // 返回所有参数的平均值
  AVG: function (v) {
    return _.mean(v);
  },
  // 圆周率
  PI: function () {
    return Math.PI;
  },
  // 返回数的余弦
  COS: function (num) {
    return Math.cos(num);
  },
  // 返回数的自然对数（底为e）
  LOG: function (x) {
    return Math.log(x);
  },
  // 多个值相加
  ADD: function () {
    let arr = [...arguments];
    return M.sum(arr);
  },
  // 两数相减
  SUBTRACT: function (a1, a2) {
    return M.subtract(a1, a2);
  },
  // 两数相乘
  MULTIPLY: function (a1, a2) {
    return M.multiply(a1, a2);
  },
  DIVIDE: function (a1, a2) {
    return M.divide(a1, a2);
  },
  // 返回数的正弦
  SIN: function (x) {
    return Math.sin(x);
  },
  // 返回 0 ~ 1 之间的随机数
  RAND: function () {
    return Math.random();
  },
  // 返回 x 的 y 次幂
  POWER: function (x, y) {
    return Math.pow(x, y);
  },
  // 将 x 四舍五入到指定 y 的位数
  ROUND: function (x, y) {
    return Number(Number(x).toFixed(y));
  },
  // 返回数的平方根
  SQRT: function (x) {
    return Math.sqrt(x);
  },
  // 返回两数相除的余数，数字x是被除数，数字y是除数
  MOD: function (x, y) {
    return x % y;
  },
  // 将数字向下取整为最接近的整数
  INT: function (x) {
    return Math.floor(x);
  },
  // 返回数组的长度
  COUNT: function (v) {
    return v.length;
  },
  // 返回数组的数值之和
  SUM: function (v) {
    return M.sum(v);
  },
  // 返回数组中的最小值
  MIN: function (v) {
    return _.min(v);
  },
  // 返回数组中的最大值
  MAX: function (v) {
    return _.max(v);
  },
  // -----字符串函数start-----
  // 判断参数1是否包含参数2的值，包含则返回true，不包含则返回false
  CONTAINS: function (x, y) {
    return x.indexOf(y) >= 0;
  },
  // 从x的第一个字符开始返回指定y个数的字符
  LEFT: function (x, y) {
    return x.substr(0, y);
  },
  // 获取文本中的字符个数
  LEN: function (str) {
    return str.length;
  },
  // 将一个文本中的所有大写字母转换为小写字母
  LOWER: function (str) {
    return _.toLower(str);
  },
  // MID返回文本中从指定位置开始的指定数目的字符
  MID: function (str, x, y) {
    return str.substr(x, y);
  },
  // 根据指定的字符数，将部分文本替换为不同的文本
  REPLACE: function (str, x, y, rStr) {
    return str.replace(str.substr(x, y), rStr);
  },
  // 删掉文本首尾的空格
  TRIM: function (str) {
    return _.trim(str);
  },
  // 将一个文本中的所有小写字母转换成大写字母
  UPPER: function (str) {
    return _.toUpper(str);
  },
  // 从文本字符串的最后一个字符开始返回指定个数的字符，若不填指定个数则取默认值1
  RIGHT: function (str, x) {
    x = x || 1;
    return str.substring(str.length - x);
  },
  // 获取文本1在文本2中的开始位置，其中开始位置编码为在文本2中第几个位置开始查找
  SEARCH: function (str1, str2, x) {
    return str2.indexOf(str1, x);
  },
  // 判断文本字符串1是否以特定字符串2开始，是则返回true，否则返回false
  STARTSWITH: function (str1, str2) {
    return _.startsWith(str1, str2);
  },
  // 将文本字符串中的部分字符替换成新字符串
  SUBSTITUTE: function (str1, str2, str3) {
    return _.replace(str1, str2, str3);
  },
  // 时间函数
  // 将指定日期加/减指定天数，当指定天数为负数时在日期上减去此天数
  ADDDAY: function (d, x) {
    return dayjs(d).add(x, "days").format("YYYY-MM-DD");
  },
  // 将指定日期加/减指定月数，当指定月数为负数时在此日期上减去此月数
  ADDMONTH: function (d, x) {
    return dayjs(d).add(x, "months").format("YYYY-MM-DD");
  },
  // 将指定日期加/减指定年数，当指定年数为负数时在此日期上减去此年数
  ADDYEAR: function (d, x) {
    return dayjs(d).add(x, "years").format("YYYY-MM-DD");
  },
  // 将年月日时分秒转换为日期
  DATE: function (d) {
    return dayjs(d).format("YYYY-MM-DD");
  },
  // 返回日期的天数，值为介于1到31之间的整数
  DAY: function (d) {
    return dayjs(d).get("date");
  },
  // 返回两个日期之间的天数差值，精确到两位小数
  DAYS: function (d1, d2) {
    return dayjs(d1).diff(d2, "days");
  },
  // 返回时间的小时部分
  HOUR: function (d) {
    return dayjs(d).get("hour");
  },
  // 返回两个时间之间的小时数，精确到两位小数
  HOURS: function (d1, d2) {
    return dayjs(d1).diff(d2, "hour");
  },
  // 返回时间的分钟部分
  MINUTE: function (d) {
    return dayjs(d).minute();
  },
  // 返回两个时间之间的分钟数，精确到两位小数
  MINUTES: function (d1, d2) {
    return dayjs(d1).diff(d2, "minute");
  },
  // 返回日期月份，值为介于1到12之间的整数
  MONTH: function (d) {
    return dayjs(d).get("month") + 1;
  },
  // 返回当前时间，精确到时分秒，格式为yyyy-MM-dd hh:mm:ss
  NOW: function () {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  },
  // 返回日期的所属季度，值为介于1到4的整数
  QUARTER: function (d) {
    return dayjs(d).quarter();
  },
  // 返回今天的日期，格式为：yyyy-MM-dd
  TODAY: function () {
    return dayjs().format("YYYY-MM-DD");
  },
  // 返回指定日期为星期几
  WEEKDAY: function (d) {
    return dayjs(d).isoWeekday();
  },
  // 返回一个数字，该数字代表指定日期是一年中的第几周
  WEEKNUM: function (d) {
    return dayjs(d).week();
  },
  // 返回一个数字，该数字代表指定日期是一年中的第几周ISO
  WEEKNUMISO: function (d) {
    return dayjs(d).isoWeek();
  },
  // 返回日期的年份
  YEAR: function (d) {
    return dayjs(d).get("year");
  },
  // 返回两个日期之间的年数差值，精确到两位小数
  YEARS: function (d1, d2) {
    return dayjs(d1).diff(d2, "years");
  },
  // 逻辑函数
  // 判断是否满足一个或多个条件，且返回符合第一个TRUE条件的值，CASE可以取代多个IF语句嵌套。
  CASE: function () {
    for (let i = 0; i < arguments.length; i += 2) {
      if (arguments[i]) {
        return arguments[i + 1];
      }
    }
    return "";
  },
  // 判断一个条件能否满足；如果满足返回一个值，如果不满足则返回另外一个值
  IF: function (result, x, y) {
    if (result) {
      return x;
    } else {
      return y;
    }
  },
  // 判断是否为空，为空则返回true，不为空则返回false，可用于判断具体值或者某个字段
  ISNULL: function (val) {
    if (val === null || val === undefined || val === "") {
      return true;
    }
    if (val instanceof Array) {
      return val.length === 0;
    }
    if (val.length !== undefined) {
      return val.length === 0;
    }
    return false;
  },
  // 将地址字段转化为文本
  GETADDRESS: function (address) {
    let str = "";
    if (address) {
      str += address.name || "";
      if (str.length && address.detail) {
        str = `${str} ` + address.detail || "";
      }
    }
    return str;
  },
};
