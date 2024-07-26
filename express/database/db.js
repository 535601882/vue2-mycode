const mongoose = require("mongoose")
const DB_URL = 'mongodb://localhost:27017/test'
// 1.连接数据库
// 指定连接的数据库不需要存在，当你插入第一条数据之后就会自动被创建出来
mongoose.connect(DB_URL)

mongoose.connection.on('connected',function(){
  console.log('Mongoose connection open to ' + DB_URL);
})

mongoose.connection.on('error',function(err){
  console.log('Mongoose connection error:' + err);
})

mongoose.connection.on('disconnected',function(){
  console.log('Mongoose connection disconnected');
})

// 当进程关闭时，关闭Redis客户端连接
process.on('exit', () => {
  console.log('关闭Mongoose客户端连接...');
  // 当你准备关闭应用程序时，调用disconnect来断开MongoDB连接
  mongoose.disconnect((err) => {
    if (err) {
      console.error('Mongoose disconnection error: ', err);
    } else {
      console.log('Mongoose disconnected through `mongoose.disconnect()`');
    }
    // 在这里可以执行其他关闭资源的操作，比如关闭服务器等
  });
});

module.exports = mongoose
