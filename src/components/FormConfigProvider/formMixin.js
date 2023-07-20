export default {
  data() {
    return {
      // local object variable to store form data
      formData: {},

      // Reactive object to be used for Provide/Inject
      formState: {
        activeField: 0, //屏幕上仅显示一个字段(当前显示索引)
        isNext: true, // 跟踪过渡方向的变化（稍后在“过渡”部分中使用）
        formLength: this.formFields.length, // 控制进度条和导航
        isComplete: false, // 跟踪表单完成情况
      },
    };
  },
  computed: {
    // 当前高亮field
    activeField() {
      return this.formFields[this.formState.activeField];
    },
    // 是否是最后一个字段
    isLastField() {
      return this.formState.activeField >= this.formState.formLength;
    },
  },
  watch: {
    isLastField(newValue) {
      // 是否结束
      this.formState.isComplete = newValue;
    },
  },
  methods: {
    next() {
      this.formState.isNext = true;
      // 验证是否通过
      this.$refs.form.validateField(this.activeField.name, (e) => {
        if (e) return;
        this.proceed();
      });
    },
    back() {
      this.formState.isNext = false;
      this.formState.activeField > 0 ? this.formState.activeField-- : "";
    },
    proceed() {
      // 没有结束的话就自增到下一条
      !this.isLastField ? this.formState.activeField++ : "";
    },
  },
};
