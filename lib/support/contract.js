const fs   = require('fs')
const Path = require('./path')
const Util = require('./util')

const scanContractsDirectory = () =>
  Util.getAllFilesAsync(Path.contractsPath)
    .filter(Path.isSolidityFile)

const readContractFile = (solidityFile) =>
  fs.readFileSync(solidityFile, 'utf-8')

module.exports = {
  scanContractsDirectory,
  readContractFile
}
