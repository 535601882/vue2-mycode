<template>
  <div class="fm-style">
    <el-container class="fm2-container">
      <el-aside width="250px">
        <div class="components-list">
          <template v-if="fields.length">
            <div v-for="field in fields" :key="field.title">
              <div class="widget-cate">{{ $t(field.title) }}</div>
              <template v-if="field.children.length">
                <draggable
                  tag="ul"
                  :list="field.children"
                  v-bind="{
                    group: { name: 'people', pull: 'clone', put: false },
                    sort: false,
                    ghostClass: 'ghost',
                  }"
                  @end="handleMoveEnd"
                  @start="handleMoveStart"
                  :move="handleMove"
                >
                  <template v-for="(item, index) in field.children">
                    <li class="form-edit-widget-label" :data-type="item.type" :class="{ 'no-put': item.type == 'divider' }" :key="index">
                      <a
                        ><i class="icon iconfont" :class="item.icon"></i><span>{{ item.name }}</span></a
                      >
                    </li>
                  </template>
                </draggable>
              </template>
            </div>
          </template>
        </div>
      </el-aside>

      <el-container class="center-container" direction="vertical">
        <el-header class="btn-bar" style="height: 45px">
          <slot name="action"> </slot>
          <el-button v-if="upload" type="text" size="medium" icon="el-icon-upload2" @click="handleUpload">
            {{ $t("fm.actions.import") }}
          </el-button>
          <el-button v-if="clearable" type="text" size="medium" icon="el-icon-delete" @click="handleClear">
            {{ $t("fm.actions.clear") }}
          </el-button>
          <el-button v-if="preview" type="text" size="medium" icon="el-icon-view" @click="handlePreview">
            {{ $t("fm.actions.preview") }}
          </el-button>
          <el-button v-if="generateJson" type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">
            {{ $t("fm.actions.json") }}
          </el-button>
          <!--                        <el-button v-if="generateCode" type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">{{$t('fm.actions.code')}}</el-button>-->
        </el-header>

        <el-main :class="{ 'widget-empty': widgetForm.list.length == 0 }">
          <widget-form v-if="!resetJson" ref="widgetForm" :select.sync="widgetFormSelect"></widget-form>
        </el-main>
      </el-container>

      <el-aside class="widget-config-container">
        <el-container>
          <el-header height="45px">
            <div class="config-tab" :class="{ active: configTab == 'widget' }" @click="configTab = 'widget'">
              {{ $t("fm.config.widget.title") }}
            </div>
            <div class="config-tab" :class="{ active: configTab == 'form' }" @click="configTab = 'form'">
              {{ $t("fm.config.form.title") }}
            </div>
          </el-header>
          <el-main class="config-content">
            <widget-config v-show="configTab == 'widget'"></widget-config>
            <form-config v-show="configTab == 'form'"></form-config>
          </el-main>
        </el-container>
      </el-aside>

      <basic-dialog :visible.sync="previewVisible" @on-close="previewVisible = false" ref="widgetPreview" width="1000px" form>
        <generate-form
          insite="true"
          @on-change="handleDataChange"
          v-if="previewVisible"
          :data="widgetForm"
          :value="widgetModels"
          :remote="remoteFuncs"
          ref="generateForm"
        >
          <template v-slot:blank="scope">
            Width <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input> Height
            <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
          </template>
        </generate-form>

        <template slot="action">
          <el-button type="primary" @click="handleTest">{{ $t("fm.actions.getData") }}</el-button>
          <el-button @click="handleReset">{{ $t("fm.actions.reset") }}</el-button>
        </template>
      </basic-dialog>

      <basic-dialog :visible.sync="uploadVisible" @on-close="uploadVisible = false" @on-submit="handleUploadJson" ref="uploadJson" width="800px" form>
        <el-alert type="info" :title="$t('fm.description.uploadJsonInfo')"></el-alert>
        <AceEditor v-model="jsonEg" style="height: 400px; width: 100%" mode="json"></AceEditor>
      </basic-dialog>

      <basic-dialog :visible.sync="jsonVisible" @on-close="jsonVisible = false" ref="jsonPreview" width="800px" form>
        <AceEditor v-model="jsonCopyValue" style="height: 400px; width: 100%" mode="json" readOnly></AceEditor>
        <template slot="action">
          <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">{{ $t("fm.actions.copyData") }}</el-button>
        </template>
      </basic-dialog>

      <basic-dialog :visible.sync="codeVisible" @on-close="codeVisible = false" ref="codePreview" width="800px" form :action="false">
        <!-- <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div> -->
        <el-tabs type="border-card" style="box-shadow: none" v-model="codeActiveName">
          <el-tab-pane label="Vue Component" name="vue">
            <div id="vuecodeeditor" style="height: 500px; width: 100%">{{ vueTemplate }}</div>
          </el-tab-pane>
          <el-tab-pane label="HTML" name="html">
            <div id="codeeditor" style="height: 500px; width: 100%">{{ htmlTemplate }}</div>
          </el-tab-pane>
        </el-tabs>
      </basic-dialog>
    </el-container>
  </div>
</template>

<script>
import Draggable from "vuedraggable";
// import WidgetConfig from "./WidgetConfig";
import WidgetConfig from "./WidgetConfig.js";
import FormConfig from "./FormConfig";
import WidgetForm from "../Widget/WidgetForm";
import GenerateForm from "./GenerateForm";
import Clipboard from "clipboard";
import componentsConfig from "../componentsConfig.js";
// import {loadJs, loadCss} from '../util/index.js'
import setting from "../setting";
const request = () => {};
// import generateCode from './generateCode.js'

export default {
  name: "fm-making-form",
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    GenerateForm,
  },
  props: {
    preview: {
      type: Boolean,
      default: false,
    },
    generateCode: {
      type: Boolean,
      default: false,
    },
    generateJson: {
      type: Boolean,
      default: false,
    },
    upload: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  provide() {
    return {
      vm: this,
    };
  },
  data() {
    return {
      resetJson: false,
      widgetForm: {
        list: [],
        config: { ...setting.widgetFormConfig },
      },
      configTab: "widget",
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      uploadVisible: false,
      remoteFuncs: {
        func_test(resolve) {
          setTimeout(() => {
            const options = [
              { id: "1", name: "1111" },
              { id: "2", name: "2222" },
              { id: "3", name: "3333" },
            ];

            resolve(options);
          }, 2000);
        },
        funcGetToken(resolve) {
          request.get("http://tools-server.making.link/api/uptoken").then((res) => {
            resolve(res.uptoken);
          });
        },
        upload_callback(response, file, fileList) {
          console.log("callback", response, file, fileList);
        },
      },
      widgetModels: {},
      blank: "",
      htmlTemplate: "",
      vueTemplate: "",
      jsonTemplate: "",
      uploadEditor: null,
      jsonCopyValue: "",
      jsonClipboard: null,
      jsonEg: `{
        "list": [],
        "config": {
          "labelWidth": 100,
          "labelPosition": "top",
          "size": "small"
        }
      }`,
      codeActiveName: "vue",
    };
  },
  computed: {
    fields() {
      return componentsConfig.map((components) => {
        let _components = { ...components };
        _components.children = (components.children || []).map((item) => {
          return {
            ...item,
            name: this.$t(`fm.components.fields.${item.type}`),
          };
        });
        return _components;
      });
    },
  },
  methods: {
    handleMoveEnd(evt) {
      console.log("end", evt);
    },
    handleMoveStart({ oldIndex }) {
      console.log("start", oldIndex, this.basicComponents);
    },
    handleMove() {
      return true;
    },
    handlePreview() {
      console.log(this.widgetForm);
      this.previewVisible = true;
    },
    handleTest() {
      this.$refs.generateForm
        .getData()
        .then((data) => {
          this.$alert(data, "").catch(() => {});
          this.$refs.widgetPreview.end();
        })
        .catch(() => {
          this.$refs.widgetPreview.end();
        });
    },
    handleReset() {
      this.$refs.generateForm.reset();
    },
    handleGenerateJson() {
      this.jsonVisible = true;
      this.jsonTemplate = this.widgetForm;
      console.log(JSON.stringify(this.widgetForm));
      this.$nextTick(() => {
        // const editor = ace.edit("jsoneditor");
        // editor.session.setMode("ace/mode/json");

        if (!this.jsonClipboard) {
          this.jsonClipboard = new Clipboard(".json-btn");
          this.jsonClipboard.on("success", () => {
            this.$message.success(this.$t("fm.message.copySuccess"));
          });
        }
        this.jsonCopyValue = JSON.stringify(this.widgetForm, null, 2);
      });
    },
    handleGenerateCode() {
      this.codeVisible = true;
      // this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm), 'html')
      // this.vueTemplate = generateCode(JSON.stringify(this.widgetForm), 'vue')
      // this.$nextTick(() => {
      //   const editor = ace.edit("codeeditor");
      //   editor.session.setMode("ace/mode/html");
      //
      //   const vueeditor = ace.edit("vuecodeeditor");
      //   vueeditor.session.setMode("ace/mode/html");
      // });
    },
    handleUpload() {
      this.uploadVisible = true;
      this.$nextTick(() => {
        // this.uploadEditor = ace.edit("uploadeditor");
        // this.uploadEditor.session.setMode("ace/mode/json");
      });
    },
    handleUploadJson() {
      try {
        this.setJSON(JSON.parse(this.jsonEg));
        this.uploadVisible = false;
      } catch (e) {
        this.$message.error(e.message);
      }
    },
    handleClear() {
      this.widgetForm = {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: "right",
          size: "small",
          customClass: "",
        },
      };

      this.widgetFormSelect = {};
    },
    clear() {
      this.handleClear();
    },
    getJSON() {
      return this.widgetForm;
    },
    getHtml() {
      // return generateCode(JSON.stringify(this.widgetForm))
    },
    setJSON(json) {
      this.widgetForm = json;
      if (json.list.length > 0) {
        this.widgetFormSelect = json.list[0];
      }
    },
    handleInput(val) {
      console.log(val);
      this.blank = val;
    },
    handleDataChange(field, value, data) {
      console.log(field, value, data);
    },
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function () {
        console.log(this.$refs.widgetForm);
      },
    },
  },
};
</script>
<style scoped lang="scss">
@import "../styles/index.scss";
</style>
