import Draggable from "vuedraggable";
import setting from "../setting";
import utils from "../utils";

export default {
  components: {
    Draggable,
  },
  inject: ["vm"],
  data() {
    return {
      utils,
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null,
      },
    };
  },
  computed: {
    // 是否有选中组件
    isWidgetFormSelect() {
      if (this.widgetFormSelect && Object.keys(this.widgetFormSelect).length > 0) {
        return true;
      }
      return false;
    },
    widgetFormSelect() {
      return this.vm.widgetFormSelect;
    },
    widgetFormConfig() {
      return this.vm.widgetForm.config;
    },
    attributeConfig() {
      return setting.attributeConfig;
    },
  },
  methods: {
    handleOptionsRemove(index) {
      if (this.widgetFormSelect.type === "grid") {
        this.widgetFormSelect.columns.splice(index, 1);
      } else {
        this.widgetFormSelect.options.options.splice(index, 1);
      }
    },
    handleAddOption() {
      if (this.widgetFormSelect.options.showLabel) {
        this.widgetFormSelect.options.options.push({
          value: this.$t("fm.config.widget.newOption"),
          label: this.$t("fm.config.widget.newOption"),
        });
      } else {
        this.widgetFormSelect.options.options.push({
          value: this.$t("fm.config.widget.newOption"),
        });
      }
    },
    handleAddColumn() {
      this.widgetFormSelect.columns.push({
        span: "",
        list: [],
      });
    },
    generateRule() {
      this.widgetFormSelect.rules = [];
      Object.keys(this.validator).forEach((key) => {
        if (this.validator[key]) {
          this.widgetFormSelect.rules.push(this.validator[key]);
        }
      });
    },
    handleSelectMuliple(value) {
      if (value) {
        if (this.widgetFormSelect.options.defaultValue) {
          this.widgetFormSelect.options.defaultValue = [this.widgetFormSelect.options.defaultValue];
        } else {
          this.widgetFormSelect.options.defaultValue = [];
        }
      } else {
        if (this.widgetFormSelect.options.defaultValue.length > 0) {
          this.widgetFormSelect.options.defaultValue = this.widgetFormSelect.options.defaultValue[0];
        } else {
          this.widgetFormSelect.options.defaultValue = "";
        }
      }
    },

    validateRequired(val) {
      if (val) {
        this.validator.required = { required: true, message: `${this.widgetFormSelect.name}${this.$t("fm.config.widget.validatorRequired")}` };
      } else {
        this.validator.required = null;
      }

      this.$nextTick(() => {
        this.generateRule();
      });
    },

    validateDataType(val) {
      if (!this.show) {
        return false;
      }

      if (val) {
        this.validator.type = { type: val, message: this.widgetFormSelect.name + this.$t("fm.config.widget.validatorType") };
      } else {
        this.validator.type = null;
      }

      this.generateRule();
    },
    valiatePattern(val) {
      if (!this.show) {
        return false;
      }

      if (val) {
        this.validator.pattern = { pattern: val, message: this.widgetFormSelect.name + this.$t("fm.config.widget.validatorPattern") };
      } else {
        this.validator.pattern = null;
      }

      this.generateRule();
    },
  },
  watch: {
    "widgetFormSelect.options.isRange": function (val) {
      if (typeof val !== "undefined") {
        if (val) {
          this.widgetFormSelect.options.defaultValue = null;
        } else {
          if (Object.keys(this.widgetFormSelect.options).indexOf("defaultValue") >= 0) this.widgetFormSelect.options.defaultValue = "";
        }
      }
    },
    "widgetFormSelect.options.required": function (val) {
      this.validateRequired(val);
    },
    "widgetFormSelect.options.dataType": function (val) {
      this.validateDataType(val);
    },
    "widgetFormSelect.options.pattern": function (val) {
      this.valiatePattern(val);
    },
    "widgetFormSelect.name": function () {
      if (this.widgetFormSelect.options) {
        this.validateRequired(this.widgetFormSelect.options.required);
        this.validateDataType(this.widgetFormSelect.options.dataType);
        this.valiatePattern(this.widgetFormSelect.options.pattern);
      }
    },
  },
  render(createElement) {
    const { getValue, setValue } = this.$utils.ExpressionForObject(this.widgetFormSelect);
    var self = this;
    if (!self.isWidgetFormSelect) return createElement("div", "拖拽字段进行配置");
    // 函数用于创建el-form-item
    function createFormItem(label, content) {
      return createElement(
        "el-form-item",
        {
          props: {
            label,
          },
        },
        content
      );
    }

    // 函数用于创建el-input
    function createInput(model, props = {}, condition = true) {
      const inputProps = {
        value: getValue(model),
        clearable: true,
        ...props,
      };
      if (!condition) {
        setValue(model, null);
      }

      return createElement("el-input", {
        props: inputProps,
        directives: [
          {
            name: "show",
            value: condition,
          },
        ],
        on: {
          input: function (value) {
            setValue(model, value);
          },
        },
      });
    }

    // 函数用于创建el-switch
    function createSwitch(model, cb) {
      return createElement("el-switch", {
        props: {
          value: getValue(model),
        },
        on: {
          change: function (value) {
            setValue(model, value);
            if (typeof cb === "function") {
              cb(value);
            }
          },
        },
      });
    }

    // 函数用于创建el-radio-group
    function createRadioGroup(model, options, cb) {
      var radioButtons = options.map(function (option, index) {
        if (typeof cb === "function") return cb(option, index);
        return createElement(
          "el-radio-button",
          {
            props: {
              label: option.value,
            },
          },
          option.label
        );
      });

      return createElement(
        "el-radio-group",
        {
          props: {
            value: getValue(model),
          },
          on: {
            input: function (value) {
              setValue(model, value);
            },
          },
        },
        radioButtons
      );
    }

    // 函数用于创建el-slider
    function createSlider(model, props = {}) {
      return createElement("el-slider", {
        props: {
          value: getValue(model),
          "input-size": self.attributeConfig.size,
          ...props,
        },
        on: {
          input: function (value) {
            setValue(model, value);
          },
        },
      });
    }

    // 函数用于创建el-input-number
    function createInputNumber(model, props = {}) {
      return createElement("el-input-number", {
        props: {
          value: getValue(model),
          clearable: true,
          ...props,
        },
        on: {
          input: function (value) {
            setValue(model, value);
          },
        },
      });
    }

    // 函数用于创建el-checkbox
    // eslint-disable-next-line no-unused-vars
    function createCheckbox(model) {
      return createElement("el-checkbox", {
        props: {
          value: getValue(model),
        },
        on: {
          input: function (value) {
            setValue(model, value);
          },
        },
      });
    }

    // 函数用于创建el-select
    function createSelect(model, options = [], cb) {
      var selectOptions = options.map(function (option) {
        return createElement("el-option", {
          props: {
            value: option.value,
            label: option.label,
          },
        });
      });

      return createElement(
        "el-select",
        {
          props: {
            value: getValue(model),
          },
          on: {
            input: function (value) {
              setValue(model, value);
            },
            change: function (value) {
              let obj = options.find((item) => item.value === value);
              if (typeof cb === "function") {
                cb(obj);
              }
            },
          },
        },
        selectOptions
      );
    }

    // 函数用于创建el-color-picker
    function createColorPicker(model, props = {}) {
      return createElement("el-color-picker", {
        props: {
          value: getValue(model),
          ...props,
        },
        on: {
          input: function (value) {
            setValue(model, value);
          },
        },
      });
    }

    // 函数用于创建el-rate
    function createRate(model, props = {}) {
      return createElement("el-rate", {
        props: {
          value: getValue(model),
          ...props,
        },
        on: {
          input: function (value) {
            setValue(model, value);
          },
        },
      });
    }

    // 函数用于创建el-time-picker
    // eslint-disable-next-line no-unused-vars
    function createTimePicker(model) {
      return createElement("el-time-picker", {
        props: {
          value: getValue(model),
          arrowControl: self.widgetFormSelect.options.arrowControl,
          "value-format": self.widgetFormSelect.options.format,
        },
        on: {
          input: function (value) {
            setValue(model, value);
          },
        },
      });
    }

    // 函数用于创建el-checkbox-group
    function createCheckboxGroup(model, options = [], cb) {
      var checkboxes = options.map(function (option, index) {
        if (typeof cb === "function") return cb(option, index);
        return createElement(
          "el-checkbox",
          {
            props: {
              label: option.value,
            },
          },
          option.label
        );
      });

      return createElement(
        "el-checkbox-group",
        {
          props: {
            value: getValue(model),
          },
          on: {
            input: function (value) {
              setValue(model, value);
            },
          },
        },
        checkboxes
      );
    }

    // 创建options选项
    /**
     *
     * @param model
     * @param createFn
     * @returns {*}
     */
    function createOptions(model, options, componentName, createFn) {
      let optionsComponent = createFn(model, options, function (item, index) {
        return createElement("li", { key: index }, [
          createElement(
            componentName,
            {
              props: {
                label: item.value,
              },
              style: "margin-right: 5px",
            },
            [
              createElement("el-input", {
                style: {
                  width: "90px",
                },
                props: {
                  value: item.label,
                },
                attrs: {
                  placeholder: "label",
                },
                on: {
                  input: (value) => {
                    item.label = value;
                  },
                },
              }),
              createElement("el-input", {
                style: "width: 90px",
                props: {
                  value: item.value,
                },
                attrs: {
                  placeholder: "value",
                },
                on: {
                  input: (value) => {
                    item.value = value;
                  },
                },
              }),
            ]
          ),
          createElement(
            "i",
            {
              class: "drag-item",
              style: "font-size: 16px; margin: 0 5px; cursor: move",
            },
            [
              createElement("i", {
                class: "iconfont icon-icon_bars",
              }),
            ]
          ),
          createElement("el-button", {
            props: {
              circle: true,
              plain: true,
              type: "danger",
              size: "mini",
              icon: "el-icon-minus",
            },
            style: "padding: 4px; margin-left: 5px",
            on: {
              click: () => {
                self.widgetFormSelect.options.options.splice(index, 1);
              },
            },
          }),
        ]);
      });
      return createElement(
        "div",
        // { style: 'margin-left: 22px' },
        [
          optionsComponent,
          createElement(
            "el-button",
            {
              props: {
                type: "text",
              },
              on: {
                click: () => {
                  self.widgetFormSelect.options.options.push({
                    label: `Option ${self.widgetFormSelect.options.options.length + 1}`,
                    value: `Option ${self.widgetFormSelect.options.options.length + 1}`,
                  });
                },
              },
            },
            self.$t("fm.actions.addOption")
          ),
        ]
      );
    }
    return createElement(
      "el-form",
      {
        props: { ...self.attributeConfig },
      },
      ["model", "name", "labelWidth", ...Object.keys(self.widgetFormSelect.options)].map((key) => {
        let $slots = null;
        switch (key) {
          case "model":
          case "name":
            $slots = createInput(key);
            break;
          case "labelWidth":
            $slots = createInputNumber(key, {
              min: 0,
              step: 1,
            });
            break;
          case "span":
            $slots = createSlider("options.span", {
              min: 0,
              max: 24,
            });
            break;
          case "size":
            $slots = [
              this.$t("fm.config.widget.width"),
              createInputNumber("options.size.width", {
                min: 0,
                max: 200,
                "controls-position": "right",
              }),
              this.$t("fm.config.widget.height"),
              createInputNumber("options.size.height", {
                min: 0,
                max: 200,
                "controls-position": "right",
              }),
            ];
            break;
          case "placeholder":
          case "startPlaceholder":
          case "endPlaceholder":
          case "width":
            $slots = createInput(`options.${key}`);
            break;
          case "inline":
            $slots = [
              createRadioGroup("options.inline", [
                {
                  label: self.$t("fm.config.widget.block"),
                  value: false,
                },
                {
                  label: self.$t("fm.config.widget.inline"),
                  value: true,
                },
              ]),
            ];
            break;
          case "showInput":
            $slots = createSwitch(`options.${key}`);
            break;
          case "min":
          case "max":
          case "step":
          case "gutter":
            $slots = createInputNumber(`options.${key}`, {
              step: 1,
            });
            break;
          case "precision":
            // 精度
            $slots = createInputNumber(`options.${key}`, {
              min: 0,
              max: 100,
              step: 1,
            });
            break;
          case "controlsPosition":
            // 按钮位置
            $slots = createRadioGroup(`options.${key}`, [
              {
                label: "默认",
                value: "",
              },
              {
                label: "右侧",
                value: "right",
              },
            ]);
            break;
          case "multiple":
            $slots = createSwitch("options.multiple", function (value) {
              self.widgetFormSelect.options.defaultValue = value ? [] : "";
            });
            break;
          case "filterable":
          case "allowHalf":
          case "showLabel":
          case "showWordLimit":
          case "readonly":
          case "disabled":
          case "editable":
          case "clearable":
          case "arrowControl":
          case "isDelete":
          case "isEdit":
            $slots = createSwitch(`options.${key}`);
            break;
          case "options":
            // 单选
            if (self.widgetFormSelect.type === "radio" || (self.widgetFormSelect.type === "select" && !self.widgetFormSelect.options.multiple)) {
              $slots = createOptions("options.defaultValue", self.widgetFormSelect.options.options, "el-radio", createRadioGroup);
            } else if (
              self.widgetFormSelect.type === "checkbox" ||
              (self.widgetFormSelect.type === "select" && self.widgetFormSelect.options.multiple)
            ) {
              $slots = createOptions("options.defaultValue", self.widgetFormSelect.options.options, "el-checkbox", createCheckboxGroup);
            }
            break;
          case "cascader":
            // todo
            return createFormItem(self.$t(`fm.config.widget.${key}`), [createSwitch("options.multiple")]);
          case "defaultValue":
            if (["textarea", "input", "text", "time"].includes(self.widgetFormSelect.type)) {
              $slots = createInput(`options.defaultValue`);
            } else if (["rate"].includes(self.widgetFormSelect.type)) {
              $slots = [
                createRate(`options.defaultValue`, {
                  max: self.widgetFormSelect.options.max,
                  allowHalf: self.widgetFormSelect.options.allowHalf,
                }),
                createElement(
                  "el-button",
                  {
                    attrs: {
                      type: "text",
                    },
                    directives: [
                      {
                        name: "if",
                        value: self.widgetFormSelect.type === "rate",
                      },
                    ],
                    style: {
                      display: "inline-block",
                      "vertical-align": "middle",
                      "margin-left": "10px",
                    },
                    on: {
                      click: function () {
                        self.widgetFormSelect.options.defaultValue = 0;
                      },
                    },
                  },
                  [self.$t("fm.actions.clear")]
                ),
              ];
            } else if (["color"].includes(self.widgetFormSelect.type)) {
              $slots = createColorPicker("options.defaultValue", {
                showAlpha: self.widgetFormSelect.options.allowHalf,
              });
            } else if (["switch"].includes(self.widgetFormSelect.type)) {
              $slots = createSwitch("options.defaultValue");
            } else if (["checkbox"].includes(self.widgetFormSelect.type)) {
              $slots = createCheckboxGroup("options.defaultValue", self.widgetFormSelect.options.options);
            } else {
              $slots = createInput(`options.defaultValue`);
            }
            break;
          case "maxlength":
            $slots = createInputNumber(`options.${key}`, {
              min: -1,
            });
            break;
          case "type":
            if (["date"].includes(self.widgetFormSelect.type)) {
              return createElement("div", [
                createFormItem(self.$t(`fm.config.widget.showType`), [
                  createSelect(`options.${key}`, self.widgetFormSelect.options.showType, function (obj) {
                    if (obj) {
                      self.widgetFormSelect.options.format = obj.format;
                    }
                  }),
                ]),
                createFormItem(self.$t(`fm.config.widget.isTimestamp`), [createSwitch(`options.timestamp`)]),
                createFormItem(self.$t(`fm.config.widget.format`), [createInput(`options.format`)]),
              ]);
            }
            if (["time"].includes(self.widgetFormSelect.type)) {
              return createElement("div", [createFormItem(self.$t(`fm.config.widget.format`), [createInput(`options.format`)])]);
            }
            break;
          case "required":
            $slots = createElement("div", [
              createSwitch(`options.${key}`),
              createInput(
                `options.pattern`,
                {
                  placeholder: "请输入正则表达式",
                },
                self.widgetFormSelect.options.required
              ),
            ]);
            break;
          case "justify":
            // start/end/center/space-around/space-between
            $slots = createSelect("options.justify", [
              {
                label: "start",
                value: "start",
              },
              {
                label: "end",
                value: "end",
              },
              {
                label: "center",
                value: "center",
              },
              {
                label: "space-around",
                value: "space-around",
              },
              {
                label: "space-between",
                value: "space-between",
              },
            ]);
            break;
          case "align":
            // top/middle/bottom
            $slots = createSelect("options.align", [
              {
                label: "top",
                value: "top",
              },
              {
                label: "middle",
                value: "middle",
              },
              {
                label: "bottom",
                value: "bottom",
              },
            ]);
            break;
          case "columns":
            $slots = [
              (self.widgetFormSelect.options.columns || []).map((item, index) => {
                return createElement(
                  "div",
                  {
                    props: {
                      key: index,
                    },
                  },
                  [
                    createInputNumber(`options.columns[${index}].span`, {
                      min: 1,
                      step: 1,
                      "controls-position": "right",
                    }),
                    createElement("el-button", {
                      props: {
                        type: "danger",
                        icon: "el-icon-delete",
                        circle: true,
                      },
                      on: {
                        click: () => {
                          self.widgetFormSelect.options.columns.splice(index, 1);
                        },
                      },
                    }),
                  ]
                );
              }),
              createElement(
                "el-button",
                {
                  props: {
                    type: "primary",
                  },
                  on: {
                    click: () => {
                      self.widgetFormSelect.options.columns.push({
                        span: 12,
                        list: [],
                      });
                    },
                  },
                },
                "添加"
              ),
            ];
            break;
          default:
            // 不存在 终止
            return;
        }
        return createFormItem(self.$t(`fm.config.widget.${key}`), Array.isArray($slots) ? $slots : [$slots]);
      })
    );
  },
};
