<template>
  <div v-if="isWidgetFormSelect">
    <el-form :label-position="attributeConfig.labelPosition" :size="attributeConfig.size">
      <template v-if="utils.ObjectHasKey(widgetFormSelect, 'model')">
        <el-form-item :label="$t('fm.config.widget.model')">
          <el-input v-model="widgetFormSelect.model"></el-input>
        </el-form-item>
      </template>
      <template v-if="utils.ObjectHasKey(widgetFormSelect, 'name')">
        <el-form-item :label="$t('fm.config.widget.name')">
          <el-input v-model="widgetFormSelect.name"></el-input>
        </el-form-item>
      </template>
      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'width')">
        <el-form-item :label="$t('fm.config.widget.width')">
          <el-input v-model="widgetFormSelect.options.width"></el-input>
        </el-form-item>
      </template>
      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'span')">
        <el-form-item :label="$t('fm.config.widget.width')">
          <el-slider v-model="widgetFormSelect.options.span" :min="0" :max="24" show-input :input-size="size"></el-slider>
        </el-form-item>
      </template>
      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'height')">
        <el-form-item :label="$t('fm.config.widget.height')">
          <el-input v-model="widgetFormSelect.options.height"></el-input>
        </el-form-item>
      </template>
      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'size')">
        <el-form-item :label="$t('fm.config.widget.size')">
          {{ $t("fm.config.widget.width") }}
          <el-input style="width: 90px" type="number" v-model.number="widgetFormSelect.options.size.width"></el-input>
          {{ $t("fm.config.widget.height") }}
          <el-input style="width: 90px" type="number" v-model.number="widgetFormSelect.options.size.height"></el-input>
        </el-form-item>
      </template>
      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'placeholder') && ['time', 'date'].includes(widgetFormSelect.type)">
        <el-form-item :label="$t('fm.config.widget.placeholder')">
          <el-input v-model="widgetFormSelect.options.placeholder"></el-input>
        </el-form-item>
      </template>

      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'inline')">
        <el-form-item :label="$t('fm.config.widget.layout')">
          <el-radio-group v-model="widgetFormSelect.options.inline">
            <el-radio-button :label="false">{{ $t("fm.config.widget.block") }}</el-radio-button>
            <el-radio-button :label="true">{{ $t("fm.config.widget.inline") }}</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </template>

      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'showInput')">
        <el-form-item :label="$t('fm.config.widget.showInput')">
          <el-switch v-model="widgetFormSelect.options.showInput"></el-switch>
        </el-form-item>
      </template>

      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'min')">
        <el-form-item :label="$t('fm.config.widget.min')">
          <el-input-number v-model="widgetFormSelect.options.min" :min="0" :max="100" :step="1"></el-input-number>
        </el-form-item>
      </template>

      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'max')">
        <el-form-item :label="$t('fm.config.widget.max')">
          <el-input-number v-model="widgetFormSelect.options.max" :min="0" :max="100" :step="1"></el-input-number>
        </el-form-item>
      </template>

      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'step')">
        <el-form-item :label="$t('fm.config.widget.step')">
          <el-input-number v-model="widgetFormSelect.options.step" :min="0" :max="100" :step="1"></el-input-number>
        </el-form-item>
      </template>

      <template v-if="widgetFormSelect.type == 'select' || widgetFormSelect.type == 'imgupload'">
        <el-form-item :label="$t('fm.config.widget.multiple')">
          <el-switch v-model="widgetFormSelect.options.multiple" @change="handleSelectMuliple"></el-switch>
        </el-form-item>
      </template>

      <template v-if="widgetFormSelect.type == 'select'">
        <el-form-item :label="$t('fm.config.widget.filterable')">
          <el-switch v-model="widgetFormSelect.options.filterable"></el-switch>
        </el-form-item>
      </template>

      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'allowHalf')">
        <el-form-item :label="$t('fm.config.widget.allowHalf')">
          <el-switch v-model="widgetFormSelect.options.allowHalf"> </el-switch>
        </el-form-item>
      </template>

      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'showAlpha')">
        <el-form-item :label="$t('fm.config.widget.showAlpha')">
          <el-switch v-model="widgetFormSelect.options.showAlpha"> </el-switch>
        </el-form-item>
      </template>

      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'showLabel')">
        <el-form-item :label="$t('fm.config.widget.showLabel')">
          <el-switch v-model="widgetFormSelect.options.showLabel"> </el-switch>
        </el-form-item>
      </template>

      <template v-if="utils.ObjectHasKey(widgetFormSelect.options, 'options')">
        <el-form-item :label="$t('fm.config.widget.option')">
          <el-radio-group v-model="widgetFormSelect.options.remote" size="mini" style="margin-bottom: 10px">
            <el-radio-button :label="false">{{ $t("fm.config.widget.staticData") }}</el-radio-button>
            <el-radio-button :label="true">{{ $t("fm.config.widget.remoteData") }}</el-radio-button>
          </el-radio-group>
          <template v-if="widgetFormSelect.options.remote">
            <div>
              <el-input size="mini" style="" v-model="widgetFormSelect.options.remoteFunc">
                <template slot="prepend">{{ $t("fm.config.widget.remoteFunc") }}</template>
              </el-input>
              <el-input size="mini" style="" v-model="widgetFormSelect.options.props.value">
                <template slot="prepend">{{ $t("fm.config.widget.value") }}</template>
              </el-input>
              <el-input size="mini" style="" v-model="widgetFormSelect.options.props.label">
                <template slot="prepend">{{ $t("fm.config.widget.label") }}</template>
              </el-input>
            </div>
          </template>
          <template v-else>
            <template v-if="widgetFormSelect.type == 'radio' || (widgetFormSelect.type == 'select' && !widgetFormSelect.options.multiple)">
              <el-radio-group v-model="widgetFormSelect.options.defaultValue">
                <draggable
                  tag="ul"
                  :list="widgetFormSelect.options.options"
                  v-bind="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }"
                  handle=".drag-item"
                >
                  <li v-for="(item, index) in widgetFormSelect.options.options" :key="index">
                    <el-radio :label="item.value" style="margin-right: 5px">
                      <el-input :style="{ width: widgetFormSelect.options.showLabel ? '90px' : '180px' }" size="mini" v-model="item.value"></el-input>
                      <el-input style="width: 90px" size="mini" v-if="widgetFormSelect.options.showLabel" v-model="item.label"></el-input>
                      <!-- <input v-model="item.value"/> -->
                    </el-radio>
                    <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move"><i class="iconfont icon-icon_bars"></i></i>
                    <el-button
                      @click="handleOptionsRemove(index)"
                      circle
                      plain
                      type="danger"
                      size="mini"
                      icon="el-icon-minus"
                      style="padding: 4px; margin-left: 5px"
                    ></el-button>
                  </li>
                </draggable>
              </el-radio-group>
            </template>

            <template v-if="widgetFormSelect.type == 'checkbox' || (widgetFormSelect.type == 'select' && widgetFormSelect.options.multiple)">
              <el-checkbox-group v-model="widgetFormSelect.options.defaultValue">
                <draggable
                  tag="ul"
                  :list="widgetFormSelect.options.options"
                  v-bind="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }"
                  handle=".drag-item"
                >
                  <li v-for="(item, index) in widgetFormSelect.options.options" :key="index">
                    <el-checkbox :label="item.value" style="margin-right: 5px">
                      <el-input :style="{ width: widgetFormSelect.options.showLabel ? '90px' : '180px' }" size="mini" v-model="item.value"></el-input>
                      <el-input style="width: 90px" size="mini" v-if="widgetFormSelect.options.showLabel" v-model="item.label"></el-input>
                    </el-checkbox>
                    <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move"><i class="iconfont icon-icon_bars"></i></i>
                    <el-button
                      @click="handleOptionsRemove(index)"
                      circle
                      plain
                      type="danger"
                      size="mini"
                      icon="el-icon-minus"
                      style="padding: 4px; margin-left: 5px"
                    ></el-button>
                  </li>
                </draggable>
              </el-checkbox-group>
            </template>
            <div style="margin-left: 22px">
              <el-button type="text" @click="handleAddOption">{{ $t("fm.actions.addOption") }}</el-button>
            </div>
          </template>
        </el-form-item>
      </template>

      <el-form-item :label="$t('fm.config.widget.remoteData')" v-if="widgetFormSelect.type == 'cascader'">
        <div>
          <el-input size="mini" style="" v-model="widgetFormSelect.options.remoteFunc">
            <template slot="prepend">{{ $t("fm.config.widget.remoteFunc") }}</template>
          </el-input>
          <el-input size="mini" style="" v-model="widgetFormSelect.options.props.value">
            <template slot="prepend">{{ $t("fm.config.widget.value") }}</template>
          </el-input>
          <el-input size="mini" style="" v-model="widgetFormSelect.options.props.label">
            <template slot="prepend">{{ $t("fm.config.widget.label") }}</template>
          </el-input>
          <el-input size="mini" style="" v-model="widgetFormSelect.options.props.children">
            <template slot="prepend">{{ $t("fm.config.widget.childrenOption") }}</template>
          </el-input>
        </div>
      </el-form-item>

      <el-form-item
        :label="$t('fm.config.widget.defaultValue')"
        v-if="
          utils.ObjectHasKey(widgetFormSelect.options, 'defaultValue') &&
          (widgetFormSelect.type == 'textarea' ||
            widgetFormSelect.type == 'input' ||
            widgetFormSelect.type == 'rate' ||
            widgetFormSelect.type == 'color' ||
            widgetFormSelect.type == 'switch' ||
            widgetFormSelect.type == 'text')
        "
      >
        <el-input v-if="widgetFormSelect.type == 'textarea'" type="textarea" :rows="5" v-model="widgetFormSelect.options.defaultValue"></el-input>
        <el-input v-if="widgetFormSelect.type == 'input'" v-model="widgetFormSelect.options.defaultValue"></el-input>
        <el-rate
          v-if="widgetFormSelect.type == 'rate'"
          style="display: inline-block; vertical-align: middle"
          :max="widgetFormSelect.options.max"
          :allow-half="widgetFormSelect.options.allowHalf"
          v-model="widgetFormSelect.options.defaultValue"
        ></el-rate>
        <el-button
          type="text"
          v-if="widgetFormSelect.type == 'rate'"
          style="display: inline-block; vertical-align: middle; margin-left: 10px"
          @click="widgetFormSelect.options.defaultValue = 0"
          >{{ $t("fm.actions.clear") }}</el-button
        >
        <el-color-picker
          v-if="widgetFormSelect.type == 'color'"
          v-model="widgetFormSelect.options.defaultValue"
          :show-alpha="widgetFormSelect.options.showAlpha"
        ></el-color-picker>
        <el-switch v-if="widgetFormSelect.type == 'switch'" v-model="widgetFormSelect.options.defaultValue"></el-switch>
        <el-input v-if="widgetFormSelect.type == 'text'" v-model="widgetFormSelect.options.defaultValue"></el-input>
      </el-form-item>

      <el-form-item :label="$t('fm.config.widget.maxlength')" v-if="widgetFormSelect.type == 'textarea' || widgetFormSelect.type == 'input'">
        <el-input-number v-model="widgetFormSelect.options.maxlength" :min="-1"></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('fm.config.widget.showWordLimit')" v-if="widgetFormSelect.type == 'textarea' || widgetFormSelect.type == 'input'">
        <el-switch v-model="widgetFormSelect.options.showWordLimit"></el-switch>
      </el-form-item>

      <template v-if="widgetFormSelect.type == 'time' || widgetFormSelect.type == 'date'">
        <el-form-item :label="$t('fm.config.widget.showType')" v-if="widgetFormSelect.type == 'date'">
          <el-select v-model="widgetFormSelect.options.type">
            <el-option value="year"></el-option>
            <el-option value="month"></el-option>
            <el-option value="date"></el-option>
            <el-option value="dates"></el-option>
            <!-- <el-option value="week"></el-option> -->
            <el-option value="datetime"></el-option>
            <el-option value="datetimerange"></el-option>
            <el-option value="daterange"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.isRange')" v-if="widgetFormSelect.type == 'time'">
          <el-switch v-model="widgetFormSelect.options.isRange"> </el-switch>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.isTimestamp')" v-if="widgetFormSelect.type == 'date'">
          <el-switch v-model="widgetFormSelect.options.timestamp"> </el-switch>
        </el-form-item>
        <el-form-item
          :label="$t('fm.config.widget.placeholder')"
          v-if="
            (!widgetFormSelect.options.isRange && widgetFormSelect.type == 'time') ||
            (widgetFormSelect.type != 'time' && widgetFormSelect.options.type != 'datetimerange' && widgetFormSelect.options.type != 'daterange')
          "
        >
          <el-input v-model="widgetFormSelect.options.placeholder"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('fm.config.widget.startPlaceholder')"
          v-if="widgetFormSelect.options.isRange || widgetFormSelect.options.type == 'datetimerange' || widgetFormSelect.options.type == 'daterange'"
        >
          <el-input v-model="widgetFormSelect.options.startPlaceholder"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('fm.config.widget.endPlaceholder')"
          v-if="widgetFormSelect.options.isRange || widgetFormSelect.options.type == 'datetimerange' || widgetFormSelect.options.type == 'daterange'"
        >
          <el-input v-model="widgetFormSelect.options.endPlaceholder"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.format')">
          <el-input v-model="widgetFormSelect.options.format"></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('fm.config.widget.defaultValue')"
          v-if="widgetFormSelect.type == 'time' && utils.ObjectHasKey(widgetFormSelect.options, 'isRange')"
        >
          <el-time-picker
            key="1"
            style="width: 100%"
            v-if="!widgetFormSelect.options.isRange"
            v-model="widgetFormSelect.options.defaultValue"
            :arrowControl="widgetFormSelect.options.arrowControl"
            :value-format="widgetFormSelect.options.format"
          >
          </el-time-picker>
          <el-time-picker
            key="2"
            v-if="widgetFormSelect.options.isRange"
            style="width: 100%"
            v-model="widgetFormSelect.options.defaultValue"
            is-range
            :arrowControl="widgetFormSelect.options.arrowControl"
            :value-format="widgetFormSelect.options.format"
          >
          </el-time-picker>
        </el-form-item>
      </template>

      <template v-if="widgetFormSelect.type == 'imgupload'">
        <el-form-item :label="$t('fm.config.widget.limit')">
          <el-input type="number" v-model.number="widgetFormSelect.options.length"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.isQiniu')">
          <el-switch v-model="widgetFormSelect.options.isQiniu"></el-switch>
        </el-form-item>
        <template v-if="widgetFormSelect.options.isQiniu">
          <el-form-item label="Domain" :required="true">
            <el-input v-model="widgetFormSelect.options.domain"></el-input>
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.tokenFunc')" :required="true">
            <el-input v-model="widgetFormSelect.options.tokenFunc"></el-input>
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item :label="$t('fm.config.widget.imageAction')" :required="true">
            <el-input v-model="widgetFormSelect.options.action"></el-input>
          </el-form-item>
        </template>
      </template>

      <template v-if="widgetFormSelect.type == 'blank'">
        <el-form-item :label="$t('fm.config.widget.defaultType')">
          <el-select v-model="widgetFormSelect.options.defaultType">
            <el-option value="String" :label="$t('fm.config.widget.string')"></el-option>
            <el-option value="Object" :label="$t('fm.config.widget.object')"></el-option>
            <el-option value="Array" :label="$t('fm.config.widget.array')"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="widgetFormSelect.type == 'grid'">
        <el-form-item :label="$t('fm.config.widget.gutter')">
          <el-input type="number" v-model.number="widgetFormSelect.options.gutter"></el-input>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.columnOption')">
          <draggable
            tag="ul"
            :list="widgetFormSelect.columns"
            v-bind="{ group: { name: 'options' }, ghostClass: 'ghost', handle: '.drag-item' }"
            handle=".drag-item"
          >
            <li v-for="(item, index) in widgetFormSelect.columns" :key="index">
              <i class="drag-item" style="font-size: 16px; margin: 0 5px; cursor: move"><i class="iconfont icon-icon_bars"></i></i>
              <el-input
                :placeholder="$t('fm.config.widget.span')"
                size="mini"
                style="width: 100px"
                type="number"
                v-model.number="item.span"
              ></el-input>

              <el-button
                @click="handleOptionsRemove(index)"
                circle
                plain
                type="danger"
                size="mini"
                icon="el-icon-minus"
                style="padding: 4px; margin-left: 5px"
              ></el-button>
            </li>
          </draggable>
          <div style="margin-left: 22px">
            <el-button type="text" @click="handleAddColumn">{{ $t("fm.actions.addColumn") }}</el-button>
          </div>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.justify')">
          <el-select v-model="widgetFormSelect.options.justify">
            <el-option value="start" :label="$t('fm.config.widget.justifyStart')"></el-option>
            <el-option value="end" :label="$t('fm.config.widget.justifyEnd')"></el-option>
            <el-option value="center" :label="$t('fm.config.widget.justifyCenter')"></el-option>
            <el-option value="space-around" :label="$t('fm.config.widget.justifySpaceAround')"></el-option>
            <el-option value="space-between" :label="$t('fm.config.widget.justifySpaceBetween')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('fm.config.widget.align')">
          <el-select v-model="widgetFormSelect.options.align">
            <el-option value="top" :label="$t('fm.config.widget.alignTop')"></el-option>
            <el-option value="middle" :label="$t('fm.config.widget.alignMiddle')"></el-option>
            <el-option value="bottom" :label="$t('fm.config.widget.alignBottom')"></el-option>
          </el-select>
        </el-form-item>
      </template>

      <template v-if="widgetFormSelect.type != 'grid'">
        <el-form-item :label="$t('fm.config.widget.attribute')">
          <!--只读-->
          <el-checkbox v-model="widgetFormSelect.options.readonly" v-if="utils.ObjectHasKey(widgetFormSelect.options, 'readonly')">
            {{ $t("fm.config.widget.readonly") }}
          </el-checkbox>
          <!--禁用-->
          <el-checkbox v-model="widgetFormSelect.options.disabled" v-if="utils.ObjectHasKey(widgetFormSelect.options, 'disabled')">
            {{ $t("fm.config.widget.disabled") }}
          </el-checkbox>

          <el-checkbox v-model="widgetFormSelect.options.editable" v-if="utils.ObjectHasKey(widgetFormSelect.options, 'editable')">
            {{ $t("fm.config.widget.editable") }}
          </el-checkbox>
          <!--清除-->
          <el-checkbox v-model="widgetFormSelect.options.clearable" v-if="utils.ObjectHasKey(widgetFormSelect.options, 'clearable')">
            {{ $t("fm.config.widget.clearable") }}
          </el-checkbox>
          <el-checkbox v-model="widgetFormSelect.options.arrowControl" v-if="utils.ObjectHasKey(widgetFormSelect.options, 'arrowControl')">
            {{ $t("fm.config.widget.arrowControl") }}
          </el-checkbox>
          <el-checkbox v-model="widgetFormSelect.options.isDelete" v-if="utils.ObjectHasKey(widgetFormSelect.options, 'isDelete')">
            {{ $t("fm.config.widget.isDelete") }}
          </el-checkbox>
          <el-checkbox v-model="widgetFormSelect.options.isEdit" v-if="utils.ObjectHasKey(widgetFormSelect.options, 'isEdit')">
            {{ $t("fm.config.widget.isEdit") }}
          </el-checkbox>
        </el-form-item>
        <!--校验-->
        <el-form-item :label="$t('fm.config.widget.validate')">
          <div v-if="utils.ObjectHasKey(widgetFormSelect.options, 'required')">
            <!--必填-->
            <el-checkbox v-model="widgetFormSelect.options.required">{{ $t("fm.config.widget.required") }}</el-checkbox>
          </div>
          <el-select v-if="utils.ObjectHasKey(widgetFormSelect.options, 'dataType')" v-model="widgetFormSelect.options.dataType" size="mini">
            <el-option value="string" :label="$t('fm.config.widget.string')"></el-option>
            <el-option value="number" :label="$t('fm.config.widget.number')"></el-option>
            <el-option value="boolean" :label="$t('fm.config.widget.boolean')"></el-option>
            <el-option value="integer" :label="$t('fm.config.widget.integer')"></el-option>
            <el-option value="float" :label="$t('fm.config.widget.float')"></el-option>
            <el-option value="url" :label="$t('fm.config.widget.url')"></el-option>
            <el-option value="email" :label="$t('fm.config.widget.email')"></el-option>
            <el-option value="hex" :label="$t('fm.config.widget.hex')"></el-option>
          </el-select>
          <!--填写正则表达式-->
          <div v-if="utils.ObjectHasKey(widgetFormSelect.options, 'pattern')">
            <el-input
              size="mini"
              class="config-pattern-input"
              v-model.lazy="widgetFormSelect.options.pattern"
              style="width: 240px"
              :placeholder="$t('fm.config.widget.patternPlaceholder')"
            >
              <template slot="prepend">/</template>
              <template slot="append">/</template>
            </el-input>
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
  <div v-else>拖拽字段进行配置</div>
</template>

<script>
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
      console.log("haha");
    },
    "widgetFormSelect.name": function () {
      if (this.widgetFormSelect.options) {
        this.validateRequired(this.widgetFormSelect.options.required);
        this.validateDataType(this.widgetFormSelect.options.dataType);
        this.valiatePattern(this.widgetFormSelect.options.pattern);
      }
    },
  },
};
</script>
<style scoped lang="scss">
@import "../styles/index.scss";
</style>
