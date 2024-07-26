//4.有了模型构造函数以后，使用这个构造函数对 users 集合中的数据进行操作(增删改查)
const User = require("./users")
const fs = require("fs")
const path = require("path")
const multer = require('multer')
const Qs = require("qs")
const crypto = require("crypto");
const axios = require("./axios")
const log = require("../utils/log4j")
const client = require('../utils/redis');

// 用于存储 access_token 和 openid 的键名前缀
const ACCESS_TOKEN_KEY_PREFIX = 'wechat_access_token:';
const OPENID_KEY_PREFIX = 'wechat_openid:';
// 用于存储已使用的 code 的键名前缀
const USED_CODE_KEY_PREFIX = 'wechat_used_code:';
// 用于存储已缓存的用户信息的键名前缀
const USER_INFO_KEY_PREFIX = 'wechat_user_info:';

// 用于存储基础 access_token 的键名
const BASE_ACCESS_TOKEN_KEY = 'wechat_base_access_token';

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
  addUser(req, res) {
    let response = res
    User.create(req.body, function (err, res) {
      if (err) {
        response.send({
          status: 0,
          message: '添加失败'
        })
      } else {
        response.send({
          status: 200,
          message: '添加成功'
        })
      }
    });

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

  /***
   * 微信公众号
   */
  // 引导用户进入授权页面同意授权，获取code
  // 通过code换取网页授权access_token（与基础支持中的access_token不同）
  // 如果需要，开发者可以刷新网页授权access_token，避免过期
  // 通过网页授权access_token和openid获取用户基本信息（支持UnionID机制）

  // 微信登录
  wexinLogin(req, res) {
    const APPID = process.env.APPID//公众号的唯一标识
    const REDIRECT_URI = process.env.REDIRECT_HOST + "/wechat"//授权后重定向的回调链接地址， 请使用 urlEncode 对链接进行处理
    const SCOPE = "snsapi_userinfo"//授权作用域，可取值：snsapi_base：自动确认授权、snsapi_userinfo:手动确认授权
    const STATE = "123"
    // 如果用户同意授权，页面将跳转至 redirect_uri/?code=CODE&state=STATE。
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=${STATE}#wechat_redirect`
    log.info("wexinLogin url " + url)
    res.redirect(url);
  }
  //通过code换取网页授权access_token
  async getWeixinAccessToken(req, res) {
    log.info("getWeixinAccessToken 开始");
    const APPID = process.env.APPID//公众号的唯一标识
    const SECRET = process.env.SECRET
    const CODE = req.query.code

    // 检查 code 是否已被使用
    const usedCode = await client.get(USED_CODE_KEY_PREFIX + CODE)

    // const value = await client.get(USED_CODE_KEY_PREFIX + CODE)
    log.info("usedCode的值"+USED_CODE_KEY_PREFIX + CODE);
    log.info(usedCode);
    // log.info(value);
    if (usedCode) {
      log.info('Code has already been used.');
      log.info(usedCode);
      res.status(400).send('Code has already been used.');
      return;
    }

    let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${SECRET}&code=${CODE}&grant_type=authorization_code`
    log.info("getWeixinAccessToken url : " + url)
    axios.get(url).then(response => {
      log.info("getWeixinAccessToken data : ")
/*      {
        access_token: null,//用于调用微信开放接口的凭据，有效期有限。
        expires_in: null,
        refresh_token: null,
        openid: null,//用户的唯一标识符，用于区分不同的用户。
        scope: null
      }*/
      log.info(response)
      if (response && response.access_token) {
        // 将 access_token 存储到 Redis
        client.set(ACCESS_TOKEN_KEY_PREFIX + response.openid, response.expires_in, response.access_token);
        // 将 openid 存储到 Redis
        client.set(OPENID_KEY_PREFIX + response.code, response.openid, 'EX', 600); // 10 minutes
        // 将 code 标记为已使用
        client.set(USED_CODE_KEY_PREFIX + response.code, 'true', 'EX', 600); // 10 minutes
      }
      res.send(response)
    })
  }
  // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
  async getWeixinUserinfo(req,res) {
    let access_token = req.query.access_token;
    let openid = req.query.openid;

    // 检查是否已有缓存的用户信息
    const cachedUserInfo = await client.get(USER_INFO_KEY_PREFIX + openid)

    let userInfo;
    if (cachedUserInfo) {
      log.info('从缓存里读取用户信息');
      userInfo = JSON.parse(cachedUserInfo);
      return res.send(userInfo)
    }

    let url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN'
    log.info("getWeixinUserinfo url : " + url)
    // 使用access_token和openid获取用户信息
    axios.get(url).then(userinfo => {
      // 第四步：根据获取的用户信息进行对应操作
      log.info('获取微信信息成功！');
      log.info(userinfo);
      // 小测试，实际应用中，可以由此创建一个帐户
      if (userinfo && userinfo.openid) {
        // 将用户信息存储到 Redis
        client.set(USER_INFO_KEY_PREFIX + openid, JSON.stringify(userinfo), 'EX', 7200); // 2 hours
      }
      res.send(userinfo);
    });
  }
  // 验证
  checkSignature(req,res) {
    const signature = req.query.signature;// 微信传过来的签名
    const timestamp = req.query.timestamp;// 微信传过来的时间戳
    const nonce = req.query.nonce;// 微信传过来的随机数
    const token = "test"// 用户配置的接口配置信息Token

    var str = [token, timestamp, nonce].sort().join('');
    if (signature === crypto.createHash('sha1').update(str).digest('hex')) {
      log.info("checkSignature 验证成功" + req.query.echostr)
      res.send(req.query.echostr);
    } else {
      log.info("checkSignature 验证失败")
      res.send(false);
    }
  }

  /**
   * 微信公众号基础接口
   */
  // 获取access_token
  async get_access_token(req,res) {
    try {
      // 从 Redis 中获取 access_token
      const accessToken = await client.get(BASE_ACCESS_TOKEN_KEY)

      if (accessToken) {
        res.json({ access_token: accessToken });
      } else {
        // 重新获取
        const newAccessToken = await this.fetchAccessToken();
        res.json({ access_token: newAccessToken });
      }
    } catch (error) {
      res.status(500).send('An error occurred while fetching access token.');
    }
  }
  // 请求access_token
  async fetchAccessToken() {
    try {
      const response = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
        params: {
          grant_type: 'client_credential',
          appid: process.env.APPID,
          secret: process.env.SECRET,
        },
      });

      if (response && response.access_token) {
        const accessToken = response.access_token;
        const expiresIn = response.expires_in;

        // 将 access_token 存储到 Redis
        client.setex(BASE_ACCESS_TOKEN_KEY, expiresIn - 300, accessToken); // 减去300秒，提前刷新

        return accessToken;
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

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
