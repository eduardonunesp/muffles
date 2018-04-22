const DataObject = require('./support/data_object')
const Migration  = require('./support/migration')
const Util       = require('./support/util')
const Deployer   = require('./support/deployer')

const loadMigrationFiles = (dataObject) => {
  const migrationFiles = Migration.scanMigrationsDirectory()
    .map(file => require(file))
  return DataObject.merge(dataObject, { migrationFiles })
}

const runMigrations = ({migrationFiles, config, network, accounts, web3}) =>
  migrationFiles
    .forEach(async migrationFile => {
      const deployer = Deployer(config, network, accounts, web3)
      migrationFile(deployer, network, accounts, web3)
    })

const action = async (args, options) => {
  console.log('🧐  Migrating / Deploying contracts'.green)

  const network = options.network || 'development'

  try {
    const dataObject = await DataObject.newDataObject({ network })

    Util.compose(
      loadMigrationFiles,
      runMigrations
    )(dataObject)
  } catch (err) {
    console.log(`💩  Can't migrate due an error: ${err.message}`.red)
    process.exit(1)
  }
}

module.exports = program =>
  program
    .command('migrate', 'Deploy contracts to Ethereum blockchain network')
    .option('--network', 'Choose a network to migrate / deploy')
    .action(action)
