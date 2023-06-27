<template>
  <div class="form-config-container">
    <el-form :label-position="attributeConfig.labelPosition" :label-width="attributeConfig.labelWidth" :size="attributeConfig.size">
      <el-form-item :label="$t('fm.config.form.labelPosition.title')">
        <el-radio-group v-model="data.labelPosition">
          <el-radio-button label="left">{{ $t("fm.config.form.labelPosition.left") }}</el-radio-button>
          <el-radio-button label="right">{{ $t("fm.config.form.labelPosition.right") }}</el-radio-button>
          <el-radio-button label="top">{{ $t("fm.config.form.labelPosition.top") }}</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('fm.config.form.labelWidth')">
        <el-input-number v-model="data.labelWidth" :min="0" :max="200" :step="10"></el-input-number>
      </el-form-item>

      <el-form-item :label="$t('fm.config.form.gutter')">
        <el-input-number v-model="data.gutter" :min="0" :max="200" :step="1"></el-input-number>
      </el-form-item>

      <el-form-item :label="$t('fm.config.form.size')">
        <el-radio-group v-model="data.size">
          <el-radio-button label="medium">medium</el-radio-button>
          <el-radio-button label="small">small</el-radio-button>
          <el-radio-button label="mini">mini</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('fm.config.form.disabled')">
        <el-switch v-model="data.disabled"> </el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import setting from "../setting";
export default {
  inject: ["vm"],
  computed: {
    data() {
      return this.vm.widgetForm.config;
    },
    attributeConfig() {
      return setting.attributeConfig;
    },
  },
};
</script>
<style scoped lang="scss">
@import "../styles/index.scss";
</style>
