<template>
  <div v-show="controllerUrl" class="bg-white">
    <canvas ref="canvas" class="shadow"></canvas>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import QRCode from 'qrcode'

export default Vue.extend({
  computed: {
    controllerUrl(): string | undefined {
      if (process.server || !this.roomName) return

      return `${location.origin}/controller/${encodeURIComponent(
        this.roomName
      )}`
    },
    roomName(): string {
      return this.$signage.roomName || ''
    }
  },
  watch: {
    controllerUrl(): void {
      if (process.server || !this.controllerUrl) return

      this.createQRcode()
    }
  },
  mounted(): void {
    this.createQRcode()
  },
  methods: {
    createQRcode(): Promise<void> | undefined {
      if (process.server || !this.controllerUrl) return

      return new Promise(
        (resolve: () => void, reject: (error?: any) => void): void => {
          QRCode.toCanvas(
            this.$refs.canvas,
            this.controllerUrl as string,
            (error: any): void => {
              if (error) {
                console.log(error)
                reject(error)
                return
              }

              console.log(this.controllerUrl)
              resolve()
            }
          )
        }
      )
    }
  }
})
</script>
