const { exec } = require('child_process')

let dataFileNameTemplate = './data/#start#-#finish#-#entities#.txt'
let dataFileName = null
let rawFile = './data/raw.txt'
const inChan = 'system:capture_1'
const outChan = 'aubio:in_1'

let AudioCare = {

  start: () => {
    info('AudioCare.start()')
    let config = global.config

    let c_script_path
    let cmd

    if (process.platform == 'win32') {
      //  ${process.cwd()}
      cmd = `c/audiocare-windows-x64.exe hello.wav`
    } else if (process.env.HOME == '/home/kailight') {
      c_script_path = path.resolve('./c/audiocare-ubuntu-amd64')
      cmd = `${c_script_path} -v -B ${config.sample_interval} -H ${config.sample_interval} -d ${config.dataCode}`
    } else {
      // cmd = `./aubio/build/examples/audiocare > ${file}`
      cmd = `./c/audiocare -B ${config.sample_interval} -H ${config.sample_interval} -d ${config.dataCode}`
    }
    info('Executing '+cmd)

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
        process_channels = exec(`jack_connect ${inChan} ${outChan}`, (error, stdout, stderr) => {
          if (error != null) {
            quit(`Jack connect spawn error: ${error}\``)
          }
        })
      }
      process_audocare = exec(cmd, (error, stdout, stderr) => {
        if (error !== null) {
          quit(`AudioCare C spawn error: ${error}`);
        }
        if (stderr) {
          quit(`AudioCare C error: ${stderr}`);
        }
      })
      // process_audocare.stdout.pipe(fs.createWriteStream(rawFile))

      setTimeout( procChan, 2000 )
      setTimeout( startCapture, 3000 )

      info('-start()')
    }

    let currentPipe = null
    let startCapture = () => {

      let now = Date.now()
      let duration = config.audio_duration * 1000
      dataFileName = dataFileNameTemplate
      dataFileName = dataFileName.replace('#start#', now )
      dataFileName = dataFileName.replace('#finish#', now + duration )
      dataFileName = dataFileName.replace('#entities#', config.dataCode )
      message( 'Starting data capture into file '+dataFileName )
      currentPipe = fs.createWriteStream( dataFileName )
      process_audocare.stdout.pipe( currentPipe )
      setTimeout( endCapture, duration )

    }

    let endCapture = () => {
      message('Ending capture to file '+dataFileName)
      // process_audocare.stdout.pause()
      // buffer = fs.readFile(rawFile).toString()
      // buffer = buffer.replace( /[\s\S]+?==(.+)==\n(.+)/, "$1\n$2" )
      if (currentPipe) {
        process_audocare.stdout.unpipe(currentPipe)
      }
      if (config.hasTimer) {
        setTimeout( startCapture, config.timer * 1000 )
      }
    }

    start()

    if (config.hasTimer) {

    }
    // Liker.run();
  }

}



module.exports = AudioCare