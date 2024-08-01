//4.有了模型构造函数以后，使用这个构造函数对 users 集合中的数据进行操作(增删改查)
const Order = require("../order")
const WxPay = require('wechatpay-node-v3');
const fs = require("fs")
const log = require("../../utils/log4j")

const pay = null
// const pay = new WxPay({
//   appid: '直连商户申请的公众号或移动应用appid',
//   mchid: '商户号',
//   publicKey: fs.readFileSync('./apiclient_cert.pem'), // 公钥
//   privateKey: fs.readFileSync('./apiclient_key.pem'), // 秘钥
// });


// 生成订单
async function createOrder(req,res) {
  log.info(req.body)
  // Create a new order
  const newOrder = new Order({
    user: req.body.userId,
    items: req.body.items,
    total: req.body.total
  });

  // Save the order to the database
  const savedOrder = await newOrder.save();
  this.placeOrder({
    // 订单编号
    out_trade_no: savedOrder._id
  })
}
// 下单
async function placeOrder(req,res) {
  const params = {
    description: '测试',
    out_trade_no: '订单号',
    notify_url: '回调url',
    amount: {
      total: 1,
    },
    scene_info: {
      payer_client_ip: 'ip',
      h5_info: {
        type: 'Wap',
        app_name: '网页名称 例如 百度',
        app_url: '网页域名 例如 https://www.baidu.com',
      },
    },
  };
  console.log(params);
  const result = await pay.transactions_h5(params);
  console.log(result);
  res.status(200).json(result);
}
// 支付回调
function notify() {

}

module.exports = {
  placeOrder,
  createOrder,
  notify
}
