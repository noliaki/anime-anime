<template>
  <button
    type="button"
    class="shadow text-white rounded-full h-32 w-32 flex items-center justify-center border-8 border-blue-300 mx-auto bg-blue-400"
    @click.prevent="onClick"
  >
    START
  </button>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    onClick(): void {
      this.$store.dispatch('controller/start')
    }
  }
})
</script>
