// 日志存储
// @author wmh
const log4js = require('log4js')

const levels = {
  'trace':log4js.levels.TRACE,//固定常量
  'debug':log4js.levels.DEBUG,
  'info':log4js.levels.INFO,
  'warn':log4js.levels.WARN,
  'error':log4js.levels.ERROR,
  'fatal':log4js.levels.FATAL,
}
// 假设这是一个过滤函数，它检查日志内容是否为空
function nonEmptyFilter(logEvent) {
  return logEvent.data.some(part => part && part.toString().trim().length > 0);
}
log4js.configure({
  //设置追加器
  appenders:{
    console:{ type:'console' },//追加器1
    info:{//追加器2
      type: 'dateFile',
      filename: 'logs/info', // 注意这里的filename格式，它将与pattern结合生成最终的文件名
      pattern: 'yyyy-MM-dd.log', // 这里定义了日期模式
      alwaysIncludePattern: true
    },
    error:{//追加器3
      type: 'dateFile',
      filename:'logs/error',
      pattern:'yyyy-MM-dd.log',
      alwaysIncludePattern:true// 设置文件名称为 filename + pattern
    }
  },
  //指定哪些追加器可以输出来
  categories:{
    default:{ appenders: [ 'console' ], level: 'debug' },
    info:{
      appenders: [ 'info','console' ],
      level: 'info'
    },
    error:{
      appenders: ['error','console' ],
      level: 'error'
    }
  }
})


/**
 * 日志输出，level为debug
 * @param {string} content
 */
exports.debug = (content)=>{
  let logger = log4js.getLogger();
  logger.level = levels.debug;
  logger.debug(content);
}

/**
 * 日志输出，level为info
 * @param {string} content
 */
exports.info = (content)=>{
  let logger = log4js.getLogger('info');
  logger.level = levels.info;
  logger.info(content);
}

/**
 * 日志输出，level为error
 * @param {string} content
 */
exports.error = (content)=>{
  let logger = log4js.getLogger('error');
  logger.level = levels.error;
  logger.error(content);
}
