<template>
  <div>
    <transition name="component" mode="out-in">
      <component :is="scene"></component>
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import TheQRcode from '~/components/Signage/TheQRcode.vue'
import TheStream from '~/components/Signage/TheStream.vue'
import TheWaiting from '~/components/Signage/TheWaiting.vue'
import TheAnimationDisplay from '~/components/Signage/TheAnimationDisplay.vue'
import TheGenerating from '~/components/Signage/TheGenerating.vue'

export default Vue.extend({
  components: {
    TheQRcode,
    TheStream,
    TheWaiting,
    TheAnimationDisplay,
    TheGenerating
  },
  computed: {
    scene(): string {
      return this.$store.getters['signage/scene']
    }
  },
  mounted(): void {
    this.$store.dispatch('signage/initIo')
  }
})
</script>
<style scoped>
.component-enter,
.component-leave-to {
  opacity: 0;
  transform: scale(1.3);
}

.component-leave,
.component-enter-to {
  opacity: 1;
  transform: scale(1);
}

.component-enter-active,
.component-leave-active {
  pointer-events: none;
  transition: opacity 300ms linear,
    transform 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
</style>
