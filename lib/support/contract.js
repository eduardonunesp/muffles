const fs   = require('fs')
const Path = require('./path')
const Util = require('./util')

const scanContractsDirectory = (config) => {
  const files = [Path.contractsPath].concat(config.includePaths || [])
    .map(path => Util.getAllFilesAsync(path).filter(Path.isSolidityFile))

  return Util.flatten(files)
}

const readContractFile = (solidityFile) =>
  fs.readFileSync(solidityFile, 'utf-8')

module.exports = {
  scanContractsDirectory,
  readContractFile
}
