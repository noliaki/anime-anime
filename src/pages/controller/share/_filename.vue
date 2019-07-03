<template>
  <div class="relative">
    <div class="text-center">
      <img class="shadow-lg mx-auto" :src="imgSrc" alt="" />
    </div>
    <div class="mt-5 max-w-xl mx-auto">
      <textarea
        v-model="text"
        rows="5"
        class="bg-white shadow-md rounded p-3 w-full twitter-share"
      ></textarea>
    </div>
    <div class="text-center mt-3">
      <button
        type="button"
        class="twitter-share-button mx-auto flex items-center justify-center text-white font-bold rounded-full"
        @click.prevent="onClickShare"
      >
        <img src="~/static/twitter-logo.svg" alt="" />
      </button>
    </div>
    <div v-show="isFetching" class="fetching overlay"></div>
    <div v-show="doneFetch" class="result overlay text-center">
      <p v-show="!hasError" class="m-auto">
        Done!!!<br />See
        <a href="https://twitter.com/" target="_blank">https://twitter.com/</a>
      </p>
      <p v-show="hasError" class="m-auto">Error Happened!<br />Sorry...</p>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      text: '',
      isFetching: false,
      hasError: false,
      doneFetch: false
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
      this.isFetching = true

      const result = await fetch('/api/twitter/upload-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
          fileName: this.$route.params.filename,
          text: this.text
        })
      })
        .then(res => res.json())
        .catch(error => error)

      if (result.error) {
        this.hasError = true
      } else {
        this.text = ''
      }

      this.isFetching = false
      this.doneFetch = true
    }
  }
})
</script>
<style scoped>
.overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8);
}

.fetching::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  display: block;
  width: 50px;
  height: 50px;
  border-radius: 999em;
  border: 3px solid #1da1f2;
  border-top-color: #1da0f233;
  animation: loading 0.4s linear 0s infinite normal forwards;
}

.result {
  width: 100%;
  height: 100%;
  display: flex;
}

@keyframes loading {
  to {
    transform: rotate(360deg);
  }
}

.twitter-share {
  border: 2px solid #1da1f2;
}

.twitter-share-button {
  width: 80px;
  height: 80px;
  padding: 10px;
  overflow: hidden;
  background-color: #1da1f2;
}

.twitter-share-button > img {
  width: 100%;
}
</style>
