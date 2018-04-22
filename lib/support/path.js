const {
  join,
  extname,
  basename
} = require('path')

const currentDirectory   = process.cwd()

const contractsPath      = join(currentDirectory, 'contracts')
const buildPath          = join(currentDirectory, 'build')
const artifactsPath      = join(buildPath, 'artifacts')
const migrationsPath     = join(currentDirectory, 'migrations')
const testsPath          = join(currentDirectory, 'test')
const templatesPath      = join(__dirname, '../../templates')

const isSolidityFile = (filePath) =>
  extname(filePath) === '.sol'

const isJavaScriptFile = (filePath) =>
  extname(filePath) === '.js'

const fileBasename = (filePath) =>
  basename(filePath)

module.exports = {
  currentDirectory,

  contractsPath,
  buildPath,
  artifactsPath,
  migrationsPath,
  testsPath,
  templatesPath,

  isSolidityFile,
  isJavaScriptFile,
  fileBasename
}
