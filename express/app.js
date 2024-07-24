const express = require('express')
const path = require("path")
const cors = require('cors');
const app = express()
const swagger = require ('./swagger' ) ;
const port = 3001

require("dotenv").config({
  path: [path.resolve(__dirname, '.env.local'), path.resolve(__dirname, './.env')] // 配置文件路径
}).parsed // 引入 dotenv

const bodyParser = require('body-parser')

// 使用 CORS 中间件，允许所有来源的跨域请求
app.use(cors());

app.use(express.static(__dirname + '../public'));
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));

swagger(app, port)

require('./routes')(app)


app.listen(port, () => {
  console.log("app listening on port 3001")
})
