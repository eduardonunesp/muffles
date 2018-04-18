require('colors')
const fs   = require('./support/fs')
const path = require('path')
const ncp  = require('ncp')

ncp.limit = 4

const filesAndDirs = [
  'contracts',
  'contracts/Migrations.sol',
  'test',
  'test/.placeholder',
  'migrations',
  'migrations/1_deploy_migrations.js',
  'muffles.js',
  'muffles-config.js'
]

const checkFilesExists = (directory) => filesAndDirs.some(fs.existsSync)

const copyTemplateFiles = (fn) => (
  ncp(fs.templatesPath, fs.currentDirectory, (err) => {
    if (err) return console.error(`😱  ${err}`.red)

    filesAndDirs.forEach(file => {
      console.log(` - ${file}`)
    })

    fn()
  })
)

const action = (args, options) => {
  console.log('🤓  Creating basic structure'.green)

  if (options.force) {
    console.log('💪  Ok, using the mighty muscles'.yellow)
  }

  if (checkFilesExists(fs.currentDirectory) && !options.force) {
    console.error("😱  Can't overwrite existing files, sorry".red)
    process.exit()
  }

  copyTemplateFiles(() => {
    console.log('🙌  Structure created with success'.green, options.force ? 'and muscles'.yellow : '')
  })
}

module.exports = program => {
  program
    .command('init', 'Initialize the project basic template')
    .option('--force', 'Create the template and overwrite existing files')
    .action(action)
}
