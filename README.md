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

# 使用 PlopJs 自动执行重复性工作

```
plopfile.js

module.exports = function (plop) {
    // create your generators here
    plop.setGenerator('simple file', {
        description: 'this is a basic plopfile',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Who do you want to greet?(e.g World)'
            }
        ], // array of inquirer prompts
        actions: [
            {
                type: 'add',
                path: 'newFolder/greetings{{name}}.js',
                template: 'Hello {{name}}'
            }
        ]  // array of actions
    });
};
```

##  example.

```
const componentGenerator = require('./component/index.js');
const containerGenerator = require('./container/index.js');
const actionGenerator = require('./action/index.js');
const reducerGenerator = require('./reducer/index.js');
const apiGenerator = require('./api/index.js');

module.exports = plop => {
    plop.addHelper('upperCase', text => text.toUpperCase());
    plop.setGenerator('component', componentGenerator);
    plop.setGenerator('container', containerGenerator);
    plop.setGenerator('action', actionGenerator);
    plop.setGenerator('reducer', reducerGenerator);
    plop.setGenerator('api', apiGenerator);
};
```

### Vue.Draggable 使用方式

- group: 设置可拖拽列表的分组，可以是一个字符串或一个对象。同一分组的列表可以互相拖拽排序。(将选项设置pull为clone意味着将元素拖出此列表将保留clone该元素，而不是将其永久移出列表。设置put为false意味着我们无法将新元素拖到该组中。)
- animation: 设置拖拽排序时元素的动画速度，以毫秒为单位。
- handle: 设置拖拽排序的句柄元素选择器，只有在该句柄元素上才能拖拽排序。
- onStart: 拖拽开始时触发的回调函数，可以用于执行一些逻辑。
- onEnd: 拖拽结束时触发的回调函数，可以用于执行一些逻辑，获取拖拽后的索引位置等。
- onAdd: 当元素被从另一个列表拖拽到该列表时触发的回调函数。
- onUpdate: 列表中的元素排序发生改变时触发的回调函数。
- onSort: 列表中的元素位置发生改变时触发的回调函数。
- onRemove: 当元素从列表中移除并被拖拽到另一个列表时触发的回调函数。
