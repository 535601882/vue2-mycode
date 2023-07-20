<template>
  <el-form ref="form" :model="formData" label-width="80px" label-position="top">
    <div class="field-area">
      <template v-for="(field, key) in formFields">
        <field-group :fieldId="key" :key="key" :label="field.label" :prop="field.name" :required="field.required" :rules="field.rules">
          <Component
            :ref="field.name"
            v-model="formData[field.name]"
            v-bind="{ ...field.options.attrs }"
            :name="`${field.name}`"
            :type="field.type"
            :options="!!field.options.choices ? field.options.choices : false"
            :is="field.component"
          ></Component>
        </field-group>
      </template>
    </div>
    <!-- Next and Back Nav -->
    <form-nav @back="back" @next="next" />

    <!-- Form Results -->
    <form-result />
  </el-form>
</template>

<script>
import FieldGroup from "./FormElements/FieldGroup.vue";
import FormNav from "./FormElements/FormNav.vue";
import FormResult from "./FormElements/FormResult.vue";

import formMixin from "./formMixin";

export default {
  name: "FormTemplate.vue",
  props: {
    formFields: {
      type: Array,
      default: () => [],
    },
  },
  provide() {
    return {
      formState: this.formState,
      formData: this.formData,
    };
  },
  mixins: [formMixin],
  components: {
    FieldGroup,
    FormNav,
    FormResult,
  },
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {},
  mounted() {},
};
</script>

<style scoped lang="scss">
.field-area {
  position: relative;
  height: 500px;
}
</style>
