<template>
  <div>
    <div>
      <button
        type="button"
        class="shadow text-white rounded-full h-32 w-32 flex items-center justify-center border-8 border-purple-300 mx-auto bg-purple-400"
        @click.prevent="onClickShoot"
      >
        SHOOT
      </button>
      <div class="select-frame mt-5 w-full">
        <p class="text-center font-bold py-2">
          select frame
        </p>
        <div class="flex border-b border-t border-purple-200">
          <button
            type="button"
            class="frameBtn text-xs"
            :class="{ 'is-selected': selectedFrameIndex === undefined }"
            @click.prevent="onClickSelectFrame(undefined)"
          >
            no frame
          </button>
          <button
            v-for="(frame, index) in frames"
            :key="`frame-btn-${index}`"
            class="frameBtn border-l border-purple-200"
            :class="{ 'is-selected': selectedFrameIndex === index }"
            :style="`background-image: url(/frame/${frame.files[0]});`"
            type="button"
            @click.prevent="onClickSelectFrame(index)"
          ></button>
        </div>
      </div>
    </div>
    <transition name="confirm">
      <div v-show="isShot" class="confirm">
        <div class="confirm__inner flex">
          <button
            type="button"
            class="border-b-4 border-indigo-700 text-white rounded-full py-3 px-10 flex items-center justify-center mx-auto bg-indigo-400"
            @click.prevent="onClickDecide"
          >
            Make it
          </button>
          <button
            type="button"
            class="border-b-4 border-teal-700 text-white rounded-full py-3 px-10 flex items-center justify-center mx-auto bg-teal-400 ml-5"
            @click.prevent="onClickRetake"
          >
            RETAKE
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Status } from '@@/common/Status'

export default Vue.extend({
  computed: {
    isShot(): boolean {
      return this.$controller.status === Status.Shot
    },
    frames(): any {
      return this.$store.getters['frame/items']
    },
    selectedFrameIndex(): undefined | number {
      return this.$controller.selectedFrameIndex
    }
  },
  methods: {
    onClickSelectFrame(selectedIndex: number | undefined): void {
      this.$store.dispatch('controller/changeFrame', selectedIndex)
    },
    onClickShoot(): void {
      this.$store.dispatch('controller/shoot')
    },
    onClickRetake(): void {
      this.$store.dispatch('controller/retake')
    },
    onClickDecide(): void {
      this.$store.dispatch('controller/decide')
    }
  }
})
</script>
<style scoped>
.confirm {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
}

.confirm__inner {
  margin: auto;
}

.confirm-enter,
.confirm-leave-to {
  opacity: 0;
  transform: scale(1.3);
}

.confirm-enter-to,
.confirm-leave {
  opacity: 1;
  transform: scale(1);
}

.confirm-enter-active,
.confirm-leave-active {
  transition: opacity 300ms linear,
    transform 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.frameBtn {
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 0;
  display: block;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.frameBtn.is-selected {
  background-color: #e9d8fd;
}

.frameBtn + .frameBtn:before {
  content: '';
  display: block;
  width: 100%;
  padding-top: 75%;
}
</style>
