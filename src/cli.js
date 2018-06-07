#!/usr/bin/env node
const ChildProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const inquirer = require('inquirer');

function runTask(script, callback) {
  let invoked = false;

  const job = ChildProcess.fork(path.resolve(__dirname, `${script}.js`));

  job.on('error', error => {
    if (invoked) { return; }
    invoked = true;
    callback(error);
  });

  job.on('exit', exitCode => {
    if (invoked) { return; }
    invoked = true;
    callback( exitCode
      ? new Error(chalk.red`[ERROR] Sprout script ${script} failed returning an exit code ${exitCode}`)
      : null
    );
  });
}

function sproutInit(callback) {
  let invoked = false;

  const job = ChildProcess.fork(path.resolve(__dirname, 'init.js'));

  job.on('error', error => {
    if (invoked) { return; }
    invoked = true;
    callback(error);
  });

  job.on('exit', exitCode => {
    if (invoked) { return; }
    invoked = true;
    callback( exitCode
      ? new Error(chalk.red`[ERROR] sprout init failed returning an exit code ${exitCode}`)
      : null
    );
  });
}

function onCompleteInit(exitStatus) {
  if (exitStatus) {
    console.log(chalk.cyan`[ERROR] - Sprout init exited with non-zero status code: ${exitStatus}`);
    return;
  }

  console.log(chalk.cyan`Sprout initialized!`);
  console.log(chalk.cyan`Run 'sprout' to get started!`);

}

function runSprout(callback) {
  const job = ChildProcess.fork(path.resolve(__dirname, 'run.js'));
  let invoked = false;

  job.on('error', error => {
    if (error) { throw error; }
    invoked = true;
    callback(error);
  });

  job.on('exit', exitCode => {
    if (error) { throw error; }
    invoked = true;
    callback(0);
  });
}

function onCompleteRun(exitStatus) {
  if (exitStatus) {
    throw new Error(chalk.red`Sprout 'run' exited with non-zero code ${exitStatus}`);
  }
  console.log(chalk.cyan`Thanks for using Sprout!`);
  console.log(chalk.cyan`Created with <3 from @MrBenJ on Github :D`);
}


function init() {

  const hasConfigFile = fs.existsSync(path.resolve(process.cwd(), 'sprout.config.js'));

  // Initialize Sprout (sprout init)
  if (argv._[0] === 'init') {
    console.log(chalk.cyan`Run initialization Script`);

    // If there's already a config file tell the user and exit
    if (hasConfigFile) {
      console.log(chalk.yellow`Sprout is already initialized in the current directory`);
      console.log(chalk.yellow`Run 'sprout' to generate some code`);
      return 1;
    }
    runTask('init', onCompleteInit);
    return;
    // sproutInit(onCompleteInit);
  }

  // Run Sprout (sprout)
  if (!hasConfigFile) {
    console.log(chalk.yellow`Sprout hasn't been initialized in this project yet`);
    console.log(chalk.yellow`Run 'sprout init' to initialize`);
    return 1;
  }

  console.log(chalk.cyan`Welcome to Sprout!`);
  runTask('run', onCompleteRun);
  // runSprout(onCompleteRun);



}

init();
