const {
  readFileSync,
  existsSync,
  statSync,
  readdirSync,
  mkdirSync,
  writeFileSync,
} = require('fs')

const {
  join,
  extname
} = require('path')

const currentDirectory = process.cwd()
const contractsPath = join(currentDirectory, 'contracts')
const buildPath = join(currentDirectory, 'build')
const buildContractsPath = join(buildPath, 'contracts')
const migrationsPath = join(currentDirectory, 'migrations')
const testsPath = join(currentDirectory, 'test')
const templatesPath = join(__dirname, '../../template')

const getAllFilesAsync = dir => (
  readdirSync(dir).reduce((files, file) => {
    const name = join(dir, file)
    const isDirectory = statSync(name).isDirectory()
    return isDirectory ? [...files, ...getAllFilesAsync(name)] : [...files, name]
  }, [])
)

const readContractsDirSync = () => (
  getAllFilesAsync(contractsPath)
    .map(solidityFile => solidityFile)
)

const readMigragtionsDirSync = () => (
  readdirSync(migrationsPath)
    .map(migrationFile => join(migrationsPath, migrationFile))
)

const readTestsDirSync = () => {
  const exts = ['.js']
  return readdirSync(testsPath)
    .filter(testFile => exts.indexOf(extname(testFile)) !== -1)
    .map(testFile => join(testsPath, testFile))
}

const createBuildStructure = () => {
  if (!existsSync(buildPath)) {
    mkdirSync(buildPath)
  }

  if (!existsSync(buildContractsPath)) {
    mkdirSync(buildContractsPath)
  }
}

module.exports = {
  currentDirectory,

  contractsPath,
  buildPath,
  buildContractsPath,
  migrationsPath,
  testsPath,
  templatesPath,

  getAllFilesAsync,
  readContractsDirSync,
  readMigragtionsDirSync,
  readTestsDirSync,
  createBuildStructure,

  existsSync,
  readFileSync,
  writeFileSync
}
