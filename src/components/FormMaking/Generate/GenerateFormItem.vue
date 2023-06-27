<template>
  <el-form-item :label="widget.name" :prop="widget.model">
    <template v-if="widget.type == 'input'">
      <el-input
        v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'"
        type="number"
        v-model.number="dataModel"
        :style="{ width: widget.options.width }"
        v-bind="widget.options"
      ></el-input>
      <el-input v-else type="text" v-model="dataModel" :style="{ width: widget.options.width }" v-bind="widget.options"></el-input>
    </template>

    <template v-if="widget.type == 'textarea'">
      <el-input type="textarea" :rows="5" v-model="dataModel" :style="{ width: widget.options.width }" v-bind="widget.options"></el-input>
    </template>

    <template v-if="widget.type == 'number'">
      <el-input-number v-model="dataModel" :style="{ width: widget.options.width }" v-bind="widget.options"></el-input-number>
    </template>

    <template v-if="widget.type == 'radio'">
      <el-radio-group v-model="dataModel" :style="{ width: widget.options.width }" v-bind="widget.options">
        <el-radio
          :style="{ display: widget.options.inline ? 'inline-block' : 'block' }"
          :label="item.value"
          v-for="(item, index) in widget.options.remote ? widget.options.remoteOptions : widget.options.options"
          :key="index"
        >
          <template v-if="widget.options.remote">{{ item.label }}</template>
          <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="widget.type == 'checkbox'">
      <el-checkbox-group v-model="dataModel" :style="{ width: widget.options.width }" v-bind="widget.options">
        <el-checkbox
          :style="{ display: widget.options.inline ? 'inline-block' : 'block' }"
          :label="item.value"
          v-for="(item, index) in widget.options.remote ? widget.options.remoteOptions : widget.options.options"
          :key="index"
        >
          <template v-if="widget.options.remote">{{ item.label }}</template>
          <template v-else>{{ widget.options.showLabel ? item.label : item.value }}</template>
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="widget.type == 'time'">
      <el-time-picker
        v-model="dataModel"
        :value-format="widget.options.format"
        :format="widget.options.format"
        :style="{ width: widget.options.width }"
        v-bind="widget.options"
      >
      </el-time-picker>
    </template>

    <template v-if="widget.type == 'timerange'">
      <el-time-picker
        v-model="dataModel"
        is-range
        :style="{ width: widget.options.width }"
        :value-format="widget.options.format"
        :format="widget.options.format"
        v-bind="widget.options"
      >
      </el-time-picker>
    </template>

    <template v-if="widget.type == 'date'">
      <el-date-picker
        v-model="dataModel"
        :style="{ width: widget.options.width }"
        :value-format="widget.options.format"
        :format="widget.options.format"
        v-bind="widget.options"
      >
      </el-date-picker>
    </template>

    <template v-if="widget.type == 'daterange'">
      <el-date-picker v-model="dataModel" type="daterange" :style="{ width: widget.options.width }" v-bind="widget.options"> </el-date-picker>
    </template>

    <template v-if="widget.type == 'datetimerange'">
      <el-date-picker v-model="dataModel" is-range type="datetimerange" :style="{ width: widget.options.width }" v-bind="widget.options">
      </el-date-picker>
    </template>

    <template v-if="widget.type == 'rate'">
      <el-rate v-model="dataModel" v-bind="widget.options"></el-rate>
    </template>

    <template v-if="widget.type == 'color'">
      <el-color-picker v-model="dataModel" v-bind="widget.options"></el-color-picker>
    </template>

    <template v-if="widget.type == 'select'">
      <el-select v-model="dataModel" :style="{ width: widget.options.width }" v-bind="widget.options">
        <el-option
          v-for="item in widget.options.remote ? widget.options.remoteOptions : widget.options.options"
          :key="item.value"
          :value="item.value"
          :label="widget.options.showLabel || widget.options.remote ? item.label : item.value"
        ></el-option>
      </el-select>
    </template>

    <template v-if="widget.type == 'switch'">
      <el-switch v-model="dataModel" v-bind="widget.options"> </el-switch>
    </template>

    <template v-if="widget.type == 'slider'">
      <el-slider v-model="dataModel" :style="{ width: widget.options.width }" v-bind="widget.options"></el-slider>
    </template>

    <template v-if="widget.type == 'imgupload'">
      <!--      <fm-upload-->
      <!--          v-model="dataModel"-->
      <!--          :disabled="widget.options.disabled"-->
      <!--          :style="{'width': widget.options.width}"-->
      <!--          :width="widget.options.size.width"-->
      <!--          :height="widget.options.size.height"-->
      <!--          :token="widget.options.token"-->
      <!--          :domain="widget.options.domain"-->
      <!--          :multiple="widget.options.multiple"-->
      <!--          :length="widget.options.length"-->
      <!--          :is-qiniu="widget.options.isQiniu"-->
      <!--          :is-delete="widget.options.isDelete"-->
      <!--          :min="widget.options.min"-->
      <!--          :is-edit="widget.options.isEdit"-->
      <!--          :action="widget.options.action"-->
      <!--      >-->
      <!--      </fm-upload>-->
    </template>

    <template v-if="widget.type == 'editor'">
      <quill-editor v-model="dataModel" :style="{ width: widget.options.width }"> </quill-editor>
    </template>

    <template v-if="widget.type == 'cascader'">
      <el-cascader v-model="dataModel" :style="{ width: widget.options.width }" :options="widget.options.remoteOptions" v-bind="widget.options">
      </el-cascader>
    </template>

    <template v-if="widget.type == 'text'">
      <span>{{ dataModel }}</span>
    </template>
  </el-form-item>
</template>

<script>
// import FmUpload from './Upload'

export default {
  name: "GenerateFormItem",
  props: ["widget", "models", "rules", "remote"],
  components: {
    // FmUpload
  },
  data() {
    return {
      dataModel: this.models[this.widget.model],
    };
  },
  created() {
    if (this.widget.options.remote && this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc]((data) => {
        this.widget.options.remoteOptions = data.map((item) => {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: item[this.widget.options.props.children],
          };
        });
      });
    }

    if (this.widget.type === "imgupload" && this.widget.options.isQiniu) {
      this.remote[this.widget.options.tokenFunc]((data) => {
        this.widget.options.token = data;
      });
    }
  },
  methods: {},
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val;
        this.$emit("update:models", {
          ...this.models,
          [this.widget.model]: val,
        });
        this.$emit("input-change", val, this.widget.model);
      },
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model];
      },
    },
  },
};
</script>

<style scoped lang="scss">
@import "../styles/index.scss";
</style>
