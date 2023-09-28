<!--公式编辑器-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="参数" name="0">
            <div v-for="item in items" :key="item.value" class="about-slider-list">
              <span>{{ item.label }}</span>
              <el-button size="small" @click="insertCursor(item)">选择</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="数学公式" name="1">
            <el-collapse>
              <el-collapse-item :title="funItem.label" :name="funItem.label" :key="funItem.label" v-for="funItem in equationParse.functionData">
                <div v-for="item in funItem.children" :key="item.label" class="about-slider-list">
                  {{ item.label }} <el-button size="small" @click="insertCursor(item)">选择</el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="14">
        <div>
          <div
            id="atInput"
            ref="refAtInput"
            contenteditable="true"
            @input="input"
            @blur="() => recordRange()"
            @click="click"
            @keydown.left="keyleft"
            @keydown.right="keyright"
            @paste.stop.prevent
          />
          <el-button @click="submit">确定</el-button>
        </div>
        <div class="result">
          <h4>公式中参数集合:</h4>
          <div v-for="item in paramOVList" :key="item.id">
            {{ item }}
          </div>
          <h4>实时innerText: {{ inputText }}</h4>
          <h4>公式-key: {{ expressStr }}</h4>
          <h4>公式-value: {{ volidStr }}</h4>
          <h4>公式校验返回值: {{ volid }}</h4>
          <h4>实时innerHTML: {{ inputHTML }}</h4>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<!--https://github.com/x-xBai/formula/blob/7f9f6563a33aa3eab68544376ff328ff52f14356/src/views/CalculationEngine.vue#L65-->
<script>
import { paramData } from "./config.js";
import { v4 as uuidv4 } from "uuid";
import equationParse from "./lib/index";
/**
 * js使用canvas将文字转换成图像数据base64
 * @param {string}    text              文字内容  "abc"
 * @param {string}    fontsize          文字大小  20
 * @param {function}  fontcolor         文字颜色  "#000"
 * @param {boolean}   imgBase64Data     图像数据
 */
// eslint-disable-next-line no-unused-vars
const textBecomeImg = (text, fontsize = 16, fontcolor = "#ccc") => {
  var canvas = document.createElement("canvas");
  var $buHeight = 0;
  if (fontsize <= 32) {
    $buHeight = 1;
  } else if (fontsize > 32 && fontsize <= 60) {
    $buHeight = 2;
  } else if (fontsize > 60 && fontsize <= 80) {
    $buHeight = 4;
  } else if (fontsize > 80 && fontsize <= 100) {
    $buHeight = 6;
  } else if (fontsize > 100) {
    $buHeight = 10;
  }
  canvas.height = fontsize + $buHeight;
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = fontcolor;
  context.font = fontsize + "px Arial";
  context.textBaseline = "middle";
  context.fillText(text, 5, fontsize / 2);

  canvas.width = context.measureText(text).width;
  context.fillStyle = fontcolor;
  context.font = 14 + "px Arial";
  context.textAlign = "left";
  context.textBaseline = "middle";
  context.fillText(text, 5, fontsize / 2);

  var dataUrl = canvas.toDataURL("image/png");
  return dataUrl;
};

export default {
  name: "index",
  components: {},
  data() {
    return {
      activeName: "0",
      inputHTML: "", // 实时输入内容 innerHTML
      // inputHTML:
      //   "<span class='__at_span' data-select-id='3773f96f-4857-43a5-b6a0-531a59a6d3f1' contenteditable='false'>最大高度</span>&ZeroWidthSpace;", // 实时输入内容 innerHTML
      inputText: "", // 实时innerText
      volid: null,
      volidStr: "",
      expressStr: "",
      focusOffset: 0, // 缓存光标所在位置
      focusNode: {}, // 缓存光标所在节点
      focusRange: null, // 缓存选中的range
      selectIds: [], // 选中参数集合
      observer: {}, // dom 监听器
      items: paramData,
      insertIndex: null,
      equationParse,
    };
  },
  computed: {
    paramOVList() {
      let arr = [];
      this.selectIds.forEach((v) => {
        if (!arr.find((j) => j.id === v.id)) {
          arr.push(v);
        }
      });
      return arr;
    },
  },
  methods: {
    initDom() {
      const selection = getSelection();
      const range = selection.getRangeAt(0);
      // 缓存光标所在节点（返回所选内容的结束位置部分所属的节点）
      this.focusNode = selection?.focusNode;
      // 缓存光标所在节点位置
      this.focusOffset = selection?.focusOffset;
      range.setStart(this.focusNode, this.focusOffset);
      range.setEnd(this.focusNode, this.focusOffset);
      // 将 Range 折叠到其边界的端点(true 折叠到 Range 的开始方向，false 折叠到结束方向)
      range.collapse();
      const unsaw = document.createTextNode("\u200B");
      // // 插入不可见文本
      range.insertNode(unsaw);
      // // 光标移动到末尾
      range.collapse();
      range.setEnd(unsaw, 1);
      range.setStart(unsaw, 1);
      range.collapse();
    },
    keyleft(e) {
      console.log("keyleft");
      const range = getSelection().getRangeAt(0);
      const node = range.startContainer;

      console.log("collapsed: " + range.collapsed, "nodeType: " + node.nodeType, "nodeValue: " + node.nodeValue, "startOffset: " + range.startOffset);
      if (range.collapsed && node.nodeType === 3 && node.nodeValue?.startsWith("\u200B") && range.startOffset === 1 && node.previousSibling) {
        e.preventDefault();
        range.setStart(node?.previousSibling?.previousSibling, 0);
        range.setEnd(node.previousSibling?.previousSibling, node.previousSibling?.previousSibling?.nodeValue?.length || 0);
        range.collapse();
      }
    },
    keyright(e) {
      console.log("keyright");
      const range = getSelection()?.getRangeAt(0);
      const node = range?.startContainer;
      console.log("collapsed: " + range.collapsed, "nodeType: " + node.nodeType, "nodeValue: " + node.nodeValue, "startOffset: " + range.startOffset);
      if (node.nextSibling?.nodeName === "SPAN") {
        e.preventDefault();
        range.setStart(node.nextSibling?.nextSibling, 1);
        range.setEnd(node.nextSibling?.nextSibling, node.nextSibling?.nextSibling?.nodeValue.length || 1);
        range.collapse();
      }
    },
    // 选中span标签
    click(e) {
      if (e.target?.nodeName === "SPAN") {
        getSelection()?.getRangeAt(0).selectNode(e.target);
      }
    },
    input(e) {
      console.log("input 数据发生变化", e);
      // 实时输入框的保存
      this.inputHTML = e.target.innerHTML;
    },
    submit() {
      let list = this.nodesToArray(this.$refs.refAtInput.childNodes);
      let str = this.nodesArrayToJson(list);
      console.log("--------", list, str);
      this.inputText = this.$refs.refAtInput.innerText.trim().replace(/\u200B/g, "");
      this.inputHTML = this.$refs.refAtInput.innerHTML;

      console.log(this.inputText, this.inputHTML);
      const { volid, volidStr, expressStr } = this.getParams(this.inputText, this.selectIds);
      let messageObj = {};
      switch (volid) {
        case 1:
          messageObj = {
            message: "请添加公式！",
            type: "warning",
            duration: 2000,
          };
          break;
        case 2:
          messageObj = {
            message: "公式校验成功！",
            type: "success",
            duration: 1000,
          };
          break;
        case 3:
          messageObj = {
            message: "公式不合法，请检查后再提交！",
            type: "error",
            duration: 2000,
          };
          break;
      }
      this.showMessage({ ...messageObj });
      this.volid = volid;
      this.expressStr = expressStr;
      this.volidStr = volidStr;
    },
    /**
     * @str 视图显示字符串 最大高度测试一下长度&&ABS()
     * @list  参数集合
     * @key  表达式
     */
    getParams(str, data) {
      let catchStr = str;
      data.forEach((v) => {
        str = str.replace(v.label, ".".repeat(v.label.length));
      });
      return { ...this.getExpress(catchStr, data) };
    },
    /**
     * @str 视图显示字符串
     * @list 参数集合
     *
     * @expressStr 整合数据 ，传给后端
     * @volidStr 前端校验表达式，判断是否合法【有执行结果】
     */
    getExpress(str, list) {
      let expressStr = str,
        volidStr = str;
      list.forEach((v) => {
        console.log(v.label);
        expressStr = expressStr.replace(v.label, v.key);
        volidStr = volidStr.replace(v.label, v.value);
      });

      return {
        expressStr,
        volidStr,
        volid: this.volidExpress(volidStr),
      };
    },
    /**
     * @any
     * @Number 1 2 3
     * 1 - 空 // 结果为 undefined
     * 2 - 合法 // 结果为 true / false / 或者是一个实际值
     * 3 - 不合法 // 结果 报错 / NaN / Infinity /-Infinity
     */
    volidExpress(exp) {
      let restArr = [NaN, Infinity, -Infinity];
      try {
        let rest = new Function("return " + exp)();
        if (typeof rest === "undefined") return 1;
        if (typeof rest === "number" && restArr.includes(rest)) {
          return 3;
        }
        return 2;
      } catch (error) {
        return 3;
      }
    },
    showMessage({ message, type, duration }) {
      this.$message({
        showClose: true,
        message,
        type,
        duration,
      });
    },
    getIndex(node) {
      if (node.previousElementSibling) {
        this.insertIndex++;
        this.getIndex(node.previousElementSibling);
      }
    },
    // 光标所在位置增加节点
    async insertCursor(item) {
      // 参数选择
      if (this.activeName === "0") {
        this.select(item, "insertCursor");
      } else {
        this.insertFormula(item.label);
      }
    },
    // 插入字段
    select(item, type) {
      // console.log(item);
      const input = this.$refs.refAtInput;
      input.focus();
      console.log("select----", this.focusOffset, this.focusNode);
      const range = getSelection()?.getRangeAt(0);

      let focusStart = this.focusOffset;
      if (type !== "insertCursor") {
        focusStart -= 1;
      }

      // 选中输入的 # 符
      range.setStart(this.focusNode, focusStart);
      range.setEnd(this.focusNode, this.focusOffset);
      // 删除输入的 #
      range.deleteContents();

      this.insertIndex = null;
      const selection = getSelection();
      const node = selection.focusNode;
      this.getIndex(node);
      console.log("insertIndex----", this.insertIndex);

      const element = this.createVaribleNode(item);
      const unsaw = document.createTextNode("\u200B");
      item.selectId = uuidv4();
      this.spliceSelectIds(this.insertIndex, JSON.parse(JSON.stringify(item)));

      // 插入元素节点
      range.insertNode(element);
      // 光标移动到末尾
      range.collapse();
      // 插入不可见文本
      range.insertNode(unsaw);
      // 光标移动到末尾
      range.collapse();
      range.setEnd(unsaw, 1);
      range.setStart(unsaw, 1);
    },
    // 插入公式
    insertFormula(value) {
      // 公式选择
      const input = this.$refs.refAtInput;
      input.focus();
      const selection = getSelection();

      const range = selection?.getRangeAt(0);

      range.setStart(this.focusNode, this.focusOffset);
      range.setEnd(this.focusNode, this.focusOffset);

      // 创建span
      const element = this.createFunctionNode({ value });
      // 插入span
      range.insertNode(element);
      range.collapse();
      // 插入()
      const textNode = document.createTextNode("()"); // 取value值
      range.insertNode(textNode);
      range.collapse();
      // 光标放到括号里
      range.setEnd(textNode, 1);
      range.setStart(textNode, 1);
    },
    // 创建数学方法Node
    // eslint-disable-next-line no-unused-vars
    createFunctionNode({ label, value }) {
      // 创建span
      const element = document.createElement("SPAN");
      element.className = "cm-func";
      element.dataset.value = value; // 统一
      element.contentEditable = false;
      element.setAttribute("executiontype", "function"); // 添加自定义类型属性
      element.innerText = value;
      return element;
    },
    // 创建字段Node
    createVaribleNode({ label, value }) {
      const element = document.createElement("SPAN");
      element.className = "cm-field";
      element.dataset.value = value; // 实际的值value
      element.contentEditable = false;
      element.setAttribute("executiontype", "varible");
      element.innerText = label; // 展示的值label
      return element;
    },
    // 替换选中range todo
    replaceSelectRange(newNode) {
      if (!this.focusRange) return;

      this.focusRange.deleteContents(); // 删除选中的内容
      this.focusRange.insertNode(newNode); // 插入新字段
      this.focusRange.selectNode(newNode); // 选中新字段
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.focusRange); // 恢复选中
      this.focusRange = null; // 清除保存的范围
      const input = this.$refs.refAtInput;
      input.focus(); // 重新聚焦到可编辑元素
    },
    // 将文本转为对应的Obj
    nodesToArray(nodeList) {
      let list = [];
      nodeList.forEach((item) => {
        // 文本
        if (item.nodeType === 3) {
          list.push({
            type: "text",
            value: item.nodeValue,
            label: item.nodeValue,
          });
          // 标签
        } else if (item.nodeType === 1) {
          // 获取标签类型
          let executiontype = item.getAttribute("executiontype");
          if (executiontype) {
            list.push({
              type: executiontype,
              value: item.dataset.value,
              label: item.textContent,
            });
          }
        }
      });
      return list;
    },
    // 将nodesArray转换为可用数据
    nodesArrayToJson(list) {
      let _list = list
        .filter((item) => item.value)
        .map((item) => {
          let obj = { ...item };
          if (item.type === "varible") {
            // 字段
            obj.label = `{${obj.label}}`;
            obj.value = `{${obj.value}}`;
          }
          return obj;
        });
      return {
        label: _list.map((item) => item.label).join(""), //展示
        value: _list.map((item) => item.value).join(""), // 实际值
      };
    },
    // 将保存后的str转换为nodeList
    strToNodes() {},
    /**
     * @focusNode 缓存光标所在节点
     * @focusOffset 缓存光标所在节点位置
     * @desc 记录光标位置
     */
    recordRange() {
      const selection = getSelection();
      const range = selection?.getRangeAt(0);
      // 缓存光标所在节点
      this.focusNode = selection?.focusNode;
      // 缓存光标所在节点位置
      this.focusOffset = selection?.focusOffset;
      // 保存选中范围
      this.focusRange = range.cloneRange();
      console.log("BLUR=========", this.focusNode, this.focusOffset, this.focusRange.toString());
    },
    spliceSelectIds(index, item) {
      this.selectIds.splice(index, 0, item);
    },
    // 粘贴事件
    handlePaste(event) {
      event.preventDefault();
      let paste = (event.clipboardData || window.clipboardData).getData("text");
      paste = paste.toUpperCase();
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      selection.deleteFromDocument();
      selection.getRangeAt(0).insertNode(document.createTextNode(paste));
      selection.collapseToEnd();
    },
    // 修复Enter
    // eslint-disable-next-line no-unused-vars
    fixEnterEvent(e) {
      // console.log('Enter')
      let newNode = document.createElement("br");
      let nodes = [];
      nodes.push(newNode);
      // 去除空文本节点
      // nodes.push(document.createTextNode(''))
      this.insertNodeEditor(nodes, 1);
      // e.preventDefault()
      // e.stopPropagation()
    },
  },
  created() {},
  mounted() {
    const input = this.$refs.refAtInput;
    input.focus();
    this.initDom();
    this.observer = new MutationObserver((mutationsList) => {
      console.log("observer");
      // 添加的元素
      // Array.from(mutationsList.map((e) => Array.from(e.addedNodes)))
      //   .flat()
      //   .filter((e) => e.nodeName === "SPAN")
      //   .map((e) => e.dataset.row)
      //   .forEach(
      //     (row) =>
      //       // !this.selectIds.includes(selectId) &&
      //       // this.selectIds.push(selectId)
      //       // {
      //       //   if (this.selectIds.find(v => v.selectIds))
      //       // }
      //       this.selectIds.splice(this.insertIndex, 0, JSON.parse())
      //   );

      Array.from(mutationsList.map((e) => Array.from(e.removedNodes)))
        .flat()
        .filter((e) => e.nodeName === "SPAN")
        .map((e) => e.dataset.selectId)
        .forEach((selectId) => {
          this.selectIds.find((v) => v.selectId === selectId) &&
            this.selectIds.splice(
              this.selectIds.findIndex((v) => v.selectId === selectId),
              1
            );
        });
    });

    this.observer.observe(input, {
      subtree: true, // 监听所有后代节点
      childList: true, // 监听后代节点增加删除
      attributes: true, // 监听属性
      characterData: true, // 监听字符数据变化
      attributeOldValue: true, // 记录变化前属性值
      characterDataOldValue: true, // 记录变化前字符值
    });

    // 处理粘贴
    // input.addEventListener("paste", this.handlePaste);
    // this.$once('hook:beforeDestroy',() => input.removeEventListener("paste",this.handlePaste) )
  },
  beforeDestroy() {},
};
</script>

<style scoped lang="scss">
#atInput {
  outline: none;
  height: 100px;
  font-size: 14px;
  min-height: 92px;
  padding: 16px 8px;
  line-height: 24px;
  border-radius: 8px;
  border: 1px solid #efefef;
  box-sizing: border-box;
  text-align: left;
}

.about-slider-list {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding: 6px 20px;
}
.result {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 20px;
}
</style>
<style lang="scss">
.cm-field {
  color: #fff;
  display: inline-block;
  padding: 2px 5px;
  background-color: #007bff;
  border-radius: 3px;
  margin: 0 1px;
  font-size: 12px;
  line-height: 1.5;
}
.cm-func {
  color: #ae4597;
  font-weight: 700;
  line-height: 14px;
  margin: 0 1px;
  padding: 0 2px;
}
[contenteditable="true"]:focus {
  outline: 1px solid #007bff;
}
</style>
