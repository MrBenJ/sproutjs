#!/usr/bin/env node
// @flow
import Chalk from 'chalk';
import Inquirer from 'inquirer';
import Ejs from 'ejs';
import path from 'path';
import fs from 'fs';

/** Sprout Root configuration file */
type SproutRootConfig = () => {
  templateDir: string
};

const config: SproutRootConfig = require(path.resolve(process.cwd(), './sprout.config.js'));

/**
 * Gets the list of all the templates
 *
 * @return {Promise<Array<{}>>} - Array of template objects
 */
async function getTemplates(): Promise<any> {

  const { templateDir } = config();

  const folderPath = path.resolve(process.cwd(), templateDir);
  const templates = fs.readdirSync(folderPath);

  const templateList = templates.map( template => {
    const templateConfig = require(
      path.resolve(process.cwd(), templateDir, template, 'template.config.js')
    );

    if(!templateConfig) {
      console.log(Chalk.bgRed`[WARNING] - No 'template.config.js' file found in template folder ${template}`);
      return;
    }
    console.log(templateConfig.templateName, template);
    return { name: templateConfig.templateName, value: template };

  });

  return templateList;

}

/**
 * Asks the user which template they would like to generate
 *
 * @ param {Array} list - The named list of all the templates to choose from
 * @return {Promise}
 */
async function ask(list) {
  const answers = await Inquirer.prompt([
    {
      type: 'list',
      name: 'templateChoice',
      message: 'Pick a template to generate: ',
      choices: list
    }
  ]);
  return answers.templateChoice;

}

/**
 * Asks the user template specific questions, then sends it to the renderTemplates() function
 *
 * @param  {String} - name of the template to be used
 * @return {Object} - Users's configuration from questions asked
 */
async function getTemplateQuestions(template: string) {
  const { templateDir } = config();

  const templateConfig = require(path.resolve(process.cwd(), templateDir, template, 'template.config.js'));

  const {
    onStart,
    questions,
    onCreate,
    onEnd } = templateConfig;

  if (onStart) {
    await onStart();
  }

  const variables = await Inquirer.prompt(templateConfig.questions);

  return { template, variables, onCreate, onEnd };

}

async function renderTemplates({template, variables, onCreate, onEnd }) {
  if (onCreate) {
    await onCreate(variables);
  }

  // Render templates here!

  if (onEnd) {
    await onEnd();
  }

  process.exit(0);
}

function init() {
  console.log(Chalk.cyan`Sprout JS `, Chalk.bold.white`v0.1.0`);
  console.log(Chalk.cyan`Let's generate some code!`);
  getTemplates()
    .then(ask)
    .then(getTemplateQuestions)
    .then(renderTemplates);

}

init();
