Sprout
======

# The in-project code generator

Ask 10 different developers how they'd structure their code, and they'll give you 10 different answers.

## Purpose

Boilerplating and templating is great, but sometimes, you just want a little piece boilerplated and scaffolded, not an entire project. Sprout was made to be an in-project code generator that's agnostic to whatever or however your team likes to generate code.

## Installation

TODO

Run `sprout init` and answer some simple questions to get started.
If this is your first time using `sprout`, we recommend including the example generator so you can see a full working generator by example that you can use to build out your own template generators.

## Usage

### Creating a new Template Generator

After you've run `sprout init`, navigate to the `/sprout` folder, and create a new directory. Inside your new directory, create a new file called `template.config.js`

```sh
-<RootDir>
|
--sprout
---/<your_template_directory_name_here>
----template.config.js
```

