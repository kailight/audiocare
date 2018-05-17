const port = 80
const http = require('http')

let ServerCare = {
  start: () => {
    info('ServerCare.start()')
    const requestHandler = (request, response) => {
      if (request.url == '/') {
        response.writeHeader(200, {"Content-Type": "text/html"} );
        let readStream = fs.createReadStream('node/html/index.html','utf8')
        readStream.pipe(response)
      }
      if (request.url == '/download') {
        response.writeHeader(200, {"Content-Type": "text/html"} );
        let readStream = fs.createReadStream('node/html/download.html','utf8')
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
        return console.log('Something bad happened', err)
      }
      message('Server is listening on 127.0.0.1:'+port)
      // console.log(`Server is listening on ${port}`)
    })
  }
}

module.exports = ServerCare