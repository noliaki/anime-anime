import socketIo from 'socket.io'
import { getRepository } from 'typeorm'

import { signageEvent, Responce, controllerEvent } from '@@/common/EventName'
import { Status } from '@@/common/Status'
import { Room } from '../models/Room'
import { Signage } from '../models/Signage'
import { controllerNameSpace } from './Controller'

export const signageNameSpace: string = '/signage'
let io: socketIo.Server
let signageIo: socketIo.Namespace

export default (socketIoServer: socketIo.Server): void => {
  io = socketIoServer
  signageIo = io.of(signageNameSpace)
  signageIo.on('connect', onConnect)
}

async function onConnect(socket: socketIo.Socket): Promise<void> {
  const signage: Signage = new Signage()
  signage.socketId = socket.id
  await signage.save()

  const room: Room = new Room()
  room.status = Status.SignageReady
  await room.save()

  signage.room = room
  await signage.save()

  socket.join(room.name)

  socket
    .on(signageEvent.joinRoom, onJoinRoom(socket))
    .on(signageEvent.startedStreaming, onStartedStreaming(socket))
    .on(signageEvent.pausedStreaming, onPausedStreaming(socket))
    .on(signageEvent.startGenerating, onStartGenerating(socket))
    .on(signageEvent.doneGenerated, onDoneGenerated(socket))

  const res: Responce = {
    id: signage.id,
    socketId: signage.socketId,
    status: room.status,
    roomName: room.name
  }

  socket.emit(signageEvent.identified, res)
}

function onJoinRoom(socket: socketIo.Socket): () => Promise<void> {
  return async (): Promise<void> => {
    console.log('onJoinRoom')
    const signage: Signage | undefined = await getRepository(Signage).findOne({
      relations: ['room'],
      where: {
        socketId: socket.id
      }
    })

    console.log(signage)

    if (!signage) {
      socket.emit(signageEvent.error, {
        message: 'signage is not found'
      })

      return
    }

    const room: Room = new Room()
    room.status = Status.SignageReady
    await room.save()
    console.log('room save OK')

    signage.room = room
    await signage.save()
    console.log('signage save OK')

    socket.join(room.name)

    const res: Responce = {
      roomName: room.name,
      status: room.status
    }

    socket.emit(signageEvent.updatedStatus, res)
  }
}

function onStartedStreaming(
  socket: socketIo.Socket
): (data: any) => Promise<void> {
  return async (): Promise<void> => {
    console.log('onStartedStreaming')
    const signage: Signage | undefined = await getRepository(Signage).findOne({
      relations: ['room'],
      where: {
        socketId: socket.id
      }
    })
    console.log(signage)

    if (!(signage && signage.room)) {
      socket.emit(signageEvent.error, {
        message: 'signage or room is not found'
      })

      return
    }

    if (
      signage.room.status !== Status.ControllerReady &&
      signage.room.status !== Status.Shot
    ) {
      socket.emit(signageEvent.roomStatus, {
        status: signage.room.status
      })

      return
    }

    signage.room.status = Status.Streaming
    await signage.room.save()

    const res: Responce = {
      roomName: signage.room.name,
      status: signage.room.status
    }

    socket.emit(signageEvent.updatedStatus, res)

    io.of(controllerNameSpace)
      .in(signage.room.name)
      .emit(controllerEvent.updatedStatus, res)
  }
}

function onPausedStreaming(socket: socketIo.Socket): () => Promise<void> {
  return async (): Promise<void> => {
    const signage: Signage | undefined = await getRepository(Signage).findOne({
      relations: ['room'],
      where: {
        socketId: socket.id
      }
    })

    if (!(signage && signage.room)) {
      socket.emit(signageEvent.error, {
        message: 'signage is not found'
      })

      return
    }

    signage.room.status = Status.Shot
    await signage.room.save()

    const res: Responce = {
      roomName: signage.room.name,
      status: signage.room.status
    }

    io.of(signageNameSpace)
      .in(signage.room.name)
      .emit(signageEvent.updatedStatus, res)

    io.of(controllerNameSpace)
      .in(signage.room.name)
      .emit(controllerEvent.updatedStatus, res)
  }
}

function onStartGenerating(socket: socketIo.Socket): () => Promise<void> {
  return async (): Promise<void> => {
    const signage: Signage | undefined = await getRepository(Signage).findOne({
      relations: ['room'],
      where: {
        socketId: socket.id
      }
    })

    if (!(signage && signage.room)) {
      socket.emit(signageEvent.error, {
        message: 'signage is not found'
      })

      return
    }

    signage.room.status = Status.ImageGenerating
    await signage.room.save()

    const res: Responce = {
      roomName: signage.room.name,
      status: signage.room.status
    }

    io.of(signageNameSpace)
      .in(signage.room.name)
      .emit(signageEvent.updatedStatus, res)

    io.of(controllerNameSpace)
      .in(signage.room.name)
      .emit(controllerEvent.updatedStatus, res)
  }
}

function onDoneGenerated(
  socket: socketIo.Socket
): (data: any) => Promise<void> {
  return async (data: any): Promise<void> => {
    const signage: Signage | undefined = await getRepository(Signage).findOne({
      relations: ['room'],
      where: {
        socketId: socket.id
      }
    })

    if (!(signage && signage.room)) {
      socket.emit(signageEvent.error, {
        message: 'signage is not found'
      })

      return
    }

    signage.room.status = Status.imageGenerated
    await signage.room.save()

    const res: Responce = {
      roomName: signage.room.name,
      status: signage.room.status,
      fileName: data.fileName
    }

    io.of(signageNameSpace)
      .in(signage.room.name)
      .emit(signageEvent.updatedStatus, res)

    io.of(controllerNameSpace)
      .in(signage.room.name)
      .emit(controllerEvent.updatedStatus, res)
  }
}
