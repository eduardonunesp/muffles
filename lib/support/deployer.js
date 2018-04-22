const linker   = require('solc/linker')
const _        = require('lodash')
const Artifact = require('./artifact')

let _config
let _network
let _accounts
let _web3

const _updateArtifact = (artifactName, address) => {
  const artifact = Artifact.requireArtifact(artifactName)
  const networkDetails = _.update(artifact.networks, _network, network => _.merge(network, { address }))
  const newArtifact = _.merge(artifact, { networks: networkDetails })
  Artifact.writeArtifact(newArtifact)
}

const deploy = async (artifactName) => {
  const artifact = Artifact.requireArtifact(artifactName)

  const gas = _config.gas || '1000000'

  console.log('🚢  Shipping contract'.green, artifactName)
  console.log('🤔  Attempting to deploy from account'.green, _accounts[0])
  console.log('⛽  Gas configured to deploy'.green, gas)

  const contractResult = await new _web3.eth.Contract(JSON.parse(artifact.interface))
    .deploy({ data: artifact.bytecode })
    .send({ gas, from: _accounts[0] })

  const address = contractResult.options.address

  console.log('🚀  Contract deployed to'.green, address)

  _updateArtifact(artifactName, address)

  return contractResult
}

const testDeploy = async (artifactName, config = {}) => {
  const artifact = Artifact.requireArtifact(artifactName)
  const testConfig = _.merge(_config, config)

  const gas = testConfig.gas || '1000000'

  return await new _web3.eth.Contract(JSON.parse(artifact.interface))
    .deploy({ data: artifact.bytecode })
    .send({ gas, from: _accounts[0] })
}

const link = (artifactName, libraryArtifactName) => {
  if (artifactName === libraryArtifactName)
    throw Error(`Artifact name for contract and library can't be the same`)

  const artifact = Artifact.requireArtifact(artifactName)
  const libraryArtifact = Artifact.requireArtifact(libraryArtifactName)

  const libraryAndAddress = {
    [`${libraryArtifactName}.sol:${libraryArtifactName}`]: libraryArtifact.networks[_network].address
  }

  const bytecode = linker.linkBytecode(artifact.bytecode, libraryAndAddress)
  const newArtifact = _.merge(artifact, { bytecode })

  Artifact.writeArtifact(newArtifact)
}

module.exports = (config, network, accounts, web3) => {
  _config = config
  _accounts = accounts
  _network = network
  _web3 = web3

  return {
    deploy,
    testDeploy,
    link
  }
}
