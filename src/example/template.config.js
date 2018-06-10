module.exports = {
  templateName: 'Example React Component',
  outputDirectory: "./sprout_generated_examples",
  onStart: async () => {
    console.log("Hi! I'm an example template generator");
    console.log("In this example, I'm going to create a simple React component for you");
  },
  questions: [
    {
      name: 'ComponentName',
      message: "What's the name of your component? (Must start with capital letter, no spaces): ",
      type: 'input',
      validate: value => (value[0].toUpperCase() === value[0] && !value.includes(' ')),
    }
  ],
  onCreate: async answers => {
    console.log('Great! I will create your template using these params:');
    console.log(answers);
  }
}
