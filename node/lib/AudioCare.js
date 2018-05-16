const { exec } = require('child_process')

let endFile = './data/data.txt'
let rawFile = './data/raw.txt'

let AudioCare = {
  start: () => {
    info('AudioCare.start()')
    let config = global.config
    console.info(config);

    let cmd
    if (process.platform == 'win32') {
      //  ${process.cwd()}
      cmd = `aubio\\build\\examples\\AudioCare.exe hello.wav`
    } else {
      // cmd = `./aubio/build/examples/audiocare > ${file}`
      cmd = `./aubio/build/examples/audiocare -B ${config.sample_interval} -d ${config.dataCode} > ${rawFile}`
    }
    info(cmd)
    // info(config)
    // process.exit()

    let capture = false
    let buffer = '';
    let process_audocare, process_channels

    let end = () => {
      process_audocare.kill()
      process_channels.kill()
      quitcli( 'Done! Check files for data.' )
    }

    let start = () => {
      info('+start()')
      let procChan = () => {
        process_channels = exec('jack_connect system:capture_1 aubio:in_1', (error, stdout, stderr) => {
          if (error != null) {
            quit(`Jack connect spawn error: ${error}\``)
          }
        })
      }
      process_audocare = exec(cmd, (error, stdout, stderr) => {
        // info(error, stdout, stderr)
        // console.log(stdout);
        // console.log(stderr)
        if (error !== null) {
          quit(`AudioCare C spawn error: ${error}`);
        }
      })
      setTimeout(procChan,2000)
      info('-start()')
    }

    let startCapture = () => {
      message('Starting capture')
      capture = true
    }
    let endCapture = () => {
      message('Ending capture')
      capture = false
      buffer = fs.readFileSync(rawFile).toString()
      buffer = buffer.replace( /[\s\S]+?==(.+)==\n(.+)/, "$1\n$2" )
      fs.writeFileSync( endFile, buffer )
      end()
    }

    let to = 3000
    setTimeout( startCapture,to )
    setTimeout( endCapture,to+(1000*config.audio_duration) )

    let loop = () => {
      info('loop()')
      exec(cmd, (error, stdout, stderr) => {
        // info(error, stdout, stderr)
        // console.log(stdout);
        // console.log(`${stderr}`);
        if (error !== null) {
          quit(`AudioCare C Script exec error: ${error}`);
        }
      })
      info('-loop()')
    }
    start()

    // If timer is set - repeat
    if (config.timer) {
      setInterval(loop,config.timer*1000)
    }
    // Liker.run();
  }
}



module.exports = AudioCare