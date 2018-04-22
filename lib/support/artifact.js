const _        = require('lodash')
const fs       = require('fs')
const { join } = require('path')
const Path     = require('./path')
const Util     = require('./util')

const createArtifactsStructure = () => {
  if (!fs.existsSync(Path.buildPath))
    fs.mkdirSync(Path.buildPath)

  if (!fs.existsSync(Path.artifactsPath))
    fs.mkdirSync(Path.artifactsPath)
}

const createArtifact = (compiledContracts, networks) => {
  return _.keys(compiledContracts)
    .reduce((acc, name) => {
      const compiledContact = _.merge(compiledContracts[name], {
        networks,
        name
      })

      acc.push(compiledContact)
      return acc
    }, [])
}

const _artifactPath = (artifactName) =>
  join(Path.artifactsPath, `${artifactName}.json`)

const writeArtifact = (artifactFile) => {
  const artifactName = artifactFile.name.split(':')[1]
  const filePath = _artifactPath(artifactName)
  fs.writeFileSync(filePath, new Buffer(JSON.stringify(artifactFile, null, 2), 'utf-8'))
}

const requireArtifact = (artifactName) => {
  const filePath = join(Path.artifactsPath, `${artifactName}.json`)

  if (!fs.existsSync(filePath))
    throw Error(`Artifact with name ${artifactName} not found in artifacts`)

  return Util.compose(
    fs.readFileSync,
    JSON.parse
  )(filePath)
}

module.exports = {
  createArtifactsStructure,
  createArtifact,
  writeArtifact,
  requireArtifact
}
