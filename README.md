Sprout
======

[NOTE] This project has not been published yet! It's almost done!

# The in-project code generator

Ask 10 different developers how they'd structure their code, and they'll give you 10 different answers. This completely agnostic code generation tool allows you to fully customize your own templates, what goes into them, and where the output gets sent.

## Purpose

Boilerplating and templating is great, but sometimes, you just want a little piece boilerplated and scaffolded, not an entire project. Sprout was made to be an in-project code generator that's agnostic to whatever or however your team likes to generate code.

### Features

* Completely project agnostic. Write templates that generate files do **your preferences** no matter what they are.
* Easy to use EJS syntax for naming files and generating customized templates
* Can include templates inside source control so your templates can be used and edited by colleagues and coworkers.


## Prerequisites

1. Node v6+
2. Any project with a `package.json` file ready ala `npm`
## Installation

Install the package in your project with `npm`:

```sh
npm install sproutjs --save-dev

```

Or use `yarn`:

```sh
yarn add sproutjs --save-dev
```

Add the `sprout` run command to your `package.json`:

```json
{
    "scripts": {
        "sprout": "sprout"
    }
}
```

Alternatively, you can use `npx sprout`. If you're on Node v8+

Run `sprout init` and answer some simple questions to get started.
If this is your first time using `sprout`, we recommend including the example generator to use as an example to see all the moving parts.

## Usage

If you said "yes" to including the example generator, type `npm run sprout` and you should see the generator ask you which template you'd like to render. Press enter, and answer the next questions.

You'll see the generated code get written to `./sprout_generated_examples`. We can modify where the code gets placed easily with some fairly straightforward configuration options.

### Global configuration:

`sprout.config.js` should be in your root directory, and exports a `function` that returns a configuration object:

```js
{
    // This is the relative path to where all your sprout templates live.
    templateDir: './sprout'
}
```

Every `directory` inside of the `./sprout` folder is its own template/generator, and each of those has its own individual configuration as well.

### Creating a new Template/Generator

After you've run `sprout init`, navigate to the `/sprout` folder, and create a new directory. Inside your new directory, create a new file called `template.config.js`

```
-<RootDir>
|
--sprout
---/<your_template_directory_name_here>
----template.config.js
```

#### Configuring your new Template/Generator

`template.config.js` supports a few options:

```js
{
    // Display name of the template inside the CLI
    templateName: String,

    // relative path of where to output the files
    outputDirectory: String,

    // async function to run before starting the generator
    onStart?: AsyncFunction,

    // an array of questions to ask the user (more on this later)
    questions: Array<Question>,

    // async function to run after questions have been asked, but before creating the templates
    onCreate?: AsyncFunction
}
```

#### The Questions Array

When you create a template, you must provide at least one question to the user regarding naming and what EJS variables to use when generating your templates.

Under the hood, sproutjs uses [Inquirer.js's Question model](https://github.com/SBoudrias/Inquirer.js/#question).

Here's the most common options used within sprout. If you want more control, [view the Question model/object here](https://github.com/SBoudrias/Inquirer.js/#question)

```js
{
    // Variable name to use inside EJS
    name: String,

    // Message to send to the user asking what the value should be
    message: String,

    // Type of response
    // input - user types in response
    // list - user chooses from a list. Requires the 'choices' option to be an Array or Function
    type: 'input' | 'list' | ('many others')

    // Function that returns 'true' if the users input was valid, or 'false' if invalid.
    validate?: Function,

    // An Array or Function use when type: 'list'
    // values can be strings or objects containing 'name' and 'value' props.
    choices?: Array<Object|String> | Function => (Object | String)
}
```

## Developing

Want to help out? Awesome! there's a handful of developer friendly build tools to help you get started quick.

1. Fork the repository
2. Install dependencies with `npm install` or `yarn`
3. Run `npm run dev` or `yarn dev` to get started!

If you need the example template to play with, run `yarn build` while `dev` isn't running. This will give you a totally clean install with example template to play with.

The `build` command creates a production ready build.

The `dev` command transpiles your code to ES5 to make use of all the `import` and `ES2015+` goodies that come with that full ecosystem. It also watches the files in `src` and re-transpiles whenever it sees you've changed a file.

4. Grab an issue or build a new awesome feature for sprout.

5. Make a pull request! I will get to it when I can and give you proper contribution and credit.


I hope you enjoy using this tool as much as I had fun creating it :)

Made with <3 by [@MrBenJ](https://www.github.com/MrBenJ)
