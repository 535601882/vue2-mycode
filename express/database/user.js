const mongoose = require("./db.js")
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');
// Schema属性关键字
// default 设置默认值
// get 调用处理方法，比如格式化字符串（处理方法）
// index 设置索引规则
// required 设置验证规则，正则表达式等
// select 设置属性是否总是在查询结果中出现bool
// set 可以修改传来的属性值，和get类似
// sparse 稀疏索引bool,与索引搭配使用
// unique 设置这个属性的值只出现一次，一般对索引设置
// validate 自定义验证规则（函数），用于对属性的值进行验证，false失败，true通过验证
// required 非空验证
// min/max 范围验证（边值验证）
// enum/match 枚举验证/匹配验证

//2.设计集合结构（表结构）
const userSchema = new Schema({
  username: { type: String, required: true, unique: true ,minlength: 3,maxlength: 50,trim: true,},
  password: { type: String, required: true, match: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,15}$/,message: "25225"},//密码必须由数字、‌字母两种字符组成，‌长度在8-15位之间：‌
  email: { type: String, required: true, unique: true ,match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/},
  birthday:{type:Date},
  address:{type:String},
  // 添加 createdAt 和 updatedAt 字段
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })
// 设置 timestamps 选项为 true，以便自动更新 createdAt 和 updatedAt
/*timestamps: {
  createdAt: 'createdTime', // 将 createdAt 改名为 createdTime
    updatedAt: 'updatedTime'  // 将 updatedAt 改名为 updatedTime
}*/

userSchema.virtual('id').get(function () {
  return this._id.toString();
});

// virtuals 定义虚拟属性，即在数据库中不存在但可以通过其他字段计算得出的属性。
/*userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
}).set(function(fullName) {
  const parts = fullName.split(' ');
  this.firstName = parts[0];
  this.lastName = parts[1];
});*/


//定义预处理函数和后处理函数，可以在特定的事件发生前或发生后执行
// 执行保存前的事情，比如记录日志事件
// userSchema.post('save', function(doc) {
//   console.log('User saved:', doc);
// });

// Hash the password before saving the user
// 可以执行保存成功之后的事情，比如发送email
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
// Method to compare the provided password with the stored hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log(`Comparing ${candidatePassword} with ${this.password}`);
  return await bcrypt.compare(candidatePassword, this.password);
};
//3.将文档结构发布为模型
/**
 * User :第一个参数是跟 model 对应的集合（ collection ）名字的 单数 形式
 *        Mongoose 会自动找到名称是 model 名字 复数 形式的 collection
 *        User 这个 model 就对应数据库中 users 这个 collection
 *
 *        .model() 这个函数是对 schema 做了拷贝（生成了 model）。 你要确保在调用 .model() 之前把所有需要的东西都加进 schema 里了
 *        直到 model 使用的数据库连接（ connection ）被打开，users 才会被创建/删除
 */


// 新增：如果是Entity，使用save方法，如果是Model，使用create方法


module.exports = mongoose.model('User',userSchema)
