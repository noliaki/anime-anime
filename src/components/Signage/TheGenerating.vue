<template>
  <div class="generating">Generating image...</div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      formNames: ['leftScreen', 'centerScreen', 'rightScreen']
    }
  },
  computed: {
    selectedFrame(): any {
      if (this.selectedFrameIndex === undefined) return undefined

      return this.frames[this.selectedFrameIndex]
    },
    frames(): any {
      return this.$store.getters['frame/items']
    },
    selectedFrameIndex(): number | undefined {
      return this.$signage.selectedFrameIndex
    }
  },
  async mounted(): Promise<void> {
    const res = await this.generate()
    this.$store.dispatch('signage/finishGenerating', res)
  },
  methods: {
    async generate(): Promise<any> {
      const formData: FormData = new FormData()

      for (
        let i: number = 0, len: number = this.formNames.length;
        i < len;
        i++
      ) {
        const blob: Blob | undefined = await this.generateBlob(i)

        if (blob) {
          formData.append(this.formNames[i], blob)
        }
      }

      const json: any = fetch('/api/uploadAndCreate', {
        method: 'POST',
        body: formData
      }).then(res => res.json())

      return json
    },
    async generateBlob(index: number): Promise<Blob | undefined> {
      const canvasEl: HTMLCanvasElement = document.createElement('canvas')
      const context: CanvasRenderingContext2D | null = canvasEl.getContext('2d')
      const screen: HTMLCanvasElement | null = this.$signage.videoScreenCanvas

      if (!context || !screen) {
        return
      }

      canvasEl.width = screen.width
      canvasEl.height = screen.height

      context.save()
      const a: number = index ? (index % 2 ? 1 : -1) : 0
      const scaleOffset: number = (index * 1) / 100
      const rotation: number = (a * (0.5 * Math.PI)) / 180
      const centerX: number = canvasEl.width / 2
      const centerY: number = canvasEl.height / 2

      context.translate(centerX, centerY)
      context.rotate(rotation)
      context.scale(1 + scaleOffset, 1 + scaleOffset)
      context.drawImage(
        this.$signage.videoScreenCanvas as HTMLCanvasElement,
        -centerX,
        -centerY
      )
      const imageData: ImageData = this.toGrayScale(
        context.getImageData(0, 0, canvasEl.width, canvasEl.height)
      )
      context.putImageData(imageData, 0, 0)
      context.restore()
      if (this.selectedFrame) {
        const frame: HTMLImageElement = await this.loadImage(
          `/frame/${this.selectedFrame.files[index]}`
        )
        context.drawImage(frame, 0, 0, canvasEl.width, canvasEl.height)
      }
      const blob: Blob = await this.toBlob(canvasEl)

      return blob
    },
    toGrayScale(imageData: ImageData): ImageData {
      const data: Uint8ClampedArray = imageData.data
      const whiteOffset: number = 50
      const centerVal: number = Math.floor(255 / 2)
      const contrast: number = 3

      for (let i: number = 0, len: number = data.length; i < len; i += 4) {
        const avg: number =
          (data[i] + data[i + 1] + data[i + 2]) / 3 + whiteOffset

        data[i] = data[i + 1] = data[i + 2] =
          avg * contrast + (centerVal - centerVal * contrast)
      }

      return imageData
    },
    loadImage(src: string): Promise<HTMLImageElement> {
      return new Promise(
        (
          resolve: (img: HTMLImageElement) => void,
          reject: (error: any) => void
        ): void => {
          const img: HTMLImageElement = new Image()

          img.addEventListener(
            'load',
            (event: Event): void => {
              console.log(event)
              resolve(img)
            },
            false
          )

          img.addEventListener(
            'error',
            (event: ErrorEvent): void => {
              reject(event)
            }
          )

          img.src = src
        }
      )
    },
    toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
      return new Promise(
        (resolve: (blob: Blob) => void, reject: (err?: any) => void): void => {
          canvas.toBlob(
            (blob: Blob | null): void => {
              console.log(blob)
              if (blob) {
                resolve(blob)
                return
              }

              reject(new Error('can not get blob'))
            },
            'image/jpeg',
            0.8
          )
        }
      )
    }
  }
})
</script>

<style scoped>
.generating {
  width: 200px;
  height: 200px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.generating::before,
.generating::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-width: 3px;
  border-style: solid;
}

.generating::after {
  border-radius: 100% 100% / 120% 200%;
  border-color: #90daff;
  animation: loop 1s linear 0s infinite normal forwards;
}

.generating::before {
  border-radius: 100% 100% / 120% 200%;
  border-color: #90ff99;
  animation: loop 3s linear 0s infinite normal forwards;
}

@keyframes loop {
  0% {
    border-radius: 110% 105% / 100% 100%;
    transform: rotate(0);
  }
  50% {
    border-radius: 95% 110% / 110% 105%;
    transform: rotate(180deg);
  }
  100% {
    border-radius: 110% 105% / 100% 100%;
    transform: rotate(360deg);
  }
}
</style>
