<template>
  <h1>share</h1>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  computed: {
    filename(): string {
      return this.$route.params.filename
    }
  }
})
</script>
