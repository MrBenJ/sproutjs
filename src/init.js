#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ejs = require('ejs');


async function ask() {
  try {
    return await inquirer.prompt([
      {
        name: 'projectRootDirectory',
        message: 'Enter the root directory of your project: ',
        default: path.resolve(process.cwd())
      },
      {
        name: 'sproutDirectory',
        message: 'Template folder name?',
        default: 'sprout'
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

    fs.mkdirSync(path.resolve(projectRootDirectory, sproutDirectory));

    ejs.renderFile(
      path.resolve(__dirname, 'sprout.config.ejs'),
      { sproutDirectory: path.resolve(__dirname, sproutDirectory) },
      {},
      ( error, file ) => {
        if (error) { throw error; }
        console.log(file);
        try {
          fs.writeFileSync(
            path.resolve(process.cwd(), 'sprout.config.js'),
            file
          );

        } catch(e) {

        }

      }
    );
    console.log( 'finish!');
    return 0;


  });

}

init();