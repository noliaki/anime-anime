import express from 'express'
import helmet from 'helmet'
import uploadAndCreate from './uploadAndCreate'
import status from './status'
import twitterApp from './twitter'

const app: express.Express = express()

export default app
  .use(helmet())
  .use('/uploadAndCreate', uploadAndCreate)
  .use('/status', status)
  .use('/twitter', twitterApp)
