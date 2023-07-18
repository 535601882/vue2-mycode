const viewGenerator = require("./plop-templates/view/default-page/prompt");
const componentGenerator = require("./plop-templates/component/prompt");
const storeGenerator = require("./plop-templates/store/prompt.js");

module.exports = function (plop) {
  // create your generators here
  plop.setGenerator("basics", {
    description: "this is a skeleton plopfile",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "test name",
      },
      {
        type: "list",
        name: "select",
        message: "Select a package manager",
        choices: [
          {
            name: "npm",
            value: "npm",
            description: "npm is the most popular package manager",
          },
          {
            name: "yarn",
            value: "yarn",
            description: "yarn is an awesome package manager",
          },
          {
            name: "jspm",
            value: "jspm",
            disabled: true,
          },
          {
            name: "pnpm",
            value: "pnpm",
            disabled: "(pnpm is not available)",
          },
        ],
      },
      {
        type: "checkbox",
        name: "checkbox",
        message: "Select a package manager",
        choices: [
          { name: "npm", value: "npm" },
          { name: "yarn", value: "yarn" },
          { name: "pnpm", value: "pnpm" },
          {
            name: "pnpm1",
            value: "pnpm1",
            disabled: "(pnpm is not available)",
          },
        ],
      },
      {
        type: "confirm",
        name: "confirm",
        message: "test confirm?",
      },
    ], // array of inquirer prompts
    actions(data) {
      console.log(data);
      var actions = [];
      return actions;
    },
  });
  plop.setGenerator("view", viewGenerator);
  plop.setGenerator("component", componentGenerator);
  plop.setGenerator("store", storeGenerator);
};
