#!/usr/bin/env node
const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const config = require(path.resolve(process.cwd(), './sprout.config.js'));

async function getTemplates() {

  const { templateDir } = config();

  const folderPath = path.resolve(process.cwd(), templateDir);
  const templates = fs.readdirSync(folderPath);

  const templateList = templates.map( template => {
    const templateConfig = require(
      path.resolve(process.cwd(), templateDir, template, 'template.config.js')
    );

    if(!templateConfig) {
      console.log(chalk.bgRed`[WARNING] - No 'template.config.js' file found in template folder ${template}`);
      return;
    }
    console.log(templateConfig.templateName, template);
    return { name: templateConfig.templateName, value: template };

  });

  return templateList;

}

async function ask(list) {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'templateChoice',
      message: 'Pick a template to generate: ',
      choices: list
    }
  ]);
  return answers.templateChoice;

}

async function getTemplateQuestions(template) {
  const { templateDir } = config();

  const templateConfig = require(path.resolve(process.cwd(), templateDir, template, 'template.config.js'));

  const variables = await inquirer.prompt(templateConfig.questions);

  return { template, variables };

}

async function renderTemplates({template, variables}) {
  // console.log(`I will render ${template} with`);
  // console.log(variables);
  return;
}

function init() {
  console.log(chalk.cyan`Let's generate some code!`);
  getTemplates()
    .then(ask)
    .then(getTemplateQuestions)
    .then(renderTemplates);

}

init();
