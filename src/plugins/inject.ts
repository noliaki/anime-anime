import Vue from 'vue'

if (!('$signage' in Vue.prototype)) {
  Object.defineProperty(Vue.prototype, '$signage', {
    get(this: Vue) {
      return this.$store.state.signage
    }
  })
}

if (!('$controller' in Vue.prototype)) {
  Object.defineProperty(Vue.prototype, '$controller', {
    get(this: Vue) {
      return this.$store.state.controller
    }
  })
}
