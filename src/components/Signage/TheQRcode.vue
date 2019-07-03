<template>
  <div>
    <div v-show="controllerUrl" class="text-center">
      <a :href="controllerUrl" target="_blank">
        <canvas ref="canvas" class="shadow mx-auto"></canvas>
      </a>
    </div>

    <div
      class="max-w-xl mx-auto bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md mt-8"
      role="alert"
    >
      <ol class="list-decimal pl-4">
        <li>Read the above QR code with your smartphone</li>
        <li>[Smartphone] Tap the "START" button to connect</li>
        <li>The camera starts up</li>
        <li>Select a frame on your smartphone and tap the "SHOOT" button</li>
        <li>
          Tap the "Make it" button or tap the "RETAKE" button if you want to
          retake
        </li>
        <li>And then generate a animation image</li>
      </ol>
      <p class="font-bold mt-3">
        ※ The taken image and animation image will be deleted in 10 minutes
      </p>
    </div>
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
<style scoped>
a {
  display: inline-block;
}
</style>
