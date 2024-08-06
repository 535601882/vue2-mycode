const express = require('express')
const cors = require('cors');
const app = express()
const swagger = require ('./swagger' ) ;
const client = require("./utils/redis")
const bodyParser = require('body-parser')
const log = require("./utils/log4j")
const errorMiddleware = require("./middleware/errorMiddleware");
const AppError = require("./utils/appError");
// 导入用户将客户端发送过来的 JWT 字符串，解析还原成 JSON 对象的包
const {expressjwt: expressJWT} = require('express-jwt')
// 白名单
const whitePath = ["/login","/register","/addUser","/refresh_token",/^\/api\//]

client.connect(); // 连接到Redis服务器

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

app.use((req, res, next) => {
  const { headers, method, originalUrl, query, body } = req;
  const headersParameters = JSON.stringify(headers);
  const queryParameters = JSON.stringify(query);
  const queryBody = JSON.stringify(body);
  // 在请求开始时记录基本信息
  log.info(`Request received - Method: ${method}, URL: ${originalUrl},Header Parameters: ${headersParameters}, Query Parameters: ${queryParameters},Body Parameters: ${queryBody}`);

  // 响应结束后记录响应状态码
  res.on('finish', () => {
    log.info(`Response sent - Status Code: ${res.statusCode}`);
  });

  next(); // 调用下一个中间件或路由处理器
});

// 默认情况下它是期望在Authorization头中找到带有Bearer前缀的token
app.use(expressJWT({
  secret: process.env.SECRETKEY,// 密钥
  algorithms: ['HS256'],
  requestProperty: 'auth',//请求对象中设置有效负载的属性名称。默认为 req.auth
  //通过 getToken 也可以自定义一些解析逻辑，比如使用其他 Header 字段，自定义抛出异常等
  getToken: function fromHeaderOrQuerystring(req) {
    let authorization = null
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      authorization = req.headers.authorization.split(" ")[1];
    } else if (req.headers.authorization) {
      authorization = req.headers.authorization;
    }

    // 校验是否在黑名单

    return authorization;
  },
  // 用于验证令牌是否被吊销的函数
  isRevoked: async function (req, token) {
    const tokenId = token.payload.jti;
    const status = await client.get(tokenId);
    return status !== null;
  }
}).unless({ path: whitePath }))// 白名单 path可以是字符串、正则表达式或其中任意一个的数组

swagger(app)

require('./routes')(app)


// Wrong path handler
app.all("*", (req, _, next) => {
  next(new AppError(`Path ${req.originalUrl} does not exist for ${req.method} method`, 404));
});
// 全局错误中间件
app.use(errorMiddleware);

module.exports = app;
