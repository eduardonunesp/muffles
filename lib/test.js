require('colors')
const Mocha       = require('mocha')
const chai        = require('chai')
const { join }    = require('path')
const Web3        = require('web3')
const { compose, debugCompose } = require('./support/utils')
const fs          = require('./support/fs')
const _config     = require('./support/config')

const loadTestFiles = (dataObject) => {
  const testFiles = fs.readTestsDirSync()
  return Object.assign(dataObject, { testFiles })
}

const loadBuildFile = (migrationName) => {
  const fileName = join(fs.buildContractsPath, `${migrationName}.json`)
  if (!fs.existsSync(fileName)) {
    console.log(`😵  Build file not found, did you compiled`.red, fileName)
    return process.exit()
  }

  return require(fileName)
}

const deployer = (dataObject) => async (migrationName) => {
  const buildFile = loadBuildFile(migrationName)
  const gas = dataObject.config.gas || '1000000'

  const contractResult = await new dataObject.web3.eth.Contract(JSON.parse(buildFile.interface))
    .deploy({ data: buildFile.bytecode })
    .send({ gas, from: dataObject.accounts[0] })

  return contractResult
}

const createMocha = (dataObject) => {
  const mocha = new Mocha(dataObject.config.mocha || {})
  dataObject.testFiles.forEach(testFile => (
    mocha.addFile(testFile)
  ))

  global.accounts = dataObject.accounts
  global.assert = chai.assert
  global.expect = chai.expect
  global.deployer = deployer(dataObject)

  return Object.assign(dataObject, { mocha })
}

const runMocha = async (dataObject) => {
  const mochaResult = await dataObject.mocha.run()
  return Object.assign(dataObject, { mochaResult })
}

const action = async (args, options) => {
  const config = _config.requireConfiguration()
  const selectedNetwork = 'development'
  const network = config.networks[selectedNetwork]
  const web3 = new Web3(new Web3.providers.HttpProvider(`http://${network.host}:${network.port}`))
  const accounts = await web3.eth.getAccounts()

  console.log('🤔  Testing')

  const dataObject = {
    config,
    selectedNetwork,
    network,
    web3,
    accounts
  }

  compose(
    loadTestFiles,
    createMocha,
    runMocha
  )(dataObject)
}

module.exports = program => {
  program
    .command('test', 'Run tests on contracts')
    .action(action)
}
