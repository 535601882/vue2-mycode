const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/scss/global.scss";
          @import "@/assets/scss/_variable.scss";
          `, //引入全局变量
      },
    },
  },
  configureWebpack: (config) => {
    // 生产环境取消 console.log
    if (process.env.NODE_ENV === "production") {
      // 在生产环境中优化压缩选项
      config.optimization.minimizer[0].options.terserOptions.compress = {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log"],
        keep_fnames: false,
        warnings: false,
      };
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@api", resolve("src/api"))
      .set("@assets", resolve("src/assets"))
      .set("@comp", resolve("src/components"))
      .set("@views", resolve("src/views"));
    // 生产环境，开启js\css压缩

    if (process.env.NODE_ENV === "production") {
      config.plugin("compressionPlugin").use(
        new CompressionPlugin({
          test: /\.(js|css|less)$/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false, // 不删除源文件
        })
      );
    }
  },
  devServer: {
    port: 3110,
  },
};
