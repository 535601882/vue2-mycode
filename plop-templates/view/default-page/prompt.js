const { notEmpty } = require('../../utils.js')
module.exports = {
  description: "generate a view",
  prompts: [{
    type: "input",
    name: "name",
    message:"view name please",
    validate: notEmpty('name')
  },{
    type: "checkbox",
    name:"blocks",
    message: "Blocks:",
    choices:[{
      name:"<template>",
      value:"template",
      checked: true
    },{
      name: "<script>",
      value: "script",
      checked: true
    },{
      name:"<style>",
      value: "style",
      checked: true
    }],
    validate (value){
      if(value.indexOf("script") === -1 && value.indexOf("template") === -1) {
        return "View require at least a<script> or <template> tag."
      }
      return true
    }
  }],
  actions: data => {
    const aliasName = '{{camelCase name}}'
    const actions = [{
      type: "add",
      path: `src/views/${aliasName}/index.vue`,
      templateFile: "plop-templates/view/default-page/index.hbs",
      data: {
        name: aliasName,
        template: data.blocks.includes("template"),
        script: data.blocks.includes("script"),
        style: data.blocks.includes("style"),
      }
    },{
      path: 'src/router/routes/router.base.js',
      pattern: /(\/\/ ROUTE IMPORT)/g,
      template: `\t{
    path: "/{{dashCase name}}",
    name: "${aliasName}",
    meta: { title: '${aliasName}',keepalive: true},
    component: () => import(/* webpackChunkName: "${aliasName}" */ "@/views/${aliasName}/index.vue"),
  },\n$1`,
      type: 'modify',
    }]
    return actions
  }
}
