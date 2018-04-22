const _      = require('lodash')
const fs     = require('fs')
const {join} = require('path')

const _validateConfig = (config) => {
  if (!_.get(config, 'networks'))
    throw Error('Network configuration not found')

  return config
}

const currentDirectory = process.cwd()
const configFiles = ['muffles.js', 'muffles-config.js']
const configFilePaths = configFiles.map(configFile => join(currentDirectory, configFile))

const requireConfiguration = () => {
  if (configFilePaths.every(configFile => !fs.existsSync(configFile))) {
    throw Error(`${configFiles.join(' or ')} not found on project root`)
  }

  const configFile = configFilePaths.find(configFile => fs.existsSync(configFile))
  const config = require(configFile)

  return _validateConfig(config)
}

const getNetworkByName = (config, network) => {
  const networkConfig = _.get(config, `networks.${network}`)

  if (!networkConfig)
    throw Error(`Network with name ${network} does not exists`)

  ['host', 'port', 'network_id'].forEach(networkOption => {
    if (!_.get(networkConfig, networkOption))
      throw Error(`Property ${networkConfig} not found on network ${network}`)
  })

  return networkConfig
}

module.exports = {
  requireConfiguration,
  getNetworkByName
}
