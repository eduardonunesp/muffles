const Mocha = require('mocha')
const chai  = require('chai')
const fs    = require('fs')
const Path  = require('./path')
const Util  = require('./util')

const scanTestsDirectory = () =>
  Util.getAllFilesAsync(Path.testsPath)
    .filter(Path.isJavaScriptFile)

const createMocha = (testFiles, config, accounts, deployer) => {
  const mocha = new Mocha(config.mocha || {})

  testFiles.forEach(testFile => (
    mocha.addFile(testFile)
  ))

  global.accounts = accounts
  global.assert = chai.assert
  global.expect = chai.expect
  global.deployer = deployer

  return mocha
}

const runMocha = async (mocha) => await mocha.run()

module.exports = {
  scanTestsDirectory,
  createMocha,
  runMocha
}
