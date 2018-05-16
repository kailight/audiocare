/**
 * CONSTANTS
 */
const ROOT = global.ROOT = __dirname;

console.info(__dirname)

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


// Libs
let configLib   = require( `${ROOT}/lib/config` )
let utils    = require( `${ROOT}/lib/utils` )
let AudioCare    = global.AudioCare    = require( `${ROOT}/lib/AudioCare` );

let config = global.config = configLib.do()

message('Running the script...')
AudioCare.start()


process.on('exit', function (code) {
  warn('Process exit code '+code);
  // Add shutdown logic here.
});