require('colors')
const fs   = require('fs')
const path = require('path')

const currentDirectory = process.cwd()
const configFiles = ['muffles.js', 'muffles-config.js']
const configFilePaths = configFiles.map(configFile => path.join(currentDirectory, configFile))

const requireConfiguration = () => {
  if (configFilePaths.every(configFile => !fs.existsSync(configFile))) {
    console.error(`${configFiles.join(' or ')} not found on project root`.red)
    process.exit()
  }

  const configFile = configFilePaths.find(configFile => fs.existsSync(configFile))
  return require(configFile)
}

module.exports = {
  requireConfiguration
}
