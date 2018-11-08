const StaticServer = require('static-server')

const server = new StaticServer({
  rootPath: './public/',
  port: 3001
})

server.start(() => {
  console.log(`Server started on port ${server.port}`)
})
