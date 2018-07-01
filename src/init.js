#!/usr/bin/env node
// @flow
import Chalk from 'chalk';
import Inquirer from 'inquirer';
import Ejs from 'ejs';
import fs from 'fs'; // @TODO: Refactor to use only fs
import fse from 'fs-extra';
import path from 'path';

const DEFAULT_TEMPLATE_FOLDER_NAME = 'sprout';

type SproutInitAnswers = {
  sproutDirectory: string,
  createExample: bool
};

async function ask(): Promise<Inquirer.prompt> {
  try {
    console.log(Chalk.bold.white`Please make sure you are in the root directory of your project before starting!`);
    return await Inquirer.prompt([
      {
        name: 'sproutDirectory',
        type: 'input',
        message: 'What would you like your template folder to be named?: ',
        default: DEFAULT_TEMPLATE_FOLDER_NAME
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
      sproutDirectory,
      createExample
    } = answers;
    // @TODO: Refactor to use only fs
    fs.mkdirSync(path.resolve(process.cwd(), sproutDirectory));

    Ejs.renderFile(
      path.resolve(__dirname, 'sprout.config.ejs'),
      { sproutDirectory: `./${sproutDirectory}` },
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
      fs.mkdirSync(path.resolve(process.cwd(), 'sprout_generated_examples'));
      fse.copy(
        path.resolve(__dirname, 'example'),
        path.resolve(process.cwd(), `./${sproutDirectory}`, 'ExampleTemplateReact'),
        err => {
          if (err) {
            throw err;
          }
        }
      );

    } else {
      process.exit(0);
    }

  });

}

init();
