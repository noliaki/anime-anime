import fs from 'fs'
import express from 'express'
import passport from 'passport'
import { Strategy, Profile } from 'passport-twitter'
import session from 'express-session'
import Twitter from 'twitter'

const isProd: boolean = process.env.NODE_ENV === 'production'

const consumerKey: string = isProd
  ? process.env.TWITTER_CONSUMER_KEY
  : require('./twitter-credential').consumerKey
const consumerSecret: string = isProd
  ? process.env.TWITTER_CONSUMER_SECRET
  : require('./twitter-credential').consumerSecret

const app: express.Router = express.Router()

passport.serializeUser(
  (tokens: any, done: (err: any, id?: unknown) => void): void => {
    console.log('RUN: passport.serializeUser')
    console.log(tokens)
    return done(null, {
      ...tokens
    })
  }
)
passport.deserializeUser(
  (tokens: any, done: (err: any, id?: unknown) => void): void => {
    console.log('RUN: passport.deserializeUser')
    console.log(tokens)
    return done(null, tokens)
  }
)
passport.use(
  new Strategy(
    {
      consumerKey,
      consumerSecret,
      callbackURL: 'http://localhost:3000/api/twitter/callback'
    },
    (
      token: string,
      secretToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ): void => {
      console.log('Strategy')
      console.log(token, secretToken)
      done(null, {
        token,
        secretToken
      })
    }
  )
)

export default app
  .use(
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .get(
    '/oauth/:filename',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): void => {
      if (req.session) {
        req.session.filename = req.params.filename
      }
      next()
    },
    passport.authenticate('twitter')
  )
  .get(
    '/callback',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): void => {
      passport.authenticate('twitter', {
        session: true,
        successRedirect: `/controller/share/${req.session &&
          req.session.filename}`
      })(req, res, next)
    }
  )
  .post(
    'upload-media',
    async (req: express.Request, res: express.Response): Promise<void> => {
      const client: Twitter = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token_key: req.user.token,
        access_token_secret: req.user.secretToken
      })

      const mediaId: string = await uploadMedia(client, req.body.fileName)

      if (mediaId) {
        client.post(
          'statuses/update',
          {
            media_ids: mediaId,
            status: req.body.text
          },
          (error: any): void => {
            if (error) {
              res.status(500).json({
                error
              })

              return
            }

            res.status(200).json({
              message: 'share ok'
            })
          }
        )
      }

      res.status(200).json({
        message: 'not shared'
      })
    }
  )

async function uploadMedia(client: Twitter, fileName: string): Promise<string> {
  const mediaFileName: string = `${__dirname}/../static/${fileName}`
  const mediaSize: number | void = await getMediaSize(mediaFileName)
  const mediaId: string | void = await getMediaId(client, mediaSize)

  await appendMediaData(client, mediaId, mediaFileName)
  await finalizeUpload(client, mediaId)

  return mediaId
}

function getMediaSize(fileName: string): Promise<number> {
  return new Promise(
    (resolve: (size: number) => void, reject: (reason: any) => void): void => {
      fs.stat(
        fileName,
        (error: any, stats: fs.Stats): void => {
          if (error) {
            reject(error)
            return
          }

          resolve(stats.size)
        }
      )
    }
  )
}

function getMediaId(client: Twitter, mediaSize: number): Promise<string> {
  return new Promise(
    (resolve: (size: string) => void, reject: (reason: any) => void): void => {
      client.post(
        'media/upload',
        {
          command: 'INIT',
          total_bytes: mediaSize,
          media_type: 'image/gif'
        },
        (error: any, data: Twitter.ResponseData): void => {
          if (error) {
            reject(error)
            return
          }

          resolve(data.media_id_string)
        }
      )
    }
  )
}

function appendMediaData(
  client: Twitter,
  mediaId: string,
  fileName: string
): Promise<boolean> {
  return new Promise(
    (
      resolve: (result: boolean) => void,
      reject: (reason: any) => void
    ): void => {
      let segmentIndex: number = 0
      fs.createReadStream(fileName)
        .on(
          'data',
          (chunk: any[]): void => {
            client.post('media/upload', {
              command: 'APPEND',
              media_id: mediaId,
              media: chunk,
              segment_index: segmentIndex
            })

            segmentIndex++
          }
        )
        .on(
          'end',
          (): void => {
            console.log('end')
            resolve(true)
          }
        )
        .on(
          'error',
          (reason: any): void => {
            console.log('ERROR: createReadStream')
            console.log(reason)
            reject(reason)
          }
        )
    }
  )
}

function finalizeUpload(
  client: Twitter,
  mediaId: string
): Promise<Twitter.ResponseData> {
  return new Promise(
    (
      resolve: (data: Twitter.ResponseData) => void,
      reject: (reason: any) => void
    ): void => {
      client.post(
        'media/upload',
        {
          command: 'FINALIZE',
          media_id: mediaId
        },
        (error: any, data: Twitter.ResponseData): void => {
          if (error) {
            console.error('Error: finalizeUpload')
            reject(error)
            return
          }

          resolve(data)
        }
      )
    }
  )
}
