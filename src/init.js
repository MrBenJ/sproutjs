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
        message: 'Enter the root directory of your project: ',
        default: path.resolve(process.cwd())
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
      sproutDirectory
    } = answers;

    fs.mkdirSync(path.resolve(projectRootDirectory, DEFAULT_TEMPLATE_FOLDER_NAME));

    ejs.renderFile(
      path.resolve(__dirname, 'sprout.config.ejs'),
      { sproutDirectory: path.resolve(__dirname, DEFAULT_TEMPLATE_FOLDER_NAME) },
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
    return 0;
  });

}

init();