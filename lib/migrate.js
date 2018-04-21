const { join }    = require('path')
const Web3        = require('web3')
const linker      = require('solc/linker')
const { compose } = require('./support/utils')
const fs          = require('./support/fs')
const _config     = require('./support/config')

const loadMigrationsFiles = (dataObject) => {
  const migrationFiles = fs.readMigragtionsDirSync()
    .map(source => require(source))

  return Object.assign(dataObject, { migrationFiles })
}

const loadBuildFile = (migrationName) => {
  const fileName = join(fs.buildContractsPath, `${migrationName}.json`)
  if (!fs.existsSync(fileName)) {
    console.log(`😵  Build file not found, did you compiled`.red, fileName)
    return process.exit()
  }

  return require(fileName)
}

const updateBuildFiles = (dataObject) => {
  const { address, selectedNetwork } = dataObject
  const buildFile = loadBuildFile(dataObject.migrationName)
  const networkDetails = Object.assign(buildFile.networks, { [selectedNetwork]: { address, ...buildFile.networks[selectedNetwork] } })
  const newBuildFile = Object.assign(buildFile, { networks: networkDetails })

  const filePath = join(fs.buildContractsPath, `${dataObject.migrationName}.json`)

  fs.writeFileSync(filePath, new Buffer(JSON.stringify(newBuildFile, null, 2), 'utf-8'))
}

const linkLibraries = (dataObject, buildFile, libraries) => {
  if (libraries.length === 0) return buildFile
  return libraries.reduce((acc, library) => {
    const libraryBuildFile = loadBuildFile(library)
    const libraryBytecode = {[`${library}.sol:${library}`]: libraryBuildFile.networks[dataObject.selectedNetwork].address}
    acc.bytecode = linker.linkBytecode(acc.bytecode, libraryBytecode)
    return acc
  }, buildFile)
}

const deployer = (dataObject) => async (migrationName, libraries = []) => {
  const buildFile = compose(
    loadBuildFile,
    (buildFile) => linkLibraries(dataObject, buildFile, libraries)
  )(migrationName)

  const gas = dataObject.config.gas || '1000000'

  console.log('🚢  Shipping contract'.green, migrationName)
  console.log('🤔  Attempting to deploy from account'.green, dataObject.accounts[0])
  console.log('⛽  Gas configured to deploy'.green, gas)

  const contractResult = await new dataObject.web3.eth.Contract(JSON.parse(buildFile.interface))
    .deploy({ data: buildFile.bytecode })
    .send({ gas, from: dataObject.accounts[0] })

  const address = contractResult.options.address

  console.log('🚀  Contract deployed to'.green, address)

  updateBuildFiles(Object.assign(dataObject, { migrationName, address }))

  return contractResult
}

const runMigrations = (dataObject) => {
  dataObject.migrationFiles
    .map(async migrationFile => {
      await migrationFile(deployer(dataObject), dataObject.network, dataObject.accounts, dataObject.web3)
  })
}

const action = async (args, options) => {
  const config = _config.requireConfiguration()
  const selectedNetwork = 'development'
  const network = config.networks[selectedNetwork]
  const web3 = new Web3(new Web3.providers.HttpProvider(`http://${network.host}:${network.port}`))
  const accounts = await web3.eth.getAccounts()

  const dataObject = {
    config,
    selectedNetwork,
    network,
    web3,
    accounts
  }

  compose(
    loadMigrationsFiles,
    runMigrations
  )(dataObject)
}

module.exports = program => {
  program
    .command('migrate', 'Deploy contracts to Ethereum blockchain network')
    .action(action)
}

