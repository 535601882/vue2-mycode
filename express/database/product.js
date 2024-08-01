const mongoose = require("./db.js")
const Schema = mongoose.Schema
//2.设计集合结构（表结构）
// 产品表
const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  stock: { type: Number, default: 0 },
  category: { type: String, default: 'General' }
}, { timestamps: true });

//3.将文档结构发布为模型
/**
 * User :第一个参数是跟 model 对应的集合（ collection ）名字的 单数 形式
 *        Mongoose 会自动找到名称是 model 名字 复数 形式的 collection
 *        User 这个 model 就对应数据库中 users 这个 collection
 *
 *        .model() 这个函数是对 schema 做了拷贝（生成了 model）。 你要确保在调用 .model() 之前把所有需要的东西都加进 schema 里了
 *        直到 model 使用的数据库连接（ connection ）被打开，users 才会被创建/删除
 */
module.exports = mongoose.model('Product',productSchema)
