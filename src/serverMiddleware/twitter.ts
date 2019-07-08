import fs from 'fs'
import express from 'express'
import passport from 'passport'
import { Strategy, Profile } from 'passport-twitter'
import session from 'express-session'
import Twitter from 'twitter'
import bodyParser from 'body-parser'
import connectPgSimple from 'connect-pg-simple'

const isProd: boolean = process.env.NODE_ENV === 'production'

const consumerKey: string = isProd
  ? process.env.TWITTER_CONSUMER_KEY
  : require('./twitter-credential').consumerKey
const consumerSecret: string = isProd
  ? process.env.TWITTER_CONSUMER_SECRET
  : require('./twitter-credential').consumerSecret

const app: express.Router = express.Router()
const PgSession: typeof connectPgSimple.PGStore = connectPgSimple(session)

passport.serializeUser(
  (tokens: any, done: (err: any, id?: unknown) => void): void =>
    done(null, {
      ...tokens
    })
)
passport.deserializeUser(
  (tokens: any, done: (err: any, id?: unknown) => void): void =>
    done(null, tokens)
)
passport.use(
  new Strategy(
    {
      consumerKey,
      consumerSecret,
      callbackURL: `${
        isProd ? 'https://anime-anime.herokuapp.com' : 'http://localhost:3000'
      }/api/twitter/callback`
    },
    (
      token: string,
      secretToken: string,
      profile: Profile,
      done: (error: any, user?: any) => void
    ): void =>
      done(null, {
        token,
        secretToken
      })
  )
)

export default app
  .use(
    session({
      store: isProd
        ? new PgSession({
            conString: process.env.DATABASE_URL
          })
        : undefined,
      secret: process.env.COOKIE_SECRET || 'secret',
      resave: false,
      saveUninitialized: false
    })
  )
  .use(passport.initialize())
  .use(passport.session())
  .use(bodyParser.json())
  .get(
    '/oauth/:filename',
    (req: any, res: express.Response, next: express.NextFunction): void => {
      if (req.session) {
        req.session.filename = req.params.filename
      }
      next()
    },
    passport.authenticate('twitter')
  )
  .get(
    '/callback',
    (req: any, res: express.Response, next: express.NextFunction): void => {
      passport.authenticate('twitter', {
        session: true,
        successRedirect: `/controller/share/${req.session &&
          req.session.filename}`
      })(req, res, next)
    }
  )
  .post(
    '/upload-media',
    async (req: any, res: express.Response): Promise<void> => {
      if (!req.user || !req.session.filename) {
        res.status(500).json({
          error: 'no token'
        })
      }

      const client: Twitter = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        access_token_key: req.user.token,
        access_token_secret: req.user.secretToken
      })

      const mediaId: string | { error: any } = await uploadMedia(
        client,
        req.session.filename
      )

      if (typeof mediaId !== 'string') {
        res.status(500).json({
          error: mediaId.error
        })

        return
      }

      try {
        await statusesUpdate(client, mediaId, req.body.text)

        res.status(200).json({
          message: 'share ok'
        })
      } catch (error) {
        res.status(500).json({
          error
        })
      }
    }
  )

async function uploadMedia(
  client: Twitter,
  fileName: string
): Promise<string | any> {
  const mediaFilePath: string = `${__dirname}/../static/animation-img/${fileName}.gif`

  try {
    const mediaSize: number | void = await getMediaSize(mediaFilePath)
    const mediaId: string | void = await mediaUploadInit(client, mediaSize)
    await mediaUploadAppend(client, mediaId, mediaFilePath)
    await mediaUploadFinalize(client, mediaId)

    return mediaId
  } catch (error) {
    return {
      error
    }
  }
}

function getMediaSize(filePath: string): Promise<number> {
  return new Promise(
    (resolve: (size: number) => void, reject: (reason: any) => void): void => {
      fs.stat(
        filePath,
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

function mediaUploadInit(client: Twitter, mediaSize: number): Promise<string> {
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

function mediaUploadAppend(
  client: Twitter,
  mediaId: string,
  filePath: string
): Promise<void> {
  return new Promise(
    (resolve: () => void, reject: (reason: any) => void): void => {
      const requests: Promise<Twitter.ResponseData>[] = []
      let segmentIndex: number = 0
      fs.createReadStream(filePath)
        .on(
          'data',
          (chunk: any[]): void => {
            requests.push(
              client.post('media/upload', {
                command: 'APPEND',
                media_id: mediaId,
                media: chunk,
                segment_index: segmentIndex
              })
            )

            console.log('data')
            segmentIndex++
          }
        )
        .on(
          'end',
          (): void => {
            console.log('end')
            Promise.all(requests)
              .then(
                (): void => {
                  resolve()
                }
              )
              .catch(
                (err: any): void => {
                  console.log(err)
                  reject(err)
                }
              )
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

function mediaUploadFinalize(
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
            console.error('Error: mediaUploadFinalize')
            reject(error)
            return
          }

          resolve(data)
        }
      )
    }
  )
}

function statusesUpdate(
  client: Twitter,
  mediaId: string,
  status: string
): Promise<Twitter.ResponseData> {
  return new Promise(
    (
      resolve: (data: Twitter.ResponseData) => void,
      reject: (error: any) => void
    ): void => {
      client.post(
        'statuses/update',
        {
          media_ids: mediaId,
          status: status
        },
        (error: any, data: Twitter.ResponseData): void => {
          if (error) {
            reject(error)

            return
          }

          resolve(data)
        }
      )
    }
  )
}
