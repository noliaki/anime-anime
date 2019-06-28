import { Status } from './Status'

export const signageEvent = {
  updatedStatus: 'updatedStatus:Signage',
  joinRoom: 'joinRoom:signage',
  changeFrame: 'changeFrame:signage',
  startStreaming: 'startStreaming:signage',
  startedStreaming: 'startedStreaming:signage',
  startGenerating: 'startGenerating:signage',
  doneGenerated: 'doneGenerated:signage',
  shot: 'shot:signage',
  retake: 'retake:signage',
  decided: 'decided:signage',
  error: 'error:signage'
}

export const controllerEvent = {
  updatedStatus: 'updatedStatus:controller',
  startStreaming: 'startStreaming:controller',
  changeFrame: 'changeFrame:controller',
  shoot: 'shoot:controller',
  retake: 'retake:controller',
  decide: 'decide:controller',
  error: 'error:controller'
}

export interface Responce {
  status: Status
  roomName: string
  id?: number
  socketId?: string
  animationFileName?: string
  selectedIndex?: number
}
