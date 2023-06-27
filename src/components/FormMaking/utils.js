export default {
  ObjectHasKey(options = {}, key) {
    return Object.prototype.hasOwnProperty.call(options, key);
  },
  // 映射element组件
  componentMapByEle: {
    input: "el-input",
    textarea: "el-input",
    number: "el-input-number",
    radio: "el-radio-group",
    checkbox: "el-checkbox-group",
    time: "el-time-picker",
    date: "el-date-picker",
    rate: "el-rate",
    color: "el-color-picker",
    select: "el-select",
    switch: "el-switch",
    slider: "el-slider",
    text: "div",
    imgupload: "el-upload",
    editor: "div",
    cascader: "el-cascader",
    grid: "div",
  },
  // 递归函数，根据属性层级逐级获取值
  getValue(obj, keys) {
    const key = keys.shift();
    if (obj && typeof obj === "object" && key in obj) {
      if (keys.length === 0) {
        return obj[key];
      } else {
        return this.getValue(obj[key], keys);
      }
    }
    return null;
  },
  // 递归函数，根据属性层级逐级设置值
  setValue(obj, keys, value) {
    const key = keys.shift();
    if (keys.length === 0) {
      obj[key] = value;
    } else {
      if (obj && typeof obj === "object" && key in obj) {
        this.setValue(obj[key], keys, value);
      }
    }
  },
  getComponentKeys(obj) {
    let fields = [];
    for (let key in obj) {
      fields.push(key);
    }
  },
};
