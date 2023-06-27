/***
 * 说明：
   commitlint.config.js 配置文件可以添加自己的规则，这里 @commitlint/config-conventional 提供了官方的规则扩展：
   build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
   ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
   docs：文档更新
   feat：新增功能
   merge：分支合并 Merge branch ? of ?
   fix：bug 修复
   perf：性能, 体验优化
   refactor：重构代码(既没有新增功能，也没有修复 bug)
   style：不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)
   test：新增测试用例或是更新现有测试
   revert：回滚某个更早之前的提交
   chore：不属于以上类型的其他类型
 **/
/**
"off"或者0:關閉規則 "warn"或1:開啟規則丟擲警告 "error"或2:開啟規則丟擲錯誤
**/
module.exports = {
  extends: ['@commitlint/config-conventional'],
  // 定义规则类型
  rules: {
    // type 类型定义，表示 git 提交的 type 必须在以下类型范围内
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能 feature
        'fix', // 修复 bug
        'docs', // 文档注释
        'style', // 代码格式(不影响代码运行的变动)
        'refactor', // 重构(既不增加新功能，也不是修复bug)
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build' // 打包
      ]
    ],
    'subject-empty': [0],
    // subject 大小写不做校验
    'subject-case': [0],
    'type-empty': [0]
  }
};
