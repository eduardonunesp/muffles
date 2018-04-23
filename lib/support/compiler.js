const colors   = require('colors')
const solc     = require('solc')
const Path     = require('./path')
const Contract = require('./contract')

const _isWarning = (message) => /^(.*:[0-9]*:[0-9]* )?Warning: /.test(message)

const _formatToCompiler = (solidityFiles) =>
  solidityFiles
    .reduce((acc, source) => {
      const solidityFile = Path.fileBasename(source)
      acc[solidityFile] = Contract.readContractFile(source)
      return acc
    }, {})

const compile = (solidityFiles) => {
  const sources = _formatToCompiler(solidityFiles)
  const compiledContracts = solc.compile({ sources }, 1)

  if (compiledContracts.errors) {
    let abort = false

    compiledContracts.errors.forEach(message => {
      const warning = _isWarning(message)
      if (!warning) abort = true
      color = warning ? colors.yellow : colors.red
      console.log(`\n${warning ? '🧐' : '💩'}  ${color(message)}`)
    })

    if (abort) process.exit(-1)
  }

  return compiledContracts
}

module.exports = {
  compile
}
