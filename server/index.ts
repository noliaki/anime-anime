import * as http from 'http'
import express from 'express'
import * as consola from 'consola'
import { Nuxt, Builder, NuxtConfigurationServer } from 'nuxt'
import { createConnection, ConnectionOptions } from 'typeorm'
import config from '../nuxt.config'
import { createSocketServer } from './web-socket'

import { Signage } from './models/Signage'
import { Controller } from './models/Controller'
import { Room } from './models/Room'

const isProd: boolean = process.env.NODE_ENV === 'production'

const PORT: number | string =
  process.env.PORT || (config.server as NuxtConfigurationServer).port || 3000
const connectOption: ConnectionOptions = isProd
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      dropSchema: true,
      entities: [Signage, Controller, Room]
    }
  : {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'app',
      database: 'media_app',
      synchronize: true,
      dropSchema: true,
      entities: [Signage, Controller, Room]
    }

const app: express.Express = (express as any)()
const server: http.Server = http.createServer(app)

async function start() {
  await createConnection(connectOption)
  // Init Nuxt.js
  const nuxt: Nuxt = new Nuxt(config)

  const { host } = config.server as NuxtConfigurationServer

  // Build only in dev mode
  if (config.dev) {
    const builder: Builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  createSocketServer(server)
  server.listen(PORT, host)
  ;(consola as any).ready({
    message: `Server listening on http://${host}:${PORT}`,
    badge: true
  })
}

start()
