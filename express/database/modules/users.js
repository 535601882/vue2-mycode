//4.有了模型构造函数以后，使用这个构造函数对 users 集合中的数据进行操作(增删改查)
const User = require("../user")
const bcrypt = require('bcryptjs');
const fs = require("fs")
const path = require("path")
const multer = require('multer')
const Qs = require("qs")
const axios = require("../axios")
// 导入用于生成 JWT 字符串的包
const jwt = require('jsonwebtoken')
const client = require('../../utils/redis');
const { v4: uuidv4 } = require('uuid');

class API {
  getUsers(req, res) {
    let response = res
    const pageNumber = parseInt(req.query.pageNumber); // 页码
    const pageSize = parseInt(req.query.pageSize); // 页大小
    if (!pageNumber) return res.status(500).send({ error: 'pageNumber不能为空' });
    if (!pageSize) return res.status(500).send({ error: 'pageSize不能为空' });
    // 计算要跳过的文档数量
    const skip = (pageNumber - 1) * pageSize;
    // 查询文档可以用 model 的 find, findById, findOne, 和 where 这些静态方法
    User.find({}, null, {
      sort: '-date',
      limit: pageSize, // 限制每页的数量
      skip: skip,   // 跳过的文档数量
    }, (err, result, res) => {
      console.log("result length",result.length);
      if (err) {
        response.send({
          status: 0,
          message: '查询失败'
        })
        return
      }
      // 查询总文档数量，以便用于分页计算
      User.countDocuments(req.query, (err, totalCount) => {
        if (err) {
          response.send({
            status: 0,
            message: '查询失败'
          });
          return;
        }
        response.send({
          status: 200,
          message: '',
          result: result,
          totalCount: totalCount,
          currentPage: pageNumber,
          pageSize: pageSize,
          totalPage: Math.ceil(totalCount / pageSize)
        })
      })
    })

  }
  getUserId(req, res) {
    let response = res
    User.findOne({
      _id: req.query.id
    }, (err, result, res) => {
      if (err) {
        response.send({
          status: 0,
          message: '查询失败'
        })
        return
      }
      response.send({
        status: 200,
        message: '',
        result: result
      })
    })
  }
  async addUser(req, res) {
    // 批量
    // let response = res
    // User.create(req.body, function (err, res) {
    //   if (err) {
    //     response.send({
    //       status: 0,
    //       message: '添加失败'
    //     })
    //   } else {
    //     response.send({
    //       status: 200,
    //       message: '添加成功'
    //     })
    //   }
    // });
    try {
      // Check if a user with the same email already exists
      const existingUser = await User.findOne({ email: req.body.email });

      if (existingUser) {
        return res.status(409).json({ message: 'Email is already registered.' });
      }

      // Create and save the new user
      const newUser = new User(req.body);
      const savedUser = await newUser.save();

      res.status(200).json(savedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  delUser(req, res) {
    let response = res
    User.deleteOne({
      _id: req.query.id
    }, function (err) {
      if (err) {
        response.send({
          status: 0,
          message: '删除失败'
        })
      } else {
        response.send({
          status: 200,
          message: '删除成功'
        })
      }
    });
  }
  editUser(req, res) {
    let response = res
    // model 的 remove 方法可以删除所有匹配查询条件（ conditions ）的文档
    // 更新单独一条文档并且返回给应用层，可以使用 findOneAndUpdate 方法
    User.findByIdAndUpdate(req.body._id, req.body, function (err, ret) {
      if (err) {
        response.send({
          status: 0,
          message: '编辑失败'
        })
      } else {
        response.send({
          status: 200,
          message: '编辑成功'
        })
      }
    })
  }
  uploadImg(req, res) {
    console.log(JSON.stringify(req.file))
    let response = res
    try {
      res.send(req.file);
    } catch (error) {
      console.log(error);
      res.send(400);
    }
  }
  /*********************测试接收post***************** */
  // application/x-www-form-urlencoded
  postFormUrlencoded(req, res) {
    console.log({
      query: req.query,
      params: req.params,
      body: req.body,
      pars: Qs.parse(req.body)
    })
    // res.sendStatus(403) // 会显示Forbidden
    // res.status(403).end() // 只更改状态值不返回任何值
    // res.status(403).json({
    //   status: 200,
    //   message: req.body
    // })
    // 默認200
    res.send({
      status: 200,
      message: Qs.parse(req.body)
    })
  }
  // multipart/form-data
  postFormData(req, res) {
    console.log({
      query: req.query,
      params: req.params,
      body: req.body
    })
    res.send({
      status: 200,
      message: req.body
    })
  }
  // application/json
  postApplicationJson(req, res) {
    console.log({
      query: req.query,
      params: req.params,
      body: req.body
    })
    res.send({
      status: 200,
      message: req.body
    })
  }
  // get 发送 object
  createGet(req, res) {
    console.log({
      query: req.query,
      params: req.params,
      body: req.body
    })
    res.send({
      status: 200,
      message: req.query
    })
  }
  // SSE请求
  createSSEData(req, res) {
    // 检查认证信息
    const authHeader = req.headers['authorization'];
    console.log("authHeader",authHeader)
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    });

    sseRandom(res)
  }
  // 请求下载图片 get
  getImgForUrl(req, res) {
    let url = req.query.url
    if (!url) return res.send({
      status: 0,
      message: 'URL不能为空'
    })
    axios.get(url,{responseType: 'arraybuffer'}).then(data => {
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(data)
    })
  }
  async login(req, res) {
    // 将 req.body 请求体中的数据，转存为 userinfo 常量
    const { email, password } = req.body
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: '账户不存在' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      return res.status(401).json({ message: '帐号或密码错误' });
    }
    const token_expires_in = 120//120s
    const refreshToken_expires_in = 3600//1 hour
    // 登录成功
    // 在登录成功之后，调用 jwt.sign() 方法生成 JWT 字符串。并通过 token 属性发送给客户端
    let payload = { username: user.username,email: user.email,birthday: user.birthday,address: user.address }
    const tokenStr = jwt.sign(
      {...payload,jti: uuidv4()},
      process.env.SECRETKEY,// 定义 secret 密钥
      { expiresIn: token_expires_in }//例如： 60 ， "2 days" ， "10h" ， "7d" 。数值被解释为秒数。如果使用字符串，请确保提供时间单位（天、小时等），否则默认使用毫秒单位（ "120" 等于 "120ms" ）。
    )
    // 生成刷新token
    const refreshToken = jwt.sign({...payload,jti: uuidv4()}, process.env.SECRETKEY, { expiresIn: refreshToken_expires_in });
    // 向客户端响应成功的消息
    res.send({
      status: 200,
      message: '登录成功！',
      token: tokenStr, // 要发送给客户端的 token 字符串
      refreshToken,
      expiresAt: Date.now() + (token_expires_in * 1000) // 过期时间 当前时间 + 30s
    })
  }
  // 刷新token
  refresh_token(req, res) {
    const refreshToken = req.body.refreshToken;
    jwt.verify(refreshToken, process.env.SECRETKEY, (err, decoded) => {
      if (err) {
        return res.status(401).send('Invalid refresh token');
      }

      const token = jwt.sign({ username: decoded.username,email: decoded.email,birthday: decoded.birthday,address: decoded.address }, process.env.SECRETKEY, { expiresIn: '30s' });
      res.json({ token });
    });
  }
  // 退出登录
  async logout(req, res) {
    const token = req.headers.authorization
    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }
    // Blacklist the token by storing it in Redis
    let jti = req.auth.jti
    await client.set(jti, "true", {
      EX: 30,
      NX: true
    });
    res.send({ status: 200, message: 'Logged out successfully.' });
  };
}
const api = new API()
module.exports = api


function sseRandom(res) {
  res.write(`id: ${ new Date().getTime()}\n`);
  res.write(`event: stdout\n`);
  res.write("data:  begin message\n");
  res.write("data: " + (Math.floor(Math.random() * 1000) + 1) + "\n");
  res.write("data:  continue message\n\n");
  setTimeout(() => sseRandom(res), Math.random() * 5000);
}
