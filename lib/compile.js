const { join }    = require('path')
const colors      = require('colors')
const solc        = require('solc')
const fs          = require('./support/fs')
const config      = require('./support/config')
const { compose } = require('./support/utils')

const isWarning = (message) => /^(.*:[0-9]*:[0-9]* )?Warning: /.test(message)

const loadSolidityFiles = (dataObject) => {
  const solidityFiles = fs.readContractsDirSync()
    .reduce((acc, source) => {
      acc[fs.basename(source)] = fs.readFileSync(source, 'utf-8')
      return acc
    }, {})

  return Object.assign(dataObject, { solidityFiles })
}

const compileSolidityFiles = (dataObject) => {
  const sources = dataObject.solidityFiles
  const compiledContracts = solc.compile({ sources }, 1)

  if (compiledContracts.errors) {
    let abort = false

    compiledContracts.errors.forEach(message => {
      const warning = isWarning(message)
      if (!warning) abort = true
      color = warning ? colors.yellow : colors.red
      console.log(`\n${warning ? '🧐' : '💩'}  ${color(message)}`)
    })

    if (abort) process.exit()
  }

  return Object.assign(dataObject, { compiledContracts: compiledContracts.contracts })
}

const createBuildFiles = (dataObject) => {
  const buildFiles = Object.keys(dataObject.compiledContracts)
    .reduce((acc, name) => {
      const compiledContact = Object.assign(dataObject.compiledContracts[name], {
        networks: dataObject.config.networks,
        name
      })

      acc.push(compiledContact)
      return acc
    }, [])

  return Object.assign(dataObject, { buildFiles })
}

const writeBuildFiles = (dataObject) => (
  dataObject.buildFiles.forEach(file => {
    const name = file.name.split(':')[1]
    const filePath = join(fs.buildContractsPath, `${name}.json`)
    fs.writeFileSync(filePath, new Buffer(JSON.stringify(file, null, 2), 'utf-8'))
  })
)

const action = () => {
  // create build structure if it not exists
  fs.createBuildStructure()

  console.log('🧐  Compiling contracts'.green)

  const dataObject = {
    config: config.requireConfiguration()
  }

  // run the pipes
  compose(
    loadSolidityFiles,
    compileSolidityFiles,
    createBuildFiles,
    writeBuildFiles
  )(dataObject)

  console.log('📦  Contracts compiled'.green)
}

module.exports = program => {
  program
    .command('compile', 'Compile files located on contracts directory')
    .action(action)
}

