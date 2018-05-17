/**
 * CONSTANTS
 */
const ROOT = global.ROOT = __dirname;


/**
 * Node modules
 */
let fs        = global.fs          = require('fs');
let path      = global.path        = require('path');
// let _         = global._           = require('lodash');
// let cheerio   = global.cheerio     = require('cheerio');
// var logger = require('morgan');
// var md5 = require('MD5');
// let http = require('http');
// let moment    = global.moment      = require('moment');
// let request   = global.request     = require('request');
let readLineSync = global.readLineSync = require('readline-sync');
const http = require('http')

let utils    = require( `${ROOT}/lib/utils` );
let config = global.config = {};

// Libs
// let quit     = global.quit     = Liker.quit;


// var settings = {};
// var db, dba;
// global return quit
// var _res, _req;

// Liker.init();
// Liker.start();

const port = 80
const requestHandler = (request, response) => {
  // console.log(request.url)
  if (request.url == '/') {
    response.writeHeader(200, {"Content-Type": "text/html"} );
    let readStream = fs.createReadStream('node/html/index.html','utf8')
    readStream.pipe(response)
  }
  /*
  else if (request.url == '/style.css') {
    response.writeHeader(200, {"Content-Type": "text/css"} );
    let readStream = fs.createReadStream('node/html/style.css','utf8')
    readStream.pipe(response)
  }
  else if (request.url == '/index.js') {
    response.writeHeader(200, {"Content-Type": "text/javascript"} );
    let readStream = fs.createReadStream('node/html/index.js','utf8')
    readStream.pipe(response)
  }
  else {
    response.writeHeader(200, {"Content-Type": "text/html"} );
    response.end('Hello Node.js Server!')
  }
  */
}
const server = http.createServer(requestHandler)
server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})


process.on('exit', function (code) {
  warn('Process exit code '+code)
  server.close()
  // Add shutdown logic here.
})