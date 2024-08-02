//4.有了模型构造函数以后，使用这个构造函数对 users 集合中的数据进行操作(增删改查)
const fs = require("fs")
const path = require("path")
const multer = require('multer')
const Qs = require("qs")
const crypto = require("crypto");
const axios = require("../axios")
const log = require("../../utils/log4j")
const client = require('../../utils/redis');
// 将xml处理成json
const xml2js = require('xml2js');
//FormData是Web API的一部分，而不是Node.js的标准库
const FormData = require('form-data');

// 用于存储 access_token 和 openid 的键名前缀
const ACCESS_TOKEN_KEY_PREFIX = 'wechat_access_token:';
const OPENID_KEY_PREFIX = 'wechat_openid:';
// 用于存储已使用的 code 的键名前缀
const USED_CODE_KEY_PREFIX = 'wechat_used_code:';
// 用于存储已缓存的用户信息的键名前缀
const USER_INFO_KEY_PREFIX = 'wechat_user_info:';

// 用于存储基础 access_token 的键名
const BASE_ACCESS_TOKEN_KEY = 'wechat_base_access_token';

// 保存jsapi_ticket
const JSAPI_TICKET_KEY = "jsapi_ticket"

/**
 * 生成签名的时间戳
 * @return {字符串}
 */
function createTimestamp() {
  return parseInt(new Date().getTime() / 1000) + ''
}

/**
 * 生成签名的随机串
 * @return {字符串}
 */
function createNonceStr() {
  return Math.random().toString(36).substr(2, 15)
}

/**
 * 对参数对象进行字典排序
 * @param  {对象} args 签名所需参数对象
 * @return {字符串}    排序后生成字符串
 */
function raw(args) {
  var keys = Object.keys(args)
  keys = keys.sort()
  var newArgs = {}
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key]
  })

  var string = ''
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substr(1)
  return string
}

// 回复文本消息
const textMsg = (result, content) => {
  console.log('reply type text !')
  var xmlContent = '<xml><ToUserName><![CDATA[' + result.FromUserName + ']]></ToUserName>'
  xmlContent += '<FromUserName><![CDATA[' + result.ToUserName + ']]></FromUserName>'
  xmlContent += '<CreateTime>' + new Date().getTime() + '</CreateTime>'
  xmlContent += '<MsgType><![CDATA[text]]></MsgType>'
  xmlContent += '<Content><![CDATA[' + content + ']]></Content></xml>'
  return xmlContent
}

// 回复图片
const imgMsg = function (result, media_id) {
  console.log('reply type image !', media_id)
  var xmlContent = '<xml><ToUserName><![CDATA[' + result.FromUserName + ']]></ToUserName>'
  xmlContent += '<FromUserName><![CDATA[' + result.ToUserName + ']]></FromUserName>'
  xmlContent += '<CreateTime>' + new Date().getTime() + '</CreateTime>'
  xmlContent += '<MsgType><![CDATA[image]]></MsgType>'
  xmlContent += '<Image><MediaId><![CDATA[' + media_id + ']]></MediaId></Image></xml>'
  return xmlContent
}

// 回复图文消息
const graphicMsg = (result, contentArr) => {
  console.log('reply type image and text !')
  var xmlContent = '<xml><ToUserName><![CDATA[' + result.FromUserName + ']]></ToUserName>'
  xmlContent += '<FromUserName><![CDATA[' + result.ToUserName + ']]></FromUserName>'
  xmlContent += '<CreateTime>' + new Date().getTime() + '</CreateTime>'
  xmlContent += '<MsgType><![CDATA[news]]></MsgType>'
  xmlContent += '<ArticleCount>' + contentArr.length + '</ArticleCount>'
  xmlContent += '<Articles>'
  contentArr.map((item, index) => {
    xmlContent += '<item>'
    xmlContent += '<Title><![CDATA[' + item.Title + ']]></Title>'
    xmlContent += '<Description><![CDATA[' + item.Description + ']]></Description>'
    xmlContent += '<PicUrl><![CDATA[' + item.PicUrl + ']]></PicUrl>'
    xmlContent += '<Url><![CDATA[' + item.Url + ']]></Url>'
    xmlContent += '</item>'
  })
  xmlContent += '</Articles></xml>'
  return xmlContent
}

// 根据media_id 获取临时素材
async function downloadMedia(mediaId) {
  let {access_token: accessToken} = await get_access_token();
  const url = `https://api.weixin.qq.com/cgi-bin/media/get?access_token=${accessToken}&media_id=${mediaId}`;
  return axios({
    url,
    method: 'GET',
    responseType: 'arraybuffer'
  })
}

// 素材上传获取 media_id 新增临时素材
function uploadFile (buffer, type) {
  return new Promise(async (resolve, reject) => {
    let {access_token: accessToken} = await get_access_token();
    const form = new FormData();
    form.append('media', buffer, { filename: 'image.jpg' });
    var url = 'https://api.weixin.qq.com/cgi-bin/media/upload?access_token=' + accessToken + '&type=' + type
    log.info({url,form,headers: form.getHeaders()})
    axios.post(url, form, {headers: form.getHeaders()}).then((result) => {
      console.log(result)
      log.info("上传附件")
      log.info(result)
      if (result.errcode) {
        return reject(result)
      }
      resolve(result.media_id)
    }).catch(e => {
      console.log("上传失败",e,form)
      reject(e)
    })
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
function wexinLogin(req, res) {
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
async function getWeixinAccessToken(req, res) {
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
  axios.get(url).then(async response => {
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
      await client.set(ACCESS_TOKEN_KEY_PREFIX + response.openid, response.access_token, {
        EX: response.expires_in,
        NX: true
      });
      // 将 openid 存储到 Redis
      await client.set(OPENID_KEY_PREFIX + CODE, response.openid, {
        EX: 600,
        NX: true
      }); // 10 minutes
      // 将 code 标记为已使用
      await client.set(USED_CODE_KEY_PREFIX + CODE, 'true', {
        EX: 600,
        NX: true
      }); // 10 minutes
    }
    res.send(response)
  })
}
// 第三步：拉取用户信息(需scope为 snsapi_userinfo)
async function getWeixinUserinfo(req,res) {
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
      client.set(USER_INFO_KEY_PREFIX + openid, JSON.stringify(userinfo), {
        EX: 7200,
        NX: true
      }); // 2 hours
    }
    res.send(userinfo);
  });
}
// 验证
function checkSignature(req,res) {
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
// AccessToken中控服务器： todo 注意加上锁（可以使用redis原子）
//
// 负责： 提供主动刷新和被动刷新机制来刷新accessToken并存储（为了防止并发刷新，注意加并发锁），提供给业务逻辑有效的accessToken。
// 优点： 避免业务逻辑方并发获取access_token，避免AccessToken互相覆盖，提高业务功能的稳定性。
async function get_access_token() {
  try {
    // 从 Redis 中获取 access_token
    const accessToken = await client.get(BASE_ACCESS_TOKEN_KEY)

    log.info('accessToken = ' + accessToken)
    if (accessToken) {
      log.info("从缓存中获取")
      return { access_token: accessToken };
    } else {
      log.info("重新获取")
      // 重新获取
      const newAccessToken = await fetchAccessToken();
      log.info('newAccessToken = ' + newAccessToken)
      return { access_token: newAccessToken };
    }
  } catch (error) {
    throw error
  }
}
// 请求access_token
async function fetchAccessToken() {
  log.info("调用fetchAccessToken")
  try {
    const response = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
      params: {
        grant_type: 'client_credential',
        appid: process.env.APPID,
        secret: process.env.SECRET,
      },
    });
    log.info('https://api.weixin.qq.com/cgi-bin/token = 获取的数据')
    log.info(response)
    if (response && response.access_token) {
      const accessToken = response.access_token;
      const expiresIn = response.expires_in;

      // 将 access_token 存储到 Redis
      await client.set(BASE_ACCESS_TOKEN_KEY, accessToken, {
        EX: expiresIn - 300,
        NX: true
      }); // 减去300秒，提前刷新

      return accessToken;
    } else {
      throw new Error('Failed to get access token');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}


/**
 * 根据access_token获取api_ticket
 *
 * @param  {String} access_token
 * @return {Promise}
 */
function getTicket(access_token){
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve,reject)=>{
    let jsapi_ticket = await client.get(JSAPI_TICKET_KEY)
    if (jsapi_ticket) {
      log.info("从缓存中获取ticket: " + jsapi_ticket)
      return resolve({ticket: jsapi_ticket})
    }
    axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`).then(async res => {
        if (res.errcode === 0){
          await client.set(JSAPI_TICKET_KEY,res.ticket, {
            // EX: res.expires_in - 300,
            EX: 60,
            NX: true
          })
          log.info("获取ticket: " + res.ticket)
          resolve(res)
        } else {
          reject(res)
        }
    });
  });
}

/**
 * 根据api_ticket和url通过加密返回所有config数据
 *
 * @param  {String} href
 * @return {Object} configdata
 */
async function getJsApiData(req,res){
  let href = req.query.href
  if (!href) {
    res.send({
      status: 500,
      message: "href不能为空"
    })
    return
  }
  let ret = {};
  try{
    const accessTokenData = await get_access_token();
    const ticketData = await getTicket(accessTokenData.access_token);
    const decodeHref = decodeURIComponent(href);
    // noncestr随机字符串，一般自己生成
    // jsapi_ticket 从微信服务器或者自己的缓存中
    // timestamp时间戳自己生成
    // url当前页面的url，一定要动态获取，千万不要 hardcode
    // 然后再按照字典排序，进行排序  jsapi_ticket&noncestr&timestamp&url
    // 最后sha1 加密
    let nonceStr = createNonceStr()
    let timestamp = createTimestamp()
    ret = {
      jsapi_ticket: ticketData.ticket,
      nonceStr,
      timestamp,
      url: decodeHref
    };
    log.info("getSign 参数:")
    log.info(ret)
    let str = raw(ret)
    ret.signature = crypto.createHash('sha1').update(str).digest('hex')
    ret.appId = process.env.APPID
  }catch(err){
    //打印错误日志
    console.log(err);
  }
  log.info(ret)
  res.send(ret)
}


// 消息通知
/****
 * 两种方式处理xml
 * 一种使用express-xml-bodyparser 中间件来解析 POST 请求体中的 XML 数据
 * app.use(xmlBodyParser());
 * 一种手动处理
 * app.post('/', (req, res) => {
    let xmlData = '';

    req.on('data', chunk => {
        xmlData += chunk;
    });

    req.on('end', () => {
        parser.parseString(xmlData, (err, result) => {
            if (err) {
                res.send('Error parsing XML');
                return;
            }
            console.log(result);
            res.send('success');
        });
    });
});
 * @param req
 * @param res
 */
function replyMsg(req,res) {
  // 获取到微信返回的二进制数据
  var buffer = []
  req.on('data', (data) => {
    buffer.push(data)
  })
  req.on('end', () => {
    // 将数据转化成 utf-8 格式
    var msgXml = Buffer.concat(buffer).toString('utf-8')

    // 调用 xml2js 模块的 parseString 方法
    xml2js.parseString(msgXml, { explicitArray: false }, async (error, result) => {
      // 如果有错误直接抛出
      if (error) {
        console.error("报错了",error);
        res.status(500).send('Error parsing XML');
        return
      }
      const msg = result.xml // result.xml 是获取到的真实数据
      log.info("接收到消息")
      log.info(msg)
      const fromUser = msg.FromUserName;
      const toUser = msg.ToUserName;
      const msgType = msg.MsgType;
      const content = msg.Content;

      let reply = '';

      if (msgType === 'text') {
        reply = textMsg(msg,content)
        // res.set('Content-Type', 'application/xml');
        res.send(reply);
        return
      } if (msgType === 'image') {
        const mediaId = msg.MediaId;
        // 下载图片
        downloadMedia(mediaId)
          .then(buffer => {
            log.info("下载成功")
            log.info(buffer)
            // 上传图片到微信服务器
            return uploadFile(buffer,"image");
          })
          .then(newMediaId => {
            log.info("开始回复："+newMediaId)
            // 回复图片消息
            reply = imgMsg(msg,newMediaId)
            res.send(reply);
          })
          .catch(err => {
            console.error('Error handling image message:', err);
            res.status(500).send('');
          });
      } else {
        reply = `<xml>
                <ToUserName><![CDATA[${fromUser}]]></ToUserName>
                <FromUserName><![CDATA[${toUser}]]></FromUserName>
                <CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime>
                <MsgType><![CDATA[text]]></MsgType>
                <Content><![CDATA[Unsupported message type]]></Content>
            </xml>`;
        // res.set('Content-Type', 'application/xml');
        res.send(reply);
        return
      }
    })
  })
}


// 创建菜单
async function createMenu(req,res) {
  try {
    let {access_token: accessToken} = await get_access_token();
    const apiUrl = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${accessToken}`;

    // 菜单数据结构示例
    const menuData = {
      button: [
        {
          type: "click",
          name: "今日歌曲",
          key: "V1001_TODAY_MUSIC"
        },
        {
          name: "菜单",
          sub_button: [
            {
              type: "view",
              name: "搜索",
              url: "http://www.sogou.com/"
            },
            {
              type: "click",
              name: "赞一下我们",
              key: "V1001_GOOD"
            }
          ]
        }
      ]
    };

    const response = await axios.post(apiUrl, menuData); // 发送POST请求创建菜单

    if (response.errcode === 0) {
      res.send({ success: true, message: 'Menu created successfully.' });
    } else {
      res.status(500).send({ success: false, message: 'Failed to create menu.', error: response.data });
    }
  } catch (error) {
    console.error('Error creating menu:', error);
    res.status(500).send({ success: false, message: 'Failed to create menu.' });
  }
}

// 发送模版消息
async function sendTmpMsg(req,res) {
  try {
    let {access_token: accessToken} = await get_access_token();
    const apiUrl = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`;

    const response = await axios.post(apiUrl, {
      "touser": "",//接收者openid
      "template_id": "tNLTj8eG7j8n_aYztolxz_CWPmn2kAUnsBBcSFfLBHI",
      "url": "https://www.baidu.com/",
      "data": {
        "thing01": {
          "value": "某某"
        },
        "amount01": {
          "value": "￥100"
        },
        "thing02": {
          "value": "广州至北京"
        },
        "time01": {
          "value": "2019年10月1日 15:00"
        }
      }
    }); // 发送POST请求创建菜单

    if (response.errcode === 0) {
      res.send({ success: true, message: '发送成功' });
    } else {
      res.status(500).send({ success: false, message: '发送失败', error: response.data });
    }
  } catch (error) {
    console.error('Error creating menu:', error);
    res.status(500).send({ success: false, message: '发送失败' });
  }
}

module.exports = {
  wexinLogin,
  getWeixinAccessToken,
  getWeixinUserinfo,
  checkSignature,
  getJsApiData,
  replyMsg,
  createMenu,
  sendTmpMsg
}
