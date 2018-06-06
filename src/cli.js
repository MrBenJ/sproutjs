#!/usr/bin/env node
const ChildProcess = require('child_process');
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const inquirer = require('inquirer');

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
  if (exitStatus !== 0) {
    console.log(chalk.cyan`Exit status ${exitStatus}`);
    return;
  }

  console.log(chalk.cyan`Sprout initialized!`);
}
function init() {
  console.log(__dirname);
  if (argv._[0] === 'init') {
    console.log(chalk.cyan`Run initialization Script`);

    if (fs.exists(path.resolve(process.cwd(), 'sprout.config.js'))) {
      console.log(chalk.yellow`Sprout is already initialized in the current directory`);
      return 1;
    }
    sproutInit(onCompleteInit);
  }
}

init();
