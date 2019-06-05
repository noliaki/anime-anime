import Vue from 'vue'
import * as Signage from '@/store/signage'
import * as Controller from '@/store/controller'

declare module 'vue/types/vue' {
  interface Vue {
    $signage: Signage.State
    $controller: Controller.State
  }
}
