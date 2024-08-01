//4.有了模型构造函数以后，使用这个构造函数对 users 集合中的数据进行操作(增删改查)
const Product = require("../product")
const fs = require("fs")
const log = require("../../utils/log4j")

async function addProduct(req,res) {
  try {
    let body = req.body
    log.info(body)
    let pd = new Product(body)
    let data = await pd.save()
    log.info(data)
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  addProduct
}
