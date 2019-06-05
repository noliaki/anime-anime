import { Status } from './Status'

export const signageEvent = {
  identified: 'identified:signage',
  roomStatus: 'roomStatus:signage',
  updatedStatus: 'updatedStatus:Signage',
  joinRoom: 'joinRoom:signage',
  joinedRoom: 'joinedRoom:signage',
  connectController: 'connectController:signage',
  changeFrame: 'changeFrame:signage',
  startStreaming: 'startStreaming:signage',
  startedStreaming: 'startedStreaming:signage',
  pausedStreaming: 'pausedStreaming:signage',
  startGenerating: 'startGenerating:signage',
  doneGenerated: 'doneGenerated:signage',
  shot: 'shot:signage',
  retake: 'retake:signage',
  decided: 'decided:signage',
  error: 'error:signage'
}

export const controllerEvent = {
  identified: 'identified:controller',
  roomStatus: 'roomStatus:controller',
  updatedStatus: 'updatedStatus:controller',
  startStreaming: 'startStreaming:controller',
  error: 'error:controller',
  joinRoom: 'joinRoom:controller',
  joinedRoom: 'joinedRoom:controller',
  changeFrame: 'changeFrame:controller',
  shoot: 'shoot:controller',
  shot: 'shot:controller',
  retake: 'retake:controller',
  retaken: 'retaken:controller',
  decide: 'decide:controller',
  decided: 'decided:controller'
}

export interface Responce {
  status: Status
  roomName: string
  id?: number
  socketId?: string
  fileName?: string
  selectedIndex?: number
}
