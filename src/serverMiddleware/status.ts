import express from 'express'

const app: express.Router = express.Router()

export default app.get(
  '/',
  (req: express.Request, res: express.Response): void => {
    res.status(200)
    res.json({
      status: 'ok'
    })
  }
)
