<template>
  <button type="button" @click.prevent="onClick">Start</button>
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
