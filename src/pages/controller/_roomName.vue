<template>
  <div>
    <transition name="component" mode="out-in">
      <component :is="scene"></component>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TheWaiting from '~/components/Controller/TheWaiting.vue'
import TheReady from '~/components/Controller/TheReady.vue'
import TheConnectingSignage from '~/components/Controller/TheConnectingSignage.vue'
import TheOperation from '~/components/Controller/TheOperation.vue'
import TheGenerating from '~/components/Controller/TheGenerating.vue'
import TheAnimationDisplay from '~/components/Controller/TheAnimationDisplay.vue'
import TheError from '~/components/Controller/TheError.vue'

export default Vue.extend({
  components: {
    TheWaiting,
    TheReady,
    TheConnectingSignage,
    TheOperation,
    TheGenerating,
    TheAnimationDisplay,
    TheError
  },
  computed: {
    scene(): string {
      return this.$store.getters['controller/scene']
    },
    waitResponse(): boolean {
      return this.$controller.waitResponse
    }
  },
  mounted(): void {
    this.$store.commit('controller/setRoomName', this.$route.params.roomName)
    this.$store.dispatch('controller/initIo')
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
