const fs    = require('fs');
const path  = require('path');
const clc   = require('cli-color');
const readLineSync = require('readline-sync');
const fileName  = path.resolve(ROOT+'/..')+'/configuration/config'

let askContinue = () => {
  let y = readLineSync.prompt()
  if (y.length) {
    quitcli('You have cancelled the script execution')
  }
}
let allowed = 'mfcc/mean/centroid/slope/spread/skewness/kurtosis/decrease/rollof'.split('/')
let allowed_buffer_sizes = [512,1024,2048,4096,8192,16384,32768]



let config = {

  do : function () {
    let conf = this.loadOrMake();
    this.confirm(conf)
    return conf
  },

  /**
   * Loads config according to environment
   */
  load : function() {
    let cfgraw = fs.readFileSync( fileName ).toString()
    cfgraw = cfgraw.split("\n")
    let cfg = {}
    let config = {}

    for (let str of cfgraw) {
      if ( str.charAt(0) != '#' ) {
        str = str.split('=');
        str.forEach( (s) => { s.trim() } )
        cfg[str[0]] = str[1]
      }
    }

    let allowed = 'mfcc/mean/centroid/slope/spread/skewness/kurtosis/decrease/rollof'.split('/')

    if (!cfg['device_id']) {
      quitcli(`No device_id in config, please run config`)
    }
    config.device_id = cfg.device_id
    // info(`device_id: ${cfg.device_id}`)

    if (!cfg['server']) {
      quitcli(`No server in config, please run config`)
    }
    if (!cfg['server'].match(/[A-z0-9.]+:[0-9]+/)) {
      quitcli(`Bad server format, please run config`)
    }
    config.server = cfg.server
    // info(`server: ${cfg.server}`)

    // info(cfg.timer)

    if ( config.timer = gettime( cfg['timer'] )  ) {
      // console.info(config.timer)
      config.hasTimer = true
    } else {
      config.hasTimer = false
    }
    // info(`timer: ${cfg.timer}`)

    if (!cfg['audio_duration'] && config.hasTimer) {
      quitcli(`Missing audio_duration in config, please run config OR set timer to 0`)
    }
    config.audio_duration = gettime( cfg.audio_duration )
    // info(`audio_duration: ${cfg.audio_duration}`)

    if (!cfg['sample_interval']) {
      quitcli(`Missing sample_interval in config, please run config`)
    }
    if ( config.sample_interval = cfg.sample_interval ) {
      // config.sample_interval = config.sample_interval * 16384
      // info(`sample_interval: ${config.sample_interval}`)
    }


    if (!cfg['send_timer'] && cfg['send_timer'] != 0) {
      quitcli(`Missing send_timer in config, please run config`)
    }
    else {
      config.send_timer = gettime( cfg.send_timer )
    }
    // info(`send_timer: ${cfg.send_timer}`)

    if (!cfg['data']) {
      quitcli(`Missing data in config, please run config`)
    } else {
      let data = cfg['data'].split(',')
      for (let d of data) {
        d = d.trim()
        if (allowed.indexOf(d) == -1) {
          quitcli(`data param d is not allowed, allowed data params are ${allowed.join('/')}`)
        }
      }
      config.data = data
    }
    // info(`data: ${cfg.data}`)

    return config
  },

  confirm : function (config) {

    let m = `\nThe script will be run `
    if (!config.hasTimer) {
      m += 'infinitely, '
    } else {
      m += 'every '+clc.yellow.bold(config.timer)+' seconds '
      m += 'for '+clc.yellow.bold(config.audio_duration)+' seconds, '
    }
    m += `with *${config.data.join(', ')}* taken every *${config.sample_interval}* buffers.\n`
    m += "The data will be "
    if (config.send_timer) {
      m += `stored in file *data/data.txt* AND sent to *${config.server}* every *${config.send_timer}* seconds`
    } else {
      m += `stored in file *data/data.txt* without sending.`
    }
    m = m.replace(/\*(.+?)\*/gm, clc.yellow.bold('$1') )
    info( m )

    let d = config.data
    let s = ''
    s = d.indexOf('mean') >= 0 ? s+1 : s+0
    s = d.indexOf('centroid') >= 0 ? s+1 : s+0
    s = d.indexOf('slope') >= 0 ? s+1 : s+0
    s = d.indexOf('spread') >= 0 ? s+1 : s+0
    s = d.indexOf('skewness') >= 0 ? s+1 : s+0
    s = d.indexOf('kurtosis') >= 0 ? s+1 : s+0
    s = d.indexOf('decrease') >= 0 ? s+1 : s+0
    s = d.indexOf('rolloff') >= 0 ? s+1 : s+0
    s = d.indexOf('mfcc') >= 0 ? s+1 : s+0
    config.dataCode = s


    messageq( "\nPress <ENTER> to confirm or any other key to exit" )
    askContinue()

  },


  /**
   * @param filename
   */
  loadOrMake : function (filename) {
    try {
      return this.load(filename)
    } catch (e) {
      err(e);
      message( clc.red("Config file not found.") )
      messageq( "Press <ENTER> to create new config" )
      askContinue()
      this.make(filename)
      return this.loadOrMake(filename)
    }
  },


  /**
   * @param filename
   */
  make : function (filename) {
    // info('makeConfig')

    let template = `#!/bin/bash
# device_id, to know which room the sound comes from on server
device_id=#device_id#
# server ip and port to send collected data to (e.g. http://127.0.0.1:8000)
server=#server#
# timer (time) take sample every (10s/1m/1h etc, 0 to run infinitely)
timer=#timer#
# audio_duration (time) (1s/10s/1m etc, if timer is 0 this will by IGNORED)
audio_duration=#audio_duration#
# sample_interval (buffer) (${allowed_buffer_sizes.join('/')}) - how often do we take audio sample
sample_interval=#sample_interval#
# send_timer (time) how often we send data to server, if timer is 0 this will be IGNORED
send_timer=#send_timer#
# which data to grab from audio (mean,slope/mfcc,skewness/centroid,spread etc)
# possible values are: mfcc/mean/centroid/slope/spread/skewness/kurtosis/decrease/rolloff
data=#data#
`

    let device_id       = this.enter('device_id')
    let server          = this.enter('server')
    let timer           = this.enter('timer')
    let audio_duration  = this.enter('audio_duration')
    let sample_interval = this.enter('sample_interval')
    let send_timer      = this.enter('send_timer')
    let data            = this.enter('data')

    let fileContent = template
    fileContent = fileContent.replace( '#device_id#',device_id )
    fileContent = fileContent.replace( '#server#',server )
    fileContent = fileContent.replace( '#timer#',timer )
    fileContent = fileContent.replace( '#audio_duration#',audio_duration )
    fileContent = fileContent.replace( '#sample_interval#',sample_interval )
    fileContent = fileContent.replace( '#send_timer#',send_timer )
    fileContent = fileContent.replace( '#data#',data )

    fs.writeFileSync( fileName, fileContent)
    message(clc.green('Configuration is saved into config file'))

  },

  enter : function (entry) {

    // string containing error message
    let e
    // value
    let val

    switch (entry) {
      case 'device_id':
        messageq("Enter device id (numerical, ex: 1/001)")
        val = readLineSync.prompt()
        if ( !val.match(/[0-9]+/) )
          e = 'Device should be numerical'
        break
      case 'server':
        messageq("Enter central server ip:port (ex: 127.0.0.1:80/192.168.0.1)")
        message("Default 127.0.0.1:80")
        val = readLineSync.prompt()
        if (!val) val = '127.0.0.1:80'
        if ( !val.match(/[0-9\.+]+:?[0-9]+/) )
          e = 'Server IPv4 should match pattern n.n.n.n or n.n.n.n:n'
        break
      case 'timer':
        messageq("Enter timer, should be 0 or number affixed by either s or m (e.g. 0, 1s, 15s, 2m)")
        message("Default 1m")
        val = readLineSync.prompt()
        if (val === '') val = '1m'
        if (val === '0') val = 0
        if ( val !== 0 && !val.match(/[0-9]+?m/) && !val.match(/[0-9]+?s/) )
          e = 'Timer should match pattern like 0 1s 15m etc'
        break
      case 'audio_duration':
        messageq("Enter audio_duration, for how long we gonna grab the audio info number affixed by either s or m (e.g. 1s, 15s, 1m)")
        message("Default 5s")
        val = readLineSync.prompt()
        if (val === '') val = '5s'
        if (val === '0') val = 0
        if ( val !== 0 && !val.match(/[0-9]+?s/) && !val.match(/[0-9]+?m/) && !val.match(/[0-9]+?h/) )
          e = 'Audio duration should match pattern like 0 1s 15m etc'
        break
      case 'sample_interval':
        messageq("Enter sample_interval, atm only buffer size is accepted, and limited to values of "+allowed_buffer_sizes.join('/'))
        val = readLineSync.prompt()
        if ( allowed_buffer_sizes.indexOf( parseInt(val) ) === -1 )
          e = 'sample_interval should equal one of' + allowed_buffer_sizes.join('/')
        break
      case 'send_timer':
        messageq("Enter send_timer value, 0 to disable, or number affixed by one of s/m/h (e.g 0, 30s, 1m, 24h)")
        val = readLineSync.prompt()
        if (val === '0') val = 0
        if ( val !== 0 && !val.match(/[0-9]+?m/) && !val.match(/[0-9]+?s/) && !val.match(/[0-9]+?h/) )
          e = 'Timer should match pattern like 0 30s 15m 1h etc'
        break
      case 'data':
        messageq("Enter data parameter separated by comma, some of "+(allowed.join('/')))
        val = readLineSync.prompt()
        let vals = val.split(',')
        for (let n in vals) {
          vals[n] = vals[n].trim()
          if ( allowed.indexOf( vals[n] ) === -1 )
            e = vals[n]+' is not allowed parameter'
        }
        val = vals.join(',')
        break
      default:
        quitcli('entry: '+entry+' is not valid entry')

    }


    if (e) {
      err(e)
      return this.enter(entry)
    } else {
      return val
    }

  }




}



module.exports = config;