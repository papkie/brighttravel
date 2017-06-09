import http from 'http'
import path from 'path'
import { env, mongo, port, ip } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'

const app = express(api)
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./src/web/index.html'))
})
const server = http.createServer(app)

mongoose.connect(mongo.uri)

setImmediate(() => {
  server.listen(port, ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
  })
})

export default app
