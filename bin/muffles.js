#!/usr/bin/env node

require('colors')
const program = require('caporal')
const muffles = require('./../package.json')

require('./../lib/init.js')(program)
require('./../lib/compile.js')(program)
require('./../lib/migrate.js')(program)
require('./../lib/test.js')(program)

program
  .version(muffles.version)
  .parse(process.argv)
