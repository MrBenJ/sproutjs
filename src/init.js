#!/usr/bin/env node
// @flow
import Chalk from 'chalk';
import Inquirer from 'inquirer';
import Ejs from 'ejs';
import fs from 'fs';
import path from 'path';



const DEFAULT_TEMPLATE_FOLDER_NAME = 'sprout';

async function ask(): Promise<any> {
  try {
    return await Inquirer.prompt([
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
  console.log(Chalk.cyan`Initializing Sprout...`);
  ask().then( answers => {
    const {
      projectRootDirectory,
      sproutDirectory = DEFAULT_TEMPLATE_FOLDER_NAME,
      createExample
    } = answers;

    fs.mkdirSync(path.resolve(projectRootDirectory, sproutDirectory));

    Ejs.renderFile(
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
          throw e;
        }

      }
    );

    if (createExample) {
      fs.mkdirSync(path.resolve(projectRootDirectory, 'sprout_generated_examples'));
    }

    process.exit(0);
  });

}

init();
