const express = require('express')
const path = require("path")
const cors = require('cors');
const app = express()
const swagger = require ('./swagger' ) ;
const client = require("./utils/redis")
const bodyParser = require('body-parser')
const log = require("./utils/log4j")
// 导入用户将客户端发送过来的 JWT 字符串，解析还原成 JSON 对象的包
const {expressjwt: expressJWT} = require('express-jwt')
const port = 3001

client.connect(); // 连接到Redis服务器

// 读取env配置
require("dotenv").config({
  path: [path.resolve(__dirname, '.env.local'), path.resolve(__dirname, './.env')] // 配置文件路径
}).parsed // 引入 dotenv


// 使用 CORS 中间件，允许所有来源的跨域请求
app.use(cors());

app.use(express.static(__dirname + '../public'));
app.use('/uploads', express.static('uploads'));

// 接收post Json
app.use(bodyParser.json())
// 接收URL-encoded格式的数据
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(expressJWT({
  secret: process.env.SECRETKEY,// 密钥
  algorithms: ['HS256']
}).unless({ path: ["/login","/addUser",/^\/api\//] }))// 白名单 path可以是字符串、正则表达式或其中任意一个的数组

app.use((req, res, next) => {
  const { method, originalUrl, query, body } = req;
  const queryParameters = JSON.stringify(query);
  const queryBody = JSON.stringify(body);
  // 在请求开始时记录基本信息
  log.info(`Request received - Method: ${method}, URL: ${originalUrl}, Query Parameters: ${queryParameters},Body Parameters: ${queryBody}`);

  // 响应结束后记录响应状态码
  res.on('finish', () => {
    log.info(`Response sent - Status Code: ${res.statusCode}`);
  });

  next(); // 调用下一个中间件或路由处理器
});
swagger(app, port)

require('./routes')(app)

process.on("exit", (code) => {
  console.log("exiting", code);
});

process.on('uncaughtException', err => {
  console.log(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled rejection at ', promise, `reason: ${reason}`)
  process.exit(1)
})

process.on("SIGINT", (code) => {
  console.log("SIGINT==>", code);
  process.exit(0)
});

process.on("SIGTERM", (code) => {
  console.log("SIGTERM==>", code);
  process.exit(0)
});

// 全局错误中间件
// eslint-disable-next-line no-unused-vars
app.use((err,req,res,next)=>{
  // 这次错误是由 token 解析失败导致的
  if (err.name === 'UnauthorizedError') {
    return res.send({
      status: 401,
      message: '无效的token'
    })
  }
  res.send({
    status: 500,
    message: err.message
  })
})
app.listen(port, () => {
  console.log("app listening on port 3001")
})
