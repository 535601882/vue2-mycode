/**
 * 公式解析
 * Created by DELL on 2020/12/10.
 */
import funObj from "./function";
import functionData from "./function-data";
let equationParse = {};
let GlobalObject = global || window;
// 获取变量名
const getVarName = (index) => {
  let str = Number(index + 10).toString(16);
  return `tv_${str}`;
};
/*转换参数对象为数组并按长度排序*/
const parseVariateObjToArr = function (variateObj) {
  let list = [];
  for (let key in variateObj) {
    let obj = {};
    obj.key = key;
    obj.value = variateObj[key];
    list.push(obj);
  }
  list.sort((a, b) => {
    return b.key.length - a.key.length;
  });
  return list;
};
/*替换表达式*/
const expressionReplaceAll = function (expression, srcStr, str) {
  let newExpression = expression;
  // eslint-disable-next-line no-constant-condition
  while (1) {
    let tmp = newExpression.replace(srcStr, str);
    if (newExpression === tmp) {
      break;
    } else {
      newExpression = tmp;
    }
  }
  return newExpression;
};
/*执行代码*/
const loadJsFun = (code, expression) => {
  return Function(`"use strict";
        var window = null;
        var location = null;
        var alert = null;
        ${code} 
        return ${expression}`)();
};
/*获取随机数*/
const getRandomStr = () => {
  let a = Math.random().toString(16).replace("0.", "");
  let b = Math.random().toString(16).replace("0.", "");
  return a + "_" + b;
};
// 执行表达式
const equationExecute = function (expression, variateObj) {
  // 处理160编码的特殊字符
  let Re160 = new RegExp(String.fromCharCode(160), "g");
  expression = expression.replace(Re160, " ");
  let run_eqp_obj_obj_name = `run_eqp_obj_obj_${getRandomStr()}`;
  let varObj = {};
  let index = 0;
  let variateList = parseVariateObjToArr(variateObj);
  for (let i = 0; i < variateList.length; i++) {
    let varItem = variateList[i];
    let name = getVarName(index);
    varObj[name] = varItem.value;
    // 针对undefined 处理为null
    if (varObj[name] === undefined) {
      varObj[name] = null;
    }
    let objName = `${run_eqp_obj_obj_name}.${name} `;
    expression = expressionReplaceAll(expression, varItem.key, objName);
    index++;
  }
  GlobalObject.run_eqp_fun_obj = funObj;
  GlobalObject[run_eqp_obj_obj_name] = varObj;
  // 替换函数对象
  for (let k in funObj) {
    let re = new RegExp(`${k}\\(`, "g");
    if (expression.search(re) === -1) {
      continue;
    }
    let searchIndex = 0;
    let reStr = `${k}(`;
    // eslint-disable-next-line no-constant-condition
    while (1) {
      if (searchIndex + 1 >= expression.length) {
        break;
      }
      let i = expression.indexOf(reStr, searchIndex);
      let ti = expression.indexOf(`${k} (`, searchIndex);
      if ((i === -1 && ti >= 0) || (i >= 0 && ti >= 0 && ti < i)) {
        i = ti;
        reStr = `${k} (`;
      }
      if (i !== -1) {
        searchIndex = i + reStr.length;
        let isMatch = false;
        if (i === 0) {
          isMatch = true;
        } else {
          let char = expression.charAt(i - 1);
          if (char.search(/[0-9a-zA-Z]/) === -1) {
            isMatch = true;
          }
        }
        if (isMatch) {
          let s1 = expression.substr(0, i);
          let s2 = expression.substr(i + reStr.length);
          let s3 = ` run_eqp_fun_obj.${k}(`;
          expression = `${s1}${s3}${s2}`;
          searchIndex = i + s3.length;
        }
      } else {
        break;
      }
    }
  }
  let andRe = new RegExp(" AND ", "g");
  expression = expression.replace(andRe, " && ");
  let orRe = new RegExp(" OR ", "g");
  expression = expression.replace(orRe, " || ");

  let paramsCode = "";
  let expressionStr = paramsCode + " " + expression;
  try {
    // eslint-disable-next-line no-eval
    let value = loadJsFun(paramsCode, expression);
    return value;
  } catch (e) {
    if (GlobalObject.console) {
      GlobalObject.console.warn(e, expressionStr);
    } else {
      throw e;
    }
    throw new Error("表达式解析错误！");
  } finally {
    delete GlobalObject[run_eqp_obj_obj_name];
  }
};

equationParse.equationExecute = equationExecute;
equationParse.functionLibrary = funObj;
equationParse.functionData = functionData;

// eslint-disable-next-line no-unused-vars
let install = function (Vue, options) {
  Vue.prototype.$equationParse = equationParse;
};
equationParse.install = install;
// auto install
if (typeof GlobalObject !== "undefined" && GlobalObject.Vue) {
  install(GlobalObject.Vue);
}
GlobalObject.equationParse = equationParse;

export default equationParse;
