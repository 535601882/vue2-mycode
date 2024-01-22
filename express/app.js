const express = require('express')
const path = require("path")
const cors = require('cors');
const app = express()

const bodyParser = require('body-parser')

// 使用 CORS 中间件，允许所有来源的跨域请求
app.use(cors());

app.use(express.static(__dirname + '../public'));
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));

require('./routes')(app)

app.listen(3001, () => {
  console.log("app listening on port 3001")
})
