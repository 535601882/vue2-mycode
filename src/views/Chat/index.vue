<template>
  <div>
    <div>
      <div v-for="(message, index) in messages" :key="index">
        {{ message }}
      </div>
    </div>
    <div>
      <el-input v-model="model" type="textarea" placeholder="placeholder"></el-input>
      <el-button type="primary" @click="handleSend">发送</el-button>
    </div>
  </div>
</template>

<script>
import api from "@/api";
export default {
  name: "index",
  components: {},
  data() {
    return {
      model: "https://gd-hbimg.huaban.com/9b770f6dc9a5562f35f2a4944fe5d6233f87d7d759dc-GHKmUQ_fw1200",
      messages: [],
    };
  },
  computed: {},
  created() {},
  methods: {
    handleSend() {
      if (!this.model) return;
      api.clientApi
        .getImg({
          url: this.model,
        })
        .then((response) => {
          console.log(response);
          // 直接使用response.data作为Blob对象
          const url = window.URL.createObjectURL(response);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "image.jpg"); // 或者任何你想要的文件名
          document.body.appendChild(link);
          link.click();
        });
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss"></style>
