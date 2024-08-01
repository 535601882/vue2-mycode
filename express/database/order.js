const mongoose = require("./db.js")
const Schema = mongoose.Schema
//2.设计集合结构（表结构）
// 订单表
const orederSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Paid', 'Shipped', 'Delivered']
  }
}, { timestamps: true })
//3.将文档结构发布为模型
/**
 * User :第一个参数是跟 model 对应的集合（ collection ）名字的 单数 形式
 *        Mongoose 会自动找到名称是 model 名字 复数 形式的 collection
 *        User 这个 model 就对应数据库中 users 这个 collection
 *
 *        .model() 这个函数是对 schema 做了拷贝（生成了 model）。 你要确保在调用 .model() 之前把所有需要的东西都加进 schema 里了
 *        直到 model 使用的数据库连接（ connection ）被打开，users 才会被创建/删除
 */
module.exports = mongoose.model('Order',orederSchema)
