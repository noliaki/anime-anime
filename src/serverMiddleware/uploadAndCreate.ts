import express from 'express'
import multer from 'multer'
import imagemagick from 'imagemagick'
import { getUuid } from '@@/common/helper'

const tempImageDir: string = `${__dirname}/../../tmp`
const docRoot: string = `${__dirname}/../../src/static/animation-img`

const storage: multer.StorageEngine = multer.diskStorage({
  destination(
    req: Express.Request,
    file: Express.Multer.File,
    callBack: (error: Error | null, fileName: string) => void
  ): void {
    callBack(null, tempImageDir)
  },
  filename(
    req: Express.Request,
    file: Express.Multer.File,
    callBack: (error: Error | null, fileName: string) => void
  ): void {
    console.log('---------------------------')
    console.log('multer.diskStorage: filename')
    console.log(file)
    console.log('')
    const extenstion: string = getImageExtention(file)
    callBack(null, `${getUuid()}${extenstion}`)
  }
})

const upload = multer({
  storage
}).fields([
  {
    name: 'leftScreen',
    maxCount: 1
  },
  {
    name: 'centerScreen',
    maxCount: 1
  },
  {
    name: 'rightScreen',
    maxCount: 1
  }
])

const app: express.Router = express.Router()

function createAnimation(fileNames: string[]): Promise<string> {
  return new Promise(
    (resolve: (fileName: any) => void, reject: (error: any) => void): void => {
      const gifFileName: string = getUuid()

      imagemagick.convert(
        [
          '-delay',
          10,
          '-loop',
          0,
          '-layers',
          'optimize',
          ...fileNames,
          `${docRoot}/${gifFileName}.gif`
        ],
        (error, stdout): void => {
          console.log(stdout)

          if (error) {
            reject(error)
            return
          }

          resolve(`${gifFileName}.gif`)
        }
      )
    }
  )
}

function getImageExtention(file: Express.Multer.File): string {
  switch (file.mimetype) {
    case 'image/gif':
      return '.gif'
    case 'image/jpeg':
      return '.jpg'
    case 'image/png':
      return '.png'
    case 'image/webp':
      return '.webp'
    case 'image/svg+xml':
      return '.svg'

    default:
      return '.jpg'
  }
}

export default app.post(
  '/',
  upload,
  async (req: express.Request, res: express.Response): Promise<void> => {
    const centerImageFileName: string = `${tempImageDir}/${
      (req.files as { [key: string]: Express.Multer.File[] }).centerScreen[0]
        .filename
    }`

    const fileNames: string[] = Object.keys(req.files).map(
      (key: string): string => `${tempImageDir}/${req.files[key][0].filename}`
    )
    fileNames.push(centerImageFileName)

    const animationFileName: string = await createAnimation(fileNames)

    res.status(200)
    res.json({
      animationFileName
    })
  }
)
