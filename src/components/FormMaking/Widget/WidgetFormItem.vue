<template>
  <el-form-item
    class="widget-view"
    v-if="element && element.key"
    :class="{ active: selectWidget.key == element.key, is_req: element.options.required }"
    :label="element.options.showLabel ? element.name : null"
    @click.native.stop="handleSelectWidget(index)"
    :label-width="labelWidth"
    :required="element.options.required"
  >
    <template v-if="element.type == 'input'">
      <el-input
        v-model="element.options.defaultValue"
        :style="{ width: element.options.width }"
        :show-word-limit="element.options.showWordLimit"
        v-bind="element.options"
      ></el-input>
    </template>

    <template v-if="element.type == 'textarea'">
      <el-input
        type="textarea"
        :rows="5"
        v-model="element.options.defaultValue"
        :style="{ width: element.options.width }"
        v-bind="element.options"
      ></el-input>
    </template>

    <template v-if="element.type == 'number'">
      <el-input-number v-model="element.options.defaultValue" :style="{ width: element.options.width }" v-bind="element.options"></el-input-number>
    </template>

    <template v-if="element.type == 'radio'">
      <el-radio-group v-model="element.options.defaultValue" :style="{ width: element.options.width }" v-bind="element.options">
        <el-radio
          :style="{ display: element.options.inline ? 'inline-block' : 'block' }"
          :label="item.value"
          v-for="(item, index) in element.options.options"
          :key="item.value + index"
        >
          {{ element.options.showLabel ? item.label : item.value }}
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="element.type == 'checkbox'">
      <el-checkbox-group v-model="element.options.defaultValue" :style="{ width: element.options.width }" v-bind="element.options">
        <el-checkbox
          :style="{ display: element.options.inline ? 'inline-block' : 'block' }"
          :label="item.value"
          v-for="(item, index) in element.options.options"
          :key="item.value + index"
        >
          {{ element.options.showLabel ? item.label : item.value }}
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="element.type == 'time'">
      <el-time-picker
        v-model="element.options.defaultValue"
        :style="{ width: element.options.width }"
        :value-format="element.options.format"
        :format="element.options.format"
        v-bind="element.options"
      >
      </el-time-picker>
    </template>

    <template v-if="element.type == 'timerange'">
      <el-time-picker
        v-model="element.options.defaultValue"
        is-range
        :style="{ width: element.options.width }"
        :value-format="element.options.format"
        :format="element.options.format"
        v-bind="element.options"
      >
      </el-time-picker>
    </template>

    <template v-if="element.type == 'date'">
      <el-date-picker
        v-model="element.options.defaultValue"
        :style="{ width: element.options.width }"
        :value-format="element.options.format"
        :format="element.options.format"
        v-bind="element.options"
      >
      </el-date-picker>
    </template>

    <template v-if="element.type == 'daterange'">
      <el-date-picker v-model="element.options.defaultValue" type="daterange" :style="{ width: element.options.width }" v-bind="element.options">
      </el-date-picker>
    </template>

    <template v-if="element.type == 'datetimerange'">
      <el-date-picker
        v-model="element.options.defaultValue"
        is-range
        type="datetimerange"
        :style="{ width: element.options.width }"
        v-bind="element.options"
      >
      </el-date-picker>
    </template>

    <template v-if="element.type == 'rate'">
      <el-rate v-model="element.options.defaultValue" v-bind="element.options"></el-rate>
    </template>

    <template v-if="element.type == 'color'">
      <el-color-picker v-model="element.options.defaultValue" v-bind="element.options"></el-color-picker>
    </template>

    <template v-if="element.type == 'select'">
      <el-select v-model="element.options.defaultValue" :style="{ width: element.options.width }" v-bind="element.options">
        <el-option
          v-for="item in element.options.options"
          :key="item.value"
          :value="item.value"
          :label="element.options.showLabel ? item.label : item.value"
        ></el-option>
      </el-select>
    </template>

    <template v-if="element.type == 'switch'">
      <el-switch v-model="element.options.defaultValue" v-bind="element.options"> </el-switch>
    </template>

    <template v-if="element.type == 'slider'">
      <el-slider v-model="element.options.defaultValue" :style="{ width: element.options.width }" v-bind="element.options"></el-slider>
    </template>

    <template v-if="element.type == 'imgupload'">
      <fm-upload
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :style="{ width: element.options.width }"
        :width="element.options.size.width"
        :height="element.options.size.height"
        token="xxx"
        domain="xxx"
      >
      </fm-upload>
    </template>

    <template v-if="element.type == 'cascader'">
      <el-cascader
        v-model="element.options.defaultValue"
        :style="{ width: element.options.width }"
        :options="element.options.remoteOptions"
        v-bind="element.options"
      >
      </el-cascader>
    </template>

    <template v-if="element.type == 'editor'">
      <quill-editor v-model="element.options.defaultValue" :style="{ width: element.options.width }"> </quill-editor>
    </template>

    <template v-if="element.type == 'blank'">
      <div style="height: 50px; color: #999; background: #eee; line-height: 50px; text-align: center">{{ $t("fm.components.fields.blank") }}</div>
    </template>

    <template v-if="element.type == 'text'">
      <span>{{ element.options.defaultValue }}</span>
    </template>
  </el-form-item>
  <!--    <div class="widget-view-action" v-if="selectWidget.key == element.key">-->
  <!--      <i class="iconfont icon-icon_clone el-icon-document-copy" @click.stop="handleWidgetClone(index)"></i>-->
  <!--      <i class="iconfont icon-trash el-icon-delete" @click.stop="handleWidgetDelete(index)"></i>-->
  <!--    </div>-->

  <!--    <div class="widget-view-drag" v-if="selectWidget.key == element.key">-->
  <!--      <i class="iconfont icon-drag drag-widget el-icon-rank"></i>-->
  <!--    </div>-->
</template>

<script>
import FmUpload from "../components/Upload";
export default {
  props: ["element", "select", "index", "data"],
  components: {
    FmUpload,
  },
  computed: {
    labelWidth() {
      if (this.element.options.showLabel === false) return "0px";
      if (this.element.labelWidth === null || this.element.labelWidth === undefined) return null;
      return this.element.labelWidth + "px";
    },
  },
  data() {
    return {
      selectWidget: this.select,
    };
  },
  mounted() {},
  methods: {
    handleSelectWidget(index) {
      this.selectWidget = this.data.list[index];
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
