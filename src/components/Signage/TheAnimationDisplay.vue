<template>
  <div class="relative img-wrapper" :class="{ 'is-loaded': loaded }">
    <img
      :src="animationSrc"
      alt="anime-anime"
      :class="{ 'is-loaded': loaded }"
      @load="onLoad"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      loaded: false
    }
  },
  computed: {
    animationSrc(): string {
      if (!this.$signage.animationFileName) {
        return ''
      }

      return `/animation-img/${this.$signage.animationFileName}`
    }
  },
  methods: {
    onLoad(): void {
      this.loaded = true

      setTimeout((): void => {
        this.$store.dispatch('signage/reset')
      }, 3000)
    }
  }
})
</script>
<style scoped>
.img-wrapper {
  min-width: 300px;
  min-height: 300px;
}

.img-wrapper::after {
  content: '';
  display: block;
  width: 40px;
  height: 40px;
  border: 4px solid #0af;
  border-top-color: rgba(0, 170, 255, 0.2);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-radius: 999em;
  animation: loading 700ms linear 0s infinite;
}

@keyframes loading {
  to {
    transform: rotate(360deg);
  }
}

.img-wrapper.is-loaded::after {
  display: none;
  content: none;
}

img {
  opacity: 0;
  transition: opacity 300ms linear;
}

img.is-loaded {
  opacity: 1;
}
</style>
