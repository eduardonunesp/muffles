const compose = (...fns) =>
  fns.reduce((prevFn, nextFn) =>
    value => nextFn(prevFn(value)),
    value => value
  );

const debugCompose = compose((v) => JSON.stringify(v, null, 2), console.log)

module.exports = {
  compose,
  debugCompose
}
