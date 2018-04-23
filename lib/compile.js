const Compiler   = require('./support/compiler')
const Utils      = require('./support/util')
const Artifact   = require('./support/artifact')
const Contract   = require('./support/contract')
const DataObject = require('./support/data_object')

const loadSolidityFiles = (dataObject) => {
  const solidityFiles = Contract.scanContractsDirectory(dataObject.config)
  return DataObject.merge(dataObject, { solidityFiles })
}

const compileSolidityFiles = (dataObject) => {
  const compiledContracts = Compiler.compile(dataObject.solidityFiles)
  return DataObject.merge(dataObject, { compiledContracts: compiledContracts.contracts })
}

const createArtifacts = (dataObject) => {
  const artifactFiles = Artifact
    .createArtifact(dataObject.compiledContracts, dataObject.config.networks)
  return DataObject.merge(dataObject, { artifactFiles })
}

const writeArtifacts = (dataObject) =>
  dataObject.artifactFiles.forEach(Artifact.writeArtifact)

const action = async () => {
  console.log('🧐  Compiling contracts'.green)

  try {
    // create build structure if it not exists
    Artifact.createArtifactsStructure()

    const dataObject = await DataObject.newDataObject({ configOnly: true })

    Utils.compose(
      loadSolidityFiles,
      compileSolidityFiles,
      createArtifacts,
      writeArtifacts
    )(dataObject)
  } catch (err) {
    console.log(`💩  Can't compile due an error: ${err.message}`.red)
    process.exit(1)
  }

  console.log('📦  Contracts compiled'.green)
}

module.exports = program =>
  program
    .command('compile', 'Compile files located on contracts directory')
    .action(action)
