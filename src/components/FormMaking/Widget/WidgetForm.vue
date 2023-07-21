<template>
  <div class="widget-form-container">
    <div v-if="widgetForm.list.length == 0" class="form-empty">{{ $t("fm.description.containerEmpty") }}</div>
    <el-row :gutter="widgetForm.config.gutter">
      <el-form
        :size="widgetForm.config.size"
        :disabled="widgetForm.config.disabled"
        :label-suffix="widgetForm.config.labelSuffix"
        :label-position="widgetForm.config.labelPosition"
        :inline="widgetForm.config.inline"
        :label-width="widgetForm.config.labelWidth + 'px'"
      >
        <draggable
          class=""
          v-model="widgetForm.list"
          v-bind="{
            group: 'people',
            ghostClass: 'ghost',
            animation: 200,
            handle: '.drag-widget',
          }"
          @add="handleWidgetAdd"
        >
          <transition-group name="fade" tag="div" class="widget-form-list clearfix">
            <el-col
              v-for="(element, index) in widgetForm.list"
              :span="element.options.span"
              :key="element.key || element.model"
              :data-type="element.type"
            >
              <ComponentEditor
                :index="index"
                :active="selectWidget.key === element.key"
                @action="(arg) => handleActionEditor({ ...arg, list: widgetForm.list, index })"
              >
                <template v-if="element.type == 'grid'">
                  <el-row
                    class="widget-col widget-view"
                    v-if="element && element.key"
                    :key="element.key"
                    type="flex"
                    :class="{ active: selectWidget.key == element.key }"
                    :gutter="element.options.gutter ? element.options.gutter : 0"
                    :justify="element.options.justify"
                    :align="element.options.align"
                    @click.native="handleSelectWidget(index)"
                  >
                    <el-col v-for="(col, colIndex) in element.options.columns" :key="colIndex" :span="col.span ? col.span : 0" :data-type="col.type">
                      <draggable
                        v-model="col.list"
                        :no-transition-on-drag="true"
                        v-bind="{
                          group: 'people',
                          ghostClass: 'ghost',
                          animation: 200,
                          handle: '.drag-widget',
                        }"
                        @end="handleColMoveEnd"
                        @add="handleWidgetColAdd($event, element, colIndex)"
                      >
                        <transition-group name="fade" tag="div" class="widget-col-list">
                          <template v-for="(el, i) in col.list">
                            <ComponentEditor
                              :key="el.key"
                              :index="i"
                              :active="selectWidget.key === el.key"
                              @action="(arg) => handleActionEditor({ ...arg, list: col.list, index: i })"
                            >
                              <widget-form-item :key="el.key" v-if="el.key" :element="el" :select.sync="selectWidget" :index="i" :data="col">
                              </widget-form-item>
                            </ComponentEditor>
                          </template>
                        </transition-group>
                      </draggable>
                    </el-col>
                  </el-row>
                </template>
                <template v-else>
                  <widget-form-item
                    v-if="element && element.key"
                    :element="element"
                    :select.sync="selectWidget"
                    :index="index"
                    :data="widgetForm"
                  ></widget-form-item>
                </template>
              </ComponentEditor>
            </el-col>
          </transition-group>
        </draggable>
      </el-form>
    </el-row>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
import WidgetFormItem from "./WidgetFormItem";
import ComponentEditor from "../components/ComponentEditor/main.vue";
import { cloneDeep } from "lodash";

export default {
  components: {
    Draggable,
    WidgetFormItem,
    ComponentEditor,
  },
  props: ["select"],
  inject: ["vm"],
  data() {
    return {
      selectWidget: this.select,
    };
  },
  computed: {
    widgetForm() {
      return this.vm.widgetForm;
    },
  },
  mounted() {
    document.body.ondrop = function (event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isFirefox) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  },
  methods: {
    handleMove() {
      console.log("move----");
    },
    handleColMoveEnd({ newIndex, oldIndex }, row, colIndex) {
      console.log("moveEnd-----", newIndex, oldIndex, row, colIndex);
    },
    handleSelectWidget(index) {
      console.log(index, "#####");
      this.selectWidget = this.widgetForm.list[index];
    },
    handleWidgetAdd(evt) {
      console.log("add", evt, "to", evt.to);
      const newIndex = evt.newIndex;

      //为拖拽到容器的元素添加唯一 key
      const key = Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
      this.$set(this.widgetForm.list, newIndex, {
        ...cloneDeep(this.widgetForm.list[newIndex]),
        options: {
          ...cloneDeep(this.widgetForm.list[newIndex].options),
          remoteFunc: "func_" + key,
        },
        key,
        // 绑定键值
        model: this.widgetForm.list[newIndex].type + "_" + key,
        rules: [],
      });
      this.selectWidget = this.widgetForm.list[newIndex];
    },
    handleWidgetColAdd($event, row, colIndex) {
      console.log("coladd", $event, row, colIndex);
      const newIndex = $event.newIndex;
      const oldIndex = $event.oldIndex;
      const item = $event.item;

      // 防止布局元素的嵌套拖拽
      if (item.dataset.type === "grid") {
        // 如果是列表中拖拽的元素需要还原到原来位置
        item.tagName === "DIV" && this.widgetForm.list.splice(oldIndex, 0, row.options.columns[colIndex].list[newIndex]);

        row.options.columns[colIndex].list.splice(newIndex, 1);
        this.$message.warning("栅格布局不允许嵌套");
        return false;
      }

      // console.log("from", item);

      const key = Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);

      this.$set(row.options.columns[colIndex].list, newIndex, {
        ...cloneDeep(row.options.columns[colIndex].list[newIndex]),
        options: {
          ...cloneDeep(row.options.columns[colIndex].list[newIndex].options),
          remoteFunc: "func_" + key,
        },
        key,
        // 绑定键值
        model: row.options.columns[colIndex].list[newIndex].type + "_" + key,
        rules: [],
      });

      this.selectWidget = row.options.columns[colIndex].list[newIndex];
    },
    // 删除
    handleWidgetDelete({ index, list }) {
      if (list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {};
        } else {
          this.selectWidget = list[index - 1];
        }
      } else {
        this.selectWidget = list[index + 1];
      }

      this.$nextTick(() => {
        list.splice(index, 1);
      });
    },
    // 复制
    handleWidgetClone({ index, list }) {
      const key = Date.parse(new Date().toString()) + "_" + Math.ceil(Math.random() * 99999);
      let cloneData = {
        ...cloneDeep(list[index]),
        options: {
          ...cloneDeep(list[index].options),
          remoteFunc: "func_" + key,
        },
        key,
        model: list[index].type + "_" + key,
        rules: list[index].rules || [],
      };
      list.splice(index, 0, cloneData);

      this.$nextTick(() => {
        this.selectWidget = list[index + 1];
      });
    },

    // 操作
    handleActionEditor(arg) {
      // 复制
      if (arg.name === "clone") {
        this.handleWidgetClone(arg);
      } else if (arg.name === "delete") {
        // 删除
        this.handleWidgetDelete(arg);
      }
    },
  },
  watch: {
    select(val) {
      this.selectWidget = val;
    },
    selectWidget: {
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true,
    },
  },
};
</script>
<style scoped lang="scss">
@import "../styles/index.scss";
</style>
