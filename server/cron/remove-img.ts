import fs from 'fs'
import path from 'path'
import { CronJob } from 'cron'

const lifeTime: number = 1000 * 60 * 10
const tempPath: string = path.resolve(`${__dirname}/../../tmp`)
const animationPath: string = path.resolve(
  `${__dirname}/../../src/static/animation-img`
)

const workerJob: CronJob = new CronJob({
  cronTime: '*/1 * * * *',
  async onTick(): Promise<void> {
    console.log('start removing...')
    await scanDir(tempPath)
    await scanDir(animationPath)
    console.log('finish removing!')
  }
})

function scanDir(targetDir: string): Promise<void> {
  return new Promise(
    (resolve: () => void, reject: (err: any) => void): void => {
      fs.readdir(
        targetDir,
        async (
          err: NodeJS.ErrnoException | null,
          files: string[]
        ): Promise<void> => {
          if (err) {
            reject(err)
            return
          }

          for (let i: number = 0, len: number = files.length; i < len; i++) {
            await checkAndRemove(`${targetDir}/${files[i]}`)
          }

          resolve()
        }
      )
    }
  )
}

function checkAndRemove(filePath: string): Promise<void> {
  return new Promise(
    (resolve: () => void, reject: (reason: any) => void): void => {
      fs.stat(
        filePath,
        async (
          err: NodeJS.ErrnoException | null,
          stats: fs.Stats
        ): Promise<void> => {
          if (err) {
            reject(err)
            return
          }

          const now: number = Date.now()

          if (now - stats.birthtimeMs >= lifeTime) {
            await removeFile(filePath)
          }

          resolve()
        }
      )
    }
  )
}

function removeFile(filePath: string): Promise<void> {
  return new Promise(
    (resolve: () => void, reject: (reason: any) => void): void => {
      fs.unlink(
        filePath,
        (unlinkErr: NodeJS.ErrnoException | null): void => {
          if (unlinkErr) {
            reject(unlinkErr)
            return
          }

          console.log(`remove: ${filePath}`)
          resolve()
        }
      )
    }
  )
}

export default workerJob
