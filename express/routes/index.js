const path = require("path")
const fs = require("fs")
const database = require("../database/modules/users")
const wechat = require("../database/modules/wechat")
const wechatPay = require("../database/modules/wechatPay")
const product = require("../database/modules/product")
//引入multer
const multer = require('multer')
const uploadsFolder = path.join(__dirname, '../uploads')
// 验证是否存在文件夹
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder);
}

//设置上传文件存储地址
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsFolder);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
    }
  }
})

module.exports = app => {
  app.get("/getUsers", database.getUsers)
  app.get("/getUserId", database.getUserId)
  /** POST Methods */
  /**
   * @openapi
   * '/addUser':
   *  post:
   *     tags:
   *     - User Controller
   *     summary: Create a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - username
   *              - email
   *              - password
   *            properties:
   *              username:
   *                type: string
   *                default: johndoe
   *              email:
   *                type: string
   *                default: johndoe@mail.com
   *              password:
   *                type: string
   *                default: johnDoe20!@
   *     responses:
   *      201:
   *        description: Created
   *      409:
   *        description: Conflict
   *      404:
   *        description: Not Found
   *      500:
   *        description: Server Error
   */
  app.post("/addUser", database.addUser)
  app.delete("/delUser", database.delUser)
  app.put("/editUser", database.editUser)
  app.post("/uploadImg", upload.single('file'), database.uploadImg)
  /************ */
  // 测试接收post
  // application/x-www-form-urlencoded
  app.post("/postFormUrlencoded", database.postFormUrlencoded)
  // multipart/form-data
  app.post("/postFormData", upload.none(), database.postFormData)
  // application/json
  app.post("/postApplicationJson", database.postApplicationJson)
  // 利用get请求发送obj
  app.get("/createGet", database.createGet)
  // SSE连接
  app.get("/sse", database.createSSEData)
  // 获取远程图片
  app.get("/getImg", database.getImgForUrl)
  /**
   * 微信公众号
   * **/
  app.get("/wexinLogin", wechat.wexinLogin)
  app.get("/getWeixinAccessToken", wechat.getWeixinAccessToken)
  app.get("/checkSignature", wechat.checkSignature)
  app.get("/getWeixinUserinfo", wechat.getWeixinUserinfo)
  app.get("/getJsApiData", wechat.getJsApiData)
  /**生成订单**/
  app.post("/createOrder", wechatPay.createOrder)
  app.post("/addProduct", product.addProduct)
}
