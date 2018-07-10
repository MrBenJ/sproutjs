#!/usr/bin/env node
// @flow
import Chalk from 'chalk';
import Inquirer from 'inquirer';
import Ejs from 'ejs';
import path from 'path';
import fs from 'fs'; // @TODO: Remove this module and use fse instead
import fse from 'fs-extra';

type SproutConfigDescriptor = {
  templateDir: string
};
/** Sprout Root configuration file */
type SproutRootConfig = () => SproutConfigDescriptor;

type Template = {
  name: string,
  value: string
};

const config: SproutRootConfig = require(path.resolve(process.cwd(), './sprout.config.js'));

/**
 * Gets the list of all the templates
 *
 * @return {Promise<Array<{}>>} - Array of template objects
 */
async function getTemplates(): Promise<Template[]> {

  const { templateDir } = config();

  const folderPath = path.resolve(process.cwd(), templateDir);
  const templates = fs.readdirSync(folderPath);

  // Gather up all of our templates.
  if (!templates.length) {
    console.error(Chalk.bgRed`ERROR:`, Chalk.cyan`No templates found`);
    console.error(Chalk.bold.white(`Create some template directories in ${templateDir} to get started`));
    process.exit(0);
  }
  const templateList = templates.map( template => {
    const templateConfig = require(
      path.resolve(process.cwd(), templateDir, template, 'template.config.js')
    );

    if (!templateConfig) {
      console.log(Chalk.bgRed`[WARNING] - No 'template.config.js' file found in template folder ${template}`);
      return;
    }
    return { name: templateConfig.templateName, value: template };

  });

  // Only return truthy values
  return templateList.filter(Boolean);

}

/**
 * Asks the user which template they would like to generate
 *
 * @ param {Array} list - The named list of all the templates to choose from
 * @return {Promise}
 */
async function ask(list) {
  const { templateChoice } = await Inquirer.prompt([
    {
      type: 'list',
      name: 'templateChoice',
      message: 'Pick a template to generate: ',
      choices: list
    }
  ]);
  return templateChoice;

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
  const templateFolderPath = path.resolve(process.cwd(), templateDir, template);
  const {
    onStart,
    questions,
    onCreate,
    outputDirectory,
    onEnd } = templateConfig;

  if (onStart) {
    await onStart();
  }

  const variables = await Inquirer.prompt(templateConfig.questions);

  return {
    template,
    templateFolderPath,
    variables,
    outputDirectory,
    onCreate,
    onEnd
  };

}

async function renderDirectory(outputDirectory, filename, variables) {

}

async function renderTemplates({template, templateFolderPath, outputDirectory, variables, onCreate, onEnd }) {
  if (onCreate) {
    await onCreate(variables);
  }
  const output = path.resolve(process.cwd(), outputDirectory);
  const dir = await fse.readdirSync(path.resolve(templateFolderPath));
  dir.forEach( item => {
    const EXCLUDED_FILES = ['template.config.js'];

    if (!EXCLUDED_FILES.includes(item)) {
      // check if the file is a directory
      if (fse.stats.isDirectory(item)) {
        // Enter the directory and recursively build out each file
        await renderDirectory(outputDirectory, item, variables);

      } else if (fse.stats.isFile(item)) {

      }
    }
  });

  // @TODO: START HERE!!

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
