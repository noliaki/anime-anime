<template>
  <div class="wait">
    <div class="wait__wrapper">
      <div class="wait__inner">
        <span>wait</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({})
</script>
<style scoped>
.wait {
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8);
}

.wait__wrapper {
  margin: auto;
  position: relative;
  width: 8em;
  height: 8em;
  border-color: transparent;
  font-size: 1.5em;
}

.wait__inner {
  display: flex;
  width: 100%;
  height: 100%;
}

.wait__wrapper::before,
.wait__wrapper::after,
.wait__inner::before,
.wait__inner::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-color: transparent;
  /* mix-blend-mode: darken; */
  border-width: 3px;
  border-style: solid;
  opacity: 0.9;
}

.wait__wrapper::before {
  border-radius: 100% 100% / 120% 200%;
  border-color: #90daff;
  animation: loop 1s linear 0s infinite normal forwards;
}

.wait__wrapper::after {
  border-radius: 120% 100% / 60% 200%;
  border-color: #d5f1ff;
  animation: loop 2s linear 0s infinite reverse forwards;
}
.wait__inner::before {
  border-radius: 100% 100% / 120% 200%;
  border-color: #90ff99;
  animation: loop 3s linear 0s infinite normal forwards;
}

.wait__inner::after {
  border-radius: 120% 100% / 60% 200%;
  border-color: #d8d5ff;
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

span {
  margin: auto;
}
</style>
