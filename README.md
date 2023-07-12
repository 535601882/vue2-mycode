# vue2-mycode

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# husky
https://typicode.github.io/husky/
## 手动安装
```
1.安装husky
npm install husky --save-dev

2.启用Git挂钩
npx husky install

3.要在安装后自动启用Git挂钩，请编辑package.json
npm pkg set scripts.prepare="husky install"

你应该有：
{
  "scripts": {
    "prepare": "husky install" 
  }
}
```
## 创建一个钩子
最多命令添加到挂钩或创建新命令，请使用husky add <file> [cmd]（运行前不要忘记husky install）。

```
npx husky add .husky/pre-commit "npm run lint"

npx husky add .husky/pre-push "npm run lint"

npx husky add .husky/pre-merge "npm run lint"

git add .husky/pre-commit
git add .husky/pre-push
git add .husky/pre-merge
```
尝试进行提交

`git commit -m "Keep calm and commit"`
如果npm test失败，您的提交将自动中止。

## 卸载
```
npm uninstall husky && git config --unset core.hooksPath
```


# lint-staged
我们希望每次commit ,push和merge等这样的操作的时候，只希望校验自己修改的文件代码规范，而不是全局的检验。 这就需要 lint-staged了。

lint-staged的作用是只对git add缓存区的代码进行eslint代码规范检验。这样就能避免全局校验的问题。 符合了我们修改了什么文件，就校验什么文件。其他的的代码不做eslint校验。


`npm install --save-dev lint-staged
`

在 package.json中添加：

```javascript
"lint-staged": {
   "src/**/*.{js,vue}": [
     "npm run lint"
   ]
},
```

src/**/*.{js,vue} 是需要校验的目录， 可以根据目录去修改。

hooks添加
`npx lint-staged`


# validate-branch-name 验证分支名称
当您想要确保每个分支名称都遵循特定模式（例如以feature、fix或开头）时，此挂钩会很方便release。

有一个小 npm 包可以帮助我们完成这个过程：validate-branch-name。它具有开箱即用的良好默认设置，您可以使用一些正则表达式知识进一步自定义。

首先，让我们安装这个包：

`$ npm install validate-branch-name --save-dev`
现在，让我们通过运行以下命令将其作为“预提交”挂钩添加到 Husky：

`$ npx husky add .husky/pre-commit "npx validate-branch-name"`

# 跳过 git hooks
如果我们想要跳过 commit 相关的hook，可以使用在脚本命令中加上 --no-verify 参数，如下所示：
`git commit -m '跳过hook' --no-verify`

# commitlint 验证提交信息
`yarn add  --dev @commitlint/cli @commitlint/config-conventional`

``` 
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
```
   
提交格式 

`<type>(<scope>): <subject>`

// 空一行

`<body>`

各个标志意义即必要性：

`type（必需）scope（可选）subject（必需）body(可选)`

 

```
type用于说明 commit 的类别

scope用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

subject是 commit 目的的简短描述，不超过50个字符。以动词开头，使用第一人称现在时，比如change，而不是changed或changes；第一个字母小写，结尾不加句号（.）

Body 部分是对本次 commit 的详细描述，可以分成多行。
```
