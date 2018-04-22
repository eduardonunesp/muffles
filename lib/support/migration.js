const fs   = require('fs')
const Path = require('./path')
const Util = require('./util')

const scanMigrationsDirectory = () =>
  Util.getAllFilesAsync(Path.migrationsPath)
    .filter(Path.isJavaScriptFile)

module.exports = {
  scanMigrationsDirectory
}
