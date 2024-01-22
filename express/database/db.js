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

module.exports = mongoose
