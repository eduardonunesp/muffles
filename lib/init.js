const Path     = require('./support/path')
const Template = require('./support/template')

const action = async (args, options) => {
  console.log('🤓  Creating basic structure'.green)

  if (options.force) {
    console.log('💪  Ok, using the mighty muscles'.yellow)
  }

  const templateName = options.template || 'basic'

  try {
    await Template.copyFromTemplate(templateName, Path.currentDirectory, options.force)
  } catch(err) {
    console.log(`💩  Can't create structure due an error: ${err.message}`.red)
    process.exit(1)
  }

  console.log('🙌  Structure created with success'.green, options.force ? 'and muscles'.yellow : '')
}

module.exports = program =>
  program
    .command('init', 'Initialize the project basic template')
    .option('--force', 'Create the template and overwrite existing files')
    .option('--template', 'Choose the template to be used')
    .action(action)
