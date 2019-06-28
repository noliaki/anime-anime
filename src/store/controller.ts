import { MutationTree, ActionTree, GetterTree } from 'vuex'
import io from 'socket.io-client'
import { Status } from '@@/common/Status'
import { controllerEvent } from '@@/common/EventName'

// 😜
let controllerIo: SocketIOClient.Socket

export interface State {
  socketId?: string
  roomName?: string
  status?: Status
  waitResponse: boolean
  animationFileName?: string
}

export const state: () => State = (): State => ({
  socketId: undefined,
  roomName: undefined,
  status: Status.SignageReady,
  waitResponse: false,
  animationFileName: undefined
})

export const getters: GetterTree<State, null> = {
  scene({ status }): string {
    switch (status) {
      case Status.SignageReady:
        return 'TheReady'

      case Status.ControllerReady:
        return 'TheConnectingSignage'
      // case Status.StartStreaming:
      //   return 'TheBeforeStart'

      case Status.Streaming:
      case Status.Shot:
        return 'TheOperation'

      case Status.StartGenerating:
      case Status.ImageGenerating:
        return 'TheGenerating'

      case Status.FinishGenerating:
        return 'TheAnimationDisplay'

      default:
        return 'TheWaiting'
    }
  }
}

export const mutations: MutationTree<State> = {
  updatedStatus(state: State, data: any): void {
    if (data.roomName) {
      state.roomName = data.roomName
    }

    if (data.animationFileName) {
      console.log(data.animationFileName)
      state.animationFileName = data.animationFileName
    }

    state.status = data.status
  },
  setRoomName(state: State, roomName: string): void {
    console.log(roomName)
    state.roomName = roomName
  },
  startRequest(state: State): void {
    state.waitResponse = true
  },
  recieveRequest(state: State): void {
    state.waitResponse = false
  }
}

export const actions: ActionTree<State, null> = {
  initIo({ commit }): void {
    controllerIo = io('/controller')
    controllerIo.on(
      'connect',
      (): void => {
        controllerIo
          .on(
            controllerEvent.updatedStatus,
            (data: any): void => {
              console.log(controllerEvent.updatedStatus)
              console.log(data)
              commit('updatedStatus', data)
              commit('recieveRequest')

              if (data.status === Status.FinishGenerating) {
                controllerIo.close()
              }
            }
          )
          .on(
            controllerEvent.changeFrame,
            (data: any): void => {
              console.log(data)
              commit('recieveRequest')
            }
          )
      }
    )
  },
  start({ commit, state }): void {
    if (state.waitResponse) return

    commit('startRequest')
    controllerIo.emit(controllerEvent.startStreaming, {
      roomName: state.roomName
    })
  },
  changeFrame({ commit, state }, selectedIndex: number): void {
    if (state.waitResponse) return

    commit('startRequest')
    controllerIo.emit(controllerEvent.changeFrame, {
      roomName: state.roomName,
      selectedIndex
    })
  },
  shoot({ commit, state }): void {
    if (state.waitResponse) return

    commit('startRequest')
    controllerIo.emit(controllerEvent.shoot, {
      roomName: state.roomName,
      socketId: state.socketId
    })
  },
  retake({ commit, state }): void {
    if (state.waitResponse) return

    commit('startRequest')
    controllerIo.emit(controllerEvent.retake, {
      roomName: state.roomName,
      socketId: state.socketId
    })
  },
  decide({ commit, state }): void {
    if (state.waitResponse) return

    commit('startRequest')
    controllerIo.emit(controllerEvent.decide, {
      roomName: state.roomName,
      socketId: state.socketId
    })
  },
  disconnect(): void {
    controllerIo.close()
  }
}
