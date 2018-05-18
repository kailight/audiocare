/**
 * CONSTANTS
 */
const ROOT = global.ROOT = __dirname


// console.info(__dirname)

/**
 * Node modules
 */
let fs        = global.fs          = require('fs')
let path      = global.path        = require('path')
// let _         = global._           = require('lodash');
// let cheerio   = global.cheerio     = require('cheerio');
// var logger = require('morgan');
// var md5 = require('MD5');
// let http = require('http');
// let moment    = global.moment      = require('moment');
// let request   = global.request     = require('request');

/**
 * Third-party modules
 */
const clc   = require('cli-color')

// Libs
let configLib   = require( `${ROOT}/lib/config` )
let utils    = require( `${ROOT}/lib/utils` )
let ServerCare   = global.ServerCare   = require( `${ROOT}/lib/ServerCare` )
let AudioCare    = global.AudioCare    = require( `${ROOT}/lib/AudioCare` )


let mode = 'norm'

if (process.argv[2]) {
  if (process.argv[2] === 'configuration') {
    mode = 'configuration'
  } else {
    console.info('Flag '+process.argv[2]+' is not supported')
    process.exit(1)
  }
}

if (mode == 'norm') {
  let config = global.config = configLib.do()

  message('Starting ServerCare')
  ServerCare.start()

  message('Starting AudioCare')
  AudioCare.start()
} else if (mode === 'configuration') {
  message(clc.greenBright("Configuration started..."))
  let config = global.config = configLib.make()
  message(clc.greenBright("Configuration saved!"))
  process.exit()
}



process.on('SIGTERM', function onSigterm () {
  console.info('Got SIGTERM. Graceful shutdown start', new Date().toISOString())
  // start graceul shutdown here
  shutdown()
})

process.on('exit', function (code) {
  warn('Process exit code '+code)
  // AudioCare.end()
  // Add shutdown logic here.
})
