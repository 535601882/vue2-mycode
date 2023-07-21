/**
 * 利用字符串表达式操作对象
 * @param obj
 * @returns {{getValue: *, setValue: *}}
 */

// var obj = {
//   name: 1,
//   child: {
//     name: 1.1,
//     list: [
//       {
//         name: "list name1"
//       },
//       {
//         name: "list name2"
//       }
//     ]
//   }
// }
// let expressionForObject = this.$utils.ExpressionForObject(obj)
// console.log(expressionForObject.setValue('child.list[1].name',"list name2 222 "))
// console.log(expressionForObject.setValue('child.list[2]',{name: "list name3 "}))
// console.log(expressionForObject.getValue('child.list[1].name'),obj)
export function ExpressionForObject(obj) {
  const getValue = (key) => {
    return new Function("obj", `with(obj){return ${key}}`)(obj);
  };

  const setValue = (key, value) => {
    return new Function("obj", "value", `with(obj){return ${key}=value}`)(obj, value);
  };
  return {
    getValue,
    setValue,
  };
}

export default {
  ExpressionForObject,
};