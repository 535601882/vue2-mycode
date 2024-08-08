<template>
  <div>
    <el-form ref="loginForm" :model="loginForm" :rules="loginRule" label-width="80px" v-if="isLogin">
      <el-form-item label="email" prop="email">
        <el-input v-model.trim="loginForm.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model.trim="loginForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button @click="backRegist">注册</el-button>
      </el-form-item>
    </el-form>

    <el-form ref="registForm" :model="registForm" :rules="registRule" label-width="80px" v-else>
      <el-form-item label="用户名" prop="username">
        <el-input v-model.trim="registForm.username"></el-input>
      </el-form-item>
      <el-form-item label="email" prop="email">
        <el-input v-model.trim="registForm.email"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model.trim="registForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker type="date" placeholder="选择日期" v-model="registForm.birthday"></el-date-picker>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input type.trim="textarea" v-model.trim="registForm.address" maxlength="10" show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="regist">注册</el-button>
        <el-button @click="backLogin">返回登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "index",
  components: {},
  data() {
    return {
      isLogin: true,
      loginForm: {
        email: null,
        password: null,
      },
      loginRule: {
        email: { required: true, type: "email", message: "请输入email", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" },
      },
      registForm: {
        email: null,
        password: null,
      },
      registRule: {
        username: { required: true, message: "请输入用户名", trigger: "blur" },
        email: { required: true, type: "email", message: "请输入email", trigger: "blur" },
        password: { required: true, message: "请输入密码", trigger: "blur" },
      },
    };
  },
  computed: {},
  created() {},
  methods: {
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) return this.$message.warning("表单校验不通过");
        // eslint-disable-next-line no-unused-vars
        this.$store.dispatch("auth/login", this.loginForm).then((res) => {
          this.$message.success("登录成功");
          this.$router.push({ path: "/home" });
        });
      });
    },
    regist() {
      this.$refs.registForm.validate((valid) => {
        if (!valid) return this.$message.warning("表单校验不通过");
        this.$api.authApi.register(this.registForm).then((res) => {
          console.log("res", res);
          this.$message.success("注册成功");
        });
      });
    },
    backRegist() {
      this.isLogin = false;
    },
    backLogin() {
      this.isLogin = true;
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss"></style>
