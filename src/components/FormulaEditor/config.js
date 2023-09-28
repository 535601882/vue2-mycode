import { v4 as uuidv4 } from "uuid";
export const data = [
  {
    name: "+",
  },
  {
    name: "-",
  },
  {
    name: "*",
  },
  {
    name: "/",
  },
  {
    name: "%",
  },
  {
    name: "Math.floor( )",
  },
  {
    name: "Math.ceil( )",
  },
  {
    name: "Math.max( )",
  },
  {
    name: "Math.min( )",
  },
  {
    name: ">=",
  },
  {
    name: "&&",
  },
];
export const paramData = [
  {
    label: "最大高度测试一下长度",
    value: "maxHeight",
  },
  {
    label: "最小高度",
    value: "minHeight",
  },
  {
    label: "最大宽度",
    value: "maxWidth",
  },
  {
    label: "最小宽度",
    value: "minWidth",
  },
  {
    label: "大小",
    value: "size",
  },
  {
    label: "重量",
    value: "weight",
  },
];
export const retuenData = (data) => {
  return data.map((v) => {
    return {
      ...v,
      id: uuidv4(),
    };
  });
};

export const tabs = [
  {
    name: "公式",
    type: "0",
    id: uuidv4(),
    data: retuenData(data),
  },
  {
    name: "参数",
    type: "1",
    id: uuidv4(),
    data: retuenData(paramData),
  },
];
