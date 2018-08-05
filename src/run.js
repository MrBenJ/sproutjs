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

/**
 * Renders a single file
 * @param  {String} options.templatePath - Absolute path to the EJS Template
 * @param  {String} options.filename     - Absolute path to the file to create
 * @param  {String} options.variables    - Variables to render via EJS
 * @return {undefined}
 */
async function renderFile({ templatePath, filename , variables }): Promise<void> {
  try {
    console.log(Chalk.yellow`WRITE: `, filename);
    Ejs.renderFile(templatePath, variables, (error, file) => {
      fse.writeFileSync(filename, file);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Creates a directory, and then renders all files in a template directory.
 * @param  {String} options.templatePath - Absolute path to the EJS template
 * @param  {String} options.directory    - Absolute path to the new directory to be created
 * @param  {String} options.variables    - Variables to render with
 * @return {Promise<undefined>}
 */
async function renderDirectory({ templatePath, directory, variables }): Promise<void> {
  try {

    console.log(Chalk.yellow`MKDIR`, directory);
    fse.mkdirSync(directory);

    const dir = fse.readdirSync(templatePath);
    dir.forEach( async file => {
      const fileStats = fse.statSync(path.resolve(templatePath, file));

      if (fileStats.isDirectory()) {

        //@TODO: Replace by filename logic here
        await renderDirectory({
          templatePath: path.resolve(templatePath, file),
          directory: path.resolve(directory, file),
          variables
        });
      } else if (fileStats.isFile()) {
        await renderFile({
          templatePath: path.resolve(templatePath, file),
          filename: path.resolve(directory, file),
          variables
        })
      }

    });

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function renderTemplates({template, templateFolderPath, outputDirectory, variables, onCreate, onEnd }) {
  try {
    if (onCreate) {
      await onCreate(variables);
    }
    const output = path.resolve(process.cwd(), outputDirectory);
    const dir = await fse.readdirSync(path.resolve(templateFolderPath));

    dir.forEach( async file => {
      try {
        const EXCLUDED_FILES = ['template.config.js'];

        if (!EXCLUDED_FILES.includes(file)) {

          // @TODO: If file === variable.someVariablenName --- Make the filename the entered variable name
          const template = path.resolve(templateFolderPath, file);
          const outputPath = path.resolve(output, file);

          console.log(Chalk.yellow`TEMPLATE: `, template);
          console.log(Chalk.yellow`RENDER TO: `, outputPath);

          const templateStats = fse.statSync(
            path.resolve(templateFolderPath, file)
          );

          // check if the template is a directory
          if (templateStats.isDirectory()) {
            const newDir = outputDirectory + `/${file}`;
            // Enter the directory and recursively build out each file
            await renderDirectory({ templatePath: template, directory: outputPath, variables });

          } else if (templateStats.isFile()) {
            await renderFile(outputDirectory, file, variables);
          }
        }
      } catch (error) {
        console.error(error);
      }

    });

  if (onEnd) {
    await onEnd();
  }

  process.exit(0);
  } catch (error) {
    console.error(error);
    throw error;
  }

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
