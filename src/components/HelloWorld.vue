<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    {{ $options.list }}
  </div>
</template>

<script>
export default {
  name: "HelloWorld",

  props: {
    msg: String,
  },
  data() {
    return {
      // list: null
    };
  },
  created() {
    console.log(this.msg + "Hello World creaeted");
  },
  list: null,
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      if (this.$options.list) {
        return;
      }
      this.$options.list = [1, 2, 3, 4, 5];
      console.log("$options", this.$options.list);
    },
  },
};
</script>
