class FileListPlugin {
  apply(compiler) {
    // emit 是一个异步的hook，使用tapAsync会接入到插件内部，也可以用tapPromise/tap
    compiler.hooks.emit.tapAsync("FileListPlugin", (compilation, callback) => {
      // 创建一个生成的文件的header string
      let filelist = "In this build:\n\n";
      // 循环所有的已经编译的文件
      // 为每一个文件都添加一个新行
      for (var filename in compilation.assets) {
        filelist += "- " + filename + "\n";
      }

      // 将这个列表作为一个新的asset文件插入到webpack构建
      compilation.assets["filelist.md"] = {
        source: function () {
          return filelist;
        },
        size: function () {
          return filelist.length;
        },
      };
      callback();
    });
  }
}
module.exports = FileListPlugin;
