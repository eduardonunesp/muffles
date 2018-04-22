const {
  readdirSync,
  statSync
} = require('fs')

const {
  join
} = require('path')

const _ = require('lodash')

const compose = (...fns) =>
  fns.reduce((prevFn, nextFn) =>
    value => nextFn(prevFn(value)),
    value => value
  );

const debugCompose = compose(
  (v) => _.omit(v, 'web3'), // To avoid circular ref error
  (v) => JSON.stringify(v, null, 2),
  console.log
)

const flatten = (array) => {
  const flat = [].concat(...array);
  return flat.some(Array.isArray) ? flatten(flat) : flat;
}

const getAllFilesAsync = dir => (
  readdirSync(dir).reduce((files, file) => {
    const name = join(dir, file)
    const isDirectory = statSync(name).isDirectory()
    return isDirectory ? [...files, ...getAllFilesAsync(name)] : [...files, name]
  }, [])
)

module.exports = {
  compose,
  debugCompose,
  flatten,
  getAllFilesAsync
}
