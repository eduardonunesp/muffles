const path = require('path')
const fs = require('fs')
const solc = require('solc')
const chalk = require('chalk')

// get the path for the contracts
const contractsPath = path
  .resolve('contracts')

const buildPath = path
  .resolve('build')

const buildContractsPath = path
  .join(buildPath, 'contracts')

const isWarning = (message) => /^(.*:[0-9]*:[0-9]* )?Warning: /.test(message)

if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath)
}

if (!fs.existsSync(buildContractsPath)) {
  fs.mkdirSync(buildContractsPath)
}

// source files prepared to be compiled
const sources = fs
  .readdirSync(contractsPath)
  .reduce((acc, source) => {
    acc[source] = fs.readFileSync(path.join(contractsPath, source), 'utf-8')
    return acc
  }, {})

// compile contract
const compileResults = solc.compile({ sources }, 1)

if (compileResults.errors) {
  let abort = false

  compileResults.errors.forEach(message => {
    const warning = isWarning(message)
    if (!warning) abort = true
    color = warning ? chalk.yellow : chalk.red
    console.log(color(message))
  })

  if (abort) return 1
}

// get the contracts compiled
const compiledContracts = compileResults.contracts

// create structure of the build files
const buildFiles = Object.keys(compiledContracts)
  .reduce((acc, i) => {
    acc.push(Object.assign(compiledContracts[i], {name: i}))
    return acc
  }, [])

// create files on build directory
buildFiles.forEach(file => {
  const name = file.name.split(':')[1]
  const filePath = path.join(buildContractsPath, `${name}.json`)
  fs.writeFileSync(filePath, new Buffer(JSON.stringify(file, null, 2), 'utf-8'))
})
