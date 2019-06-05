<template>
  <div class="waiting">
    <div class="waiting__wapper">
      <div class="waiting__inner">waiting...</div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
<style scoped>
.waiting {
  position: relative;
  width: 10em;
  height: 10em;
  background-color: transparent;
  font-weight: bold;
  font-size: 1.5em;
}

.waiting__wapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.waiting::before,
.waiting::after,
.waiting__wapper::before,
.waiting__wapper::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: transparent;
  /* mix-blend-mode: darken; */
  opacity: 0.9;
}

.waiting::before {
  border-radius: 100% 100% / 120% 200%;
  background-color: #90daff;
  animation: loop 1s linear 0s infinite normal forwards;
}

.waiting::after {
  border-radius: 120% 100% / 60% 200%;
  background-color: #d5f1ff;
  animation: loop 2s linear 0s infinite reverse forwards;
}
.waiting__wapper::before {
  border-radius: 100% 100% / 120% 200%;
  background-color: #90ff99;
  animation: loop 3s linear 0s infinite normal forwards;
}

.waiting__wapper::after {
  border-radius: 120% 100% / 60% 200%;
  background-color: #d8d5ff;
  animation: loop 4s linear 0s infinite reverse forwards;
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

.waiting__inner {
  margin: auto;
  position: relative;
  background-color: transparent;
  z-index: 1;
}
</style>
