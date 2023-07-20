/*导入表单配置
为每个字段类型导入构建块 Vue 组件
准备所有现场物体并
呈现表格

将数据准备任务委托给一个单独的组件 FormTemplate,
该组件的唯一工作是准备和提供数据*/
import formConfig from "./config";

import FormTemplate from "./FormTemplate.vue";
import InputBox from "./FormElements/Fields/InputBox.vue";
import TextArea from "./FormElements/Fields/TextArea.vue";
import RadioButton from "./FormElements/Fields/RadioButton.vue";
import CheckBox from "./FormElements/Fields/CheckBox.vue";

const COMPONENT_MAP = {
  formTemplate: FormTemplate,
  text: InputBox,
  textarea: TextArea,
  radio: RadioButton,
  check: CheckBox,
};

export default {
  name: "form-config-provider",
  functional: true,
  render(createElement) {
    let fieldObjects = formConfig.map((field) => {
      let component = COMPONENT_MAP[field.type];
      return { ...field, component };
    });
    return createElement(COMPONENT_MAP["formTemplate"], {
      props: {
        formFields: fieldObjects,
      },
    });
  },
};
