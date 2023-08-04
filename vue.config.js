const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");
const FileListPlugin = require("./FileListPlugin.js");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const cdn = require("./cdn.js");
const setting = require("./src/config/setting.js");
function resolve(dir) {
  return path.join(__dirname, dir);
}
process.env.VUE_APP_TITLE = "测试";
// 基础路径 注意发布之前要先修改这里
let baseUrl = "/";

module.exports = {
  publicPath: baseUrl, // 根据你的实际情况更改这里
  css: {
    loaderOptions: {
      sass: {
        prependData: `
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
      // 打包文件大小配置
      config.performance = {
        hints: false,
        maxEntrypointSize: 1024 * 1024,
        maxAssetSize: 1024 * 1024,
      };
      return {
        plugins: [
          //在每一个生成的chunk顶部添加一个banner
          new webpack.BannerPlugin(" 在每一个生成的chunk顶部添加一个banner "),
          // build进度条
          new ProgressBarPlugin(),
          new FileListPlugin(),
        ],
      };
    }
  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: (config) => {
    // CDN
    config.plugin("html").tap((args) => {
      args[0].cdn = cdn;
      return args;
    });
    // 使用CDN 之後,打包排除文件
    // config.externals({
    //   'vue': 'Vue',
    //   'element-ui': 'ELEMENT'
    // })

    // 利用svg-sprite-loader处理svg
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.include
      .add(resolve("src/assets/svg-icons/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]", // icon-xxx 自定义（组件识别到底使用哪个 svg 的关键）
      })
      .end();
    // 重新设置 alias
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@api", resolve("src/api"))
      .set("@assets", resolve("src/assets"))
      .set("@cp", resolve("src/components"))
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
      config.optimization.runtimeChunk("single");
      config.optimization.splitChunks({
        automaticNameDelimiter: "-",
        chunks: "all",
        cacheGroups: {
          defaultVendors: {
            // 指定chunks名称
            name: "chunk-libs",
            // 符合组的要求就给构建
            test: /[\\/]node_modules[\\/]/,
            // 优先级：数字越大优先级越高，因为默认值为0，所以自定义的一般是负数形式,
            priority: -10,
            chunks: "initial", // 只打包最初依赖的第三方
            minSize: 0, // 设置最小大小为0，确保每个库都被拆分成一个单独的chunk
            maxSize: 1024 * 1024, // 设置最大大小为244K，确保每个chunk不超过244K
            minChunks: 2,
          },
          // 将vue相关的单独拆分出来
          vue: {
            name: "vue",
            test: /[\\/]node_modules[\\/](vue(.*)|core-js)[\\/]/,
            chunks: "initial",
            priority: 10,
          },
          // 将element单独拆分出来
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          },
          utils: {
            name: "chunk-utils",
            // 将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中，是比较推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。
            test: /[\\/]node_modules[\\/](lodash|moment|axios)[\\/]/,
            priority: 30,
            chunks: "initial",
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 40,
            reuseExistingChunk: true,
          },
          extra: {
            name: "chunk-layout",
            test: resolve("src/layout"),
            priority: 50,
          },
        },
      });

      config.optimization.runtimeChunk("single");
    }

    // 新建规则处理gltf文件
    config.module
      .rule("gltf")
      .test(/\.gltf$/)
      .use("gltf-webpack-loader")
      .loader("gltf-webpack-loader")
      .end();
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  devServer: {
    port: 3110,
    before: setting.USE_MOCK && require("./mock/server.js"),
  },
};
