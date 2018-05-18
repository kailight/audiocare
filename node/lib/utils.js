const fs    = require('fs');
const path  = require('path');
const clc   = require('cli-color');
const readLineSync = require('readline-sync');

let outputInfo = false
let utils = {};

module.exports = utils

let logHTML = function( filename, data ) {
  fs.writeFileSync( 'debug/'+filename+'.html', data );
};

let logJson = function( filename, data ) {
  fs.writeFileSync( 'debug/'+filename+'.js', 'let '+filename+' = '+JSON.stringify( data, null, '  ' ) + ';');
};


let quit = function (status, message_or_data, message) {
// info('quit()', status, typeof message_or_data, typeof message_or_data);

  if (typeof _req == 'undefined') {
    quitcli(status, message_or_data);
  }

  // console.info(_req);
  // console.info(_res);
  let data;

  if (typeof message_or_data == 'object') {
    message = message;
    data = message_or_data;
  }
  else if (typeof message_or_data == 'string' && !message) {
    message = message_or_data;
    data = message_or_data;
  }
  else if (typeof message_or_data == 'number') {
    data = ''+message_or_data;
  }
  else if (message) {
    message = message;
    data = message_or_data;
  }
  else {
    message = 'Something happened';
    data = null;
  }

  // isAjax = _req.xhr;
  isAjax = true;

  // db.disconnect();

  // _res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  // _res.header('Cache-Control', 'no-cache');

  if (data) {
    // info(data);
  }

  if ( isAjax ) {
    if (message) _res.statusMessage = message;
    return _res.status(status).send( data );
  } else {
    return _res.status(status).send( pug.renderFile('error', data) ).end();
  }

};










let rand = function(min, max) {
  min = parseInt(min);
  max = parseInt(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};



let info = function() {
  if (isDev() && outputInfo) {
    if (arguments.length > 1) {
      for (let arg of arguments) {
        console.info(arg);
      }
    } else {
      console.info(arguments[0]);
    }
  }
};

let err = function(arg) {
  console.warn(clc.red(arg))
}

let warn = function(arg) {
  console.warn(clc.yellow(arg))
}
// let warn = console.warn;



let message = function() {
  for (let arg of arguments) {
    console.info(arg);
  }
};

let messageq = function() {
  for (let arg of arguments) {
    console.info(clc.cyan(arg));
  }
};


let gettime = (str) => {
  let s = 0
  if (str.indexOf('s') > -1) {
    s = parseInt( str.replace('s','') )
  }
  if (str.indexOf('m') > -1) {
    s = parseInt( str.replace('m','') ) * 60
  }
  if (str.indexOf('h') > -1) {
    s = parseInt( str.replace('h','') ) * 60 * 60
  }
return s
}









let include = function( location ) {

  let content = fs.readFileSync( './'+location );
  return content;

};




let env = () => {
  if (process.env.SUDO_USER == 'KaiLight') {
    return 'deathnote';
  } else {
    return 'g2';
  }
};



let quitcli = function(message, status = 0) {

  console.info( clc.red(message) );
  process.exit(status);

};



let isDev = () => {
  return env() == 'deathnote'
};



rootRequire = function(file) {
  return require( path.join ( ROOT , file ) );
};


let isArray = function(obj) {
  return !!obj && Array === obj.constructor;
};


const sleep = ms => new Promise(res => setTimeout(res, ms));


global.sleep        = sleep;
global.rootRequire  = rootRequire;
global.quit         = quit;
global.quitcli      = quitcli;
global.message      = message;
global.messageq     = messageq;
global.info         = info;
global.isArray      = isArray;
global.warn         = warn;
global.logHTML      = logHTML;
global.logJson      = logJson;
global.env          = env();
global.err          = err;
global.isDev        = isDev();
global.rand         = rand;
global.gettime      = gettime;
global.quitcli      = quitcli;

module.exports = utils;