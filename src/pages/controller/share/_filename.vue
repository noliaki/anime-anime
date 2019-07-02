<template>
  <div>
    <div class="text-center">
      <img class="shadow-lg" :src="imgSrc" alt="" />
    </div>
    <div class="mt-5">
      <textarea
        v-model="text"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full border border-teal-500"
      ></textarea>
    </div>
    <div class="text-center">
      <button
        type="button"
        class="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full"
        @click.prevent="onClickShare"
      >
        Share
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      text: ''
    }
  },
  computed: {
    filename(): string {
      return `${this.$route.params.filename}.gif`
    },
    imgSrc(): string {
      return `/animation-img/${this.filename}`
    }
  },
  methods: {
    async onClickShare(): Promise<void> {
      const result = await fetch('/api/twitter/upload-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          fileName: this.$route.params.filename,
          text: encodeURIComponent(this.text)
        })
      }).then(res => {
        console.log(res)
        return res.json()
      })

      console.log(result)
    }
  }
})
</script>
