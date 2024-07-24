const axios = require('axios');
const service = axios.create({
  timeout: 20 * 1000 // 请求超时时间
});

module.exports = service
