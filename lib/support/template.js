const _        = require('lodash')
const fs       = require('fs')
const ncp      = require('ncp')
const { join } = require('path')
const Path     = require('./path')

ncp.limit = 4

const veryImportantFilesAndDirs = [
  'contracts',
  'contracts/Migrations.sol',
  'test',
  'test/.placeholder',
  'migrations',
  'migrations/1_deploy_migrations.js',
  'muffles.js',
  'muffles-config.js'
]

const _scanTemplateDirectory = () =>
  fs.readdirSync(Path.templatesPath)
    .map(template => template)

const _checkVeryImportantFilesExists = () =>
  veryImportantFilesAndDirs.some(fs.existsSync)

const _copyFilesToDest = (source, dest) => {
  return new Promise((resolve, reject) => {
    ncp(source, dest, (err) => {
      if (err) return reject(err)
      resolve(true)
    })
  })
}

const copyFromTemplate = async (templateName, dest, force) => {
  const templatesAvailable = _scanTemplateDirectory()

  if (!_.includes(templatesAvailable, templateName))
    throw Error(`Template name ${templateName} isn't available`)

  if (_checkVeryImportantFilesExists(fs.currentDirectory) && !force)
    throw Error("Can't overwrite existing files, sorry")

  const templatePath = join(Path.templatesPath, templateName)

  await _copyFilesToDest(templatePath, dest)
}

module.exports = {
  copyFromTemplate
}
