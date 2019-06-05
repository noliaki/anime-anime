<template>
  <div class="relative shadow-lg">
    <video ref="video" class="video"></video>
    <div class="frame" :style="frameStyle"></div>
    <transition name="flash">
      <div v-show="isPaused" class="flash"></div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Status } from '@@/common/Status'

interface State {
  stream: MediaStream | null
}

export default Vue.extend({
  data(): State {
    return {
      stream: null
    }
  },
  computed: {
    frames(): any {
      return this.$store.getters['frame/items']
    },
    selectedFrame(): any {
      if (this.selectedFrameIndex === undefined) return undefined

      return this.frames[this.selectedFrameIndex]
    },
    frameStyle(): any {
      if (this.selectedFrame === undefined) {
        return ''
      }

      return {
        backgroundImage: `url('/frame/${this.selectedFrame.files[0]}')`
      }
    },
    selectedFrameIndex(): number | undefined {
      return this.$signage.selectedFrameIndex
    },
    isPaused(): boolean {
      return this.$signage.paused
    },
    isDecided(): boolean {
      return this.$signage.decided
    }
  },
  watch: {
    async isPaused(next): Promise<void> {
      console.log('isPaused')
      console.log(next)
      const videoEl: HTMLVideoElement = this.$refs.video as HTMLVideoElement

      if (this.$signage.status > Status.Shot) {
        return
      }

      if (!next) {
        await videoEl.play()
        this.$store.dispatch('signage/startedStream')
      } else {
        videoEl.pause()
        this.$store.dispatch('signage/pausedStream')
      }
    },
    isDecided(next): void {
      if (next) {
        const videoEl: HTMLVideoElement = this.$refs.video as HTMLVideoElement
        this.$store.commit('signage/setVideoImageData', videoEl)
        videoEl.pause()
        this.stream = null
        videoEl.srcObject = null
        this.$store.dispatch('signage/startGenerating')
      }
    }
  },
  deactivated(): void {
    console.log('DEACTIVATED')
    this.stream = null
  },
  async mounted(): Promise<void> {
    const videoEl: HTMLVideoElement = this.$refs.video as HTMLVideoElement
    const videDevices: MediaDeviceInfo[] = await this.getVideoDevices()
    this.stream = await this.getStream({
      video: {
        deviceId: videDevices[0].deviceId
      }
    })
    videoEl.srcObject = this.stream
    await videoEl.play()

    this.$store.dispatch('signage/startedStream')
  },
  methods: {
    getVideoDevices(): Promise<MediaDeviceInfo[]> {
      return navigator.mediaDevices
        .enumerateDevices()
        .then(
          (devices: MediaDeviceInfo[]): MediaDeviceInfo[] =>
            devices.filter(
              (device: MediaDeviceInfo): boolean => device.kind === 'videoinput'
            )
        )
    },
    getStream(constraints: MediaStreamConstraints): Promise<MediaStream> {
      return navigator.mediaDevices.getUserMedia(constraints)
    }
  }
})
</script>

<style scoped>
.video {
  transform: scaleX(-1);
}

.frame {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.flash {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #fff;
  opacity: 0;
}

.flash-enter {
  opacity: 1;
}

.flash-enter-to {
  opacity: 0;
}

.flash-enter-active {
  transition: opacity 700ms linear;
}
</style>
