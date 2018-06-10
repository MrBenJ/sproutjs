#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ejs = require('ejs');

const DEFAULT_TEMPLATE_FOLDER_NAME = 'sprout';

async function ask() {
  try {
    return await inquirer.prompt([
      {
        name: 'projectRootDirectory',
        type: 'input',
        message: 'Enter the root directory of your project: ',
        default: path.resolve(process.cwd())
      },
      {
        name: 'createExample',
        type: 'confirm',
        message: 'Would you like us to create an example template for you?',
      }
    ]);
  } catch(e) {
    console.error(e);
  }
}
function init() {
  console.log(chalk.cyan`Initializing Sprout...`);
  ask().then( answers => {
    const {
      projectRootDirectory,
      sproutDirectory = DEFAULT_TEMPLATE_FOLDER_NAME,
      createExample
    } = answers;

    fs.mkdirSync(path.resolve(projectRootDirectory, sproutDirectory));

    ejs.renderFile(
      path.resolve(__dirname, 'sprout.config.ejs'),
      { sproutDirectory: path.resolve(__dirname, sproutDirectory) },
      {},
      ( error, file ) => {
        if (error) { throw error; }
        try {
          fs.writeFileSync(
            path.resolve(process.cwd(), 'sprout.config.js'),
            file
          );

        } catch(e) {

        }

      }
    );

    if (createExample) {
      fs.mkdirSync(path.resolve(projectRootDirectory), 'sprout_generated_examples');

    }

    process.exit(0);
  });

}

init();