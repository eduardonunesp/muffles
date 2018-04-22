const _       = require('lodash')
const Web3    = require('web3')
const Config  = require('./config')
const Util    = require('./util')

const _setConfig = (dataObject) => {
  const config = Config.requireConfiguration()
  return merge(dataObject, { config })
}

const _setSelectedNetwork = (dataObject) => {
  const selectedNetwork = Config.getNetworkByName(dataObject.config, dataObject.network)
  return merge(dataObject, { selectedNetwork })
}

const _setWeb3 = (dataObject) => {
  const { selectedNetwork } = dataObject
  const web3 = new Web3(new Web3.providers.HttpProvider(`http://${selectedNetwork.host}:${selectedNetwork.port}`))
  return merge(dataObject, { web3 })
}

const _getAccounts = async (dataObject) => {
  const accounts = await dataObject.web3.eth.getAccounts()
  return merge(dataObject, { accounts })
}

const merge = (dataObject, newData) =>
  _.merge(dataObject, newData)

const newDataObject = (initialObject = {}) => {
  const configOnly = _.get(initialObject, 'configOnly')
  if (configOnly) return _setConfig(initialObject)

  return Util.compose(
    _setConfig,
    _setSelectedNetwork,
    _setWeb3,
    _getAccounts
  )(initialObject)
}

module.exports = {
  newDataObject,
  merge
}
