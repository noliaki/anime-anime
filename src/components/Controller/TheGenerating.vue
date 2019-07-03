<template>
  <div class="flex items-center justify-center">
    <div class="generating">Generating image...</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>

<style scoped>
.generating {
  width: 200px;
  height: 200px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.generating::before,
.generating::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-width: 3px;
  border-style: solid;
}

.generating::after {
  border-radius: 100% 100% / 120% 200%;
  border-color: #90daff;
  animation: loop 1s linear 0s infinite normal forwards;
}

.generating::before {
  border-radius: 100% 100% / 120% 200%;
  border-color: #90ff99;
  animation: loop 3s linear 0s infinite normal forwards;
}

@keyframes loop {
  0% {
    border-radius: 110% 105% / 100% 100%;
    transform: rotate(0);
  }
  50% {
    border-radius: 95% 110% / 110% 105%;
    transform: rotate(180deg);
  }
  100% {
    border-radius: 110% 105% / 100% 100%;
    transform: rotate(360deg);
  }
}
</style>
