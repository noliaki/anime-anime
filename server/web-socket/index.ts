import * as http from 'http'
import socketIo from 'socket.io'

import addSignageEvent from './Signage'
import addControllerEvent from './Controller'

export function createSocketServer(server: http.Server): void {
  const io: socketIo.Server = socketIo(server)
  addSignageEvent(io)
  addControllerEvent(io)
}
