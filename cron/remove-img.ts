import fs from 'fs'
import path from 'path'
import { CronJob } from 'cron'

const lifeTime: number = 1000 * 60 * 10
const tempPath: string = path.resolve(`${__dirname}/../tmp`)
const animationPath: string = path.resolve(
  `${__dirname}/../src/static/animation-img`
)

const workerJob: CronJob = new CronJob({
  cronTime: '*/5 * * * *',
  onTick() {
    removeImages(tempPath)
    removeImages(animationPath)
  },
  start: true
})

function removeImages(targetDir: string): void {
  fs.readdir(
    targetDir,
    (err: NodeJS.ErrnoException | null, files: string[]): void => {
      if (err) {
        console.error(err)
        return
      }

      for (let i: number = 0, len: number = files.length; i < len; i++) {
        const filePath: string = `${targetDir}/${files[i]}`
        fs.stat(filePath, statCallback(filePath))
      }
    }
  )
}

function statCallback(
  filePath: string
): (err: NodeJS.ErrnoException | null, stats: fs.Stats) => void {
  return (err: NodeJS.ErrnoException | null, stats: fs.Stats): void => {
    if (err) {
      console.log(err)
      return
    }

    const now: number = Date.now()

    if (now - stats.birthtimeMs >= lifeTime) {
      fs.unlink(
        filePath,
        (unlinkErr: NodeJS.ErrnoException | null): void => {
          if (unlinkErr) {
            console.error(unlinkErr)
            return
          }

          console.log(`remove: ${filePath}`)
        }
      )
    }
  }
}

workerJob.start()
