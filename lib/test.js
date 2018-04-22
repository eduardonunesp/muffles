const Util       = require('./support/util')
const Test       = require('./support/test')
const Deployer   = require('./support/deployer')
const DataObject = require('./support/data_object')

const loadTestFiles = (dataObject) => {
  const testFiles = Test.scanTestsDirectory()
  return DataObject.merge(dataObject, { testFiles })
}

const setupMocha = (dataObject) => {
  const mocha = Test.createMocha(
    dataObject.testFiles,
    dataObject.config,
    dataObject.accounts,
    Deployer(
      dataObject.config,
      dataObject.network,
      dataObject.accounts,
      dataObject.web3
    ).testDeploy
  )

  return DataObject.merge(dataObject, { mocha })
}

const runMocha = (dataObject) =>
  Test.runMocha(dataObject.mocha)

const action = async (args, options) => {
  console.log('🤔  Testing')

  const network = options.network || 'development'

  try {
    const dataObject = await DataObject.newDataObject({ network })

    Util.compose(
      loadTestFiles,
      setupMocha,
      runMocha
    )(dataObject)
  } catch (err) {
    console.log(`💩  Can't run test due an error: ${err.message}`.red)
    process.exit(1)
  }
}

module.exports = program =>
  program
    .command('test', 'Run tests on contracts')
    .option('--network', 'Choose a network to test')
    .action(action)
