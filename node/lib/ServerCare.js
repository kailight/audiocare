const port = 80
const http = require('http')
const moment = require('moment')

let dateFormat = (date) => {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a')
  // +date.getMilliseconds()
}
let dateFormatStart = (date) => {
  return moment(date).format('MMMM Do YYYY, h:mm:ss a')
  // +date.getMilliseconds()
}
let dateFormatFinish = (date) => {
  return moment(date).format('h:mm:ss a')
  // +date.getMilliseconds()
}
let dateFormatShort = (date) => {
  return moment(date).format('mm:ss')
  // +date.getMilliseconds()
}


let humanizeFilename = (filename) => {
  let basename = filename
  basename = filename.replace('.txt','')
  basename = filename.replace('.csv','')
  let datas = basename.split('-')
  let start  = new Date(parseInt(datas[0]))
  let finish = new Date(parseInt(datas[1]))
  let entitiesCode = datas[2]
  let entities = entitiesDecode(entitiesCode)
  start  = dateFormatStart(start)
  finish = dateFormatFinish(finish)
  entities = entities.join(', ')
  return `${start} - ${finish} (${entities})`
}



let entitiesDecode = (entitiesCode) => {
  let entities = []
  if (entitiesCode[0] === '1') entities.push('mean')
  if (entitiesCode[1] === '1') entities.push('centroid')
  if (entitiesCode[2] === '1') entities.push('slope')
  if (entitiesCode[3] === '1') entities.push('spread')
  if (entitiesCode[4] === '1') entities.push('skewness')
  if (entitiesCode[5] === '1') entities.push('kurtosis')
  if (entitiesCode[6] === '1') entities.push('decrease')
  if (entitiesCode[7] === '1') entities.push('rolloff')
  if (entitiesCode[8] === '1') entities.push('mfcc')
  return entities
}



let dehumanizeFilename = (filename) => {

}

// console.info(humanizeFilename('1526616711368-1526616716368-110000000.txt'))
// process.exit();

let ServerCare = {
  start: () => {
    info('ServerCare.start()')
    const requestHandler = (request, response) => {
      if (request.url == '/') {
        response.writeHeader(200, { "Content-Type": "text/html" } );
        let readStream = fs.createReadStream('node/html/index.html','utf8')
        readStream.pipe(response)
      }
      if (request.url == '/download') {
        response.writeHeader(200, { "Content-Type": "text/html" } );
        // let readStream = fs.createReadStream('node/html/download.html','utf8')
        // readStream.pipe(response)
        let fc = fs.readFileSync('node/html/download.html').toString()
        let files = []
        let items = fs.readdirSync(path.resolve('.')+'/data')
        for ( let i=0; i<items.length; i++ ) {
          if (items[i]) {
            files.push( items[i].replace('.txt','') )
          }
        }
        let links = []
        // console.info(files)
        for (let file of files) {
          // links.push('<a href="/download/'+file+'.csv'+'">'+humanizeFilename(file)+'</a>')
          links.push('<a href="/download/'+file+'">'+humanizeFilename(file).replace(' ','_')+'</a>')
        }
        let html = fc
        html = html.replace( '#filelist#', links.join("\n") )
        response.write(html)
        response.end()
      }
      if ( request.url.match(/\/download\/.+/) ) {
        let fileName = request.url.replace('/download/','')
        fileName = fileName+'.txt'
        console.info(fileName)
        let filePath = path.resolve('.')+'/data/'+fileName
        if ( !fs.statSync(filePath) ) {
          response.writeHeader( 400, { "Content-Type": "text/plain" } );
          response.write( 'File not found' );
          return
        }
        let content = fs.readFileSync(filePath).toString()
        content = content.split("\n")
        content.shift()
        content.pop()

        for (let n in content) {
          let l = content[n].split(' ')
          l[0] = dateFormatShort(new Date( parseInt(l[0]) ))
          content[n] = '"'+l.join('","')+'"'
        }

        let filenameEntities = fileName.split('-')
        filenameEntities = filenameEntities[2]

        let header = '"time",'+(entitiesDecode(filenameEntities).join('","'))+"\"\n"
        content = header+content.join("\n")
        // let file = fs.createWriteStream('./data/'+fileName+'.csv')
        // fs.writeFile(file,content)
        // response.writeHeader( 200, {"Content-Type": "text/csv"} )
        // console.info( humanizeFilename(fileName) )

        response.writeHeader( 200,
          {
            "Content-Disposition": "attachment;filename=\""+humanizeFilename(fileName)+".csv\"",
            "Content-Type": "application/octet-stream"
          }
        )

        response.write(content)
        response.end()
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
        return console.log('Something bad happened', err)
      }
      message('Server is listening on 127.0.0.1:'+port)
      // console.log(`Server is listening on ${port}`)
    })
  }
}

module.exports = ServerCare