<template>
  <div class="waiting">
    <div class="waiting__inner">wait response...</div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
<style scoped>
.waiting {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  background-color: rgba(255, 255, 255, 0.8);
}

.waiting__inner {
  position: relative;
  margin: auto;
}

.waiting__inner {
}
</style>
