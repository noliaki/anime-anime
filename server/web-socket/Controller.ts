import socketIo from 'socket.io'
import { getRepository } from 'typeorm'
import { signageEvent, controllerEvent, Responce } from '@@/common/EventName'
import { Status } from '@@/common/Status'
import { Controller } from '../models/Controller'
import { Room } from '../models/Room'
import { signageNameSpace } from './Signage'

export const controllerNameSpace: string = '/controller'

let io: socketIo.Server

export default (socketIoServer: socketIo.Server): void => {
  io = socketIoServer
  io.of(controllerNameSpace).on('connect', onConnect)
}

async function onConnect(socket: socketIo.Socket): Promise<void> {
  const controller: Controller = new Controller()
  controller.socketId = socket.id
  await controller.save()

  socket
    // .on(controllerEvent.joinRoom, onJoinRoom(socket))
    .on(controllerEvent.startStreaming, onStartStreaming(socket))
    .on(controllerEvent.changeFrame, onChangeFrame(socket))
    .on(controllerEvent.shoot, onShoot(socket))
    .on(controllerEvent.retake, onRetake(socket))
    .on(controllerEvent.decide, onDecide(socket))

  socket.emit(controllerEvent.identified, {
    id: controller.id,
    socketId: controller.socketId
  })
}

// function onJoinRoom(socket: socketIo.Socket): (data: any) => Promise<void> {
//   return async (data: any): Promise<void> => {
//     const controller: Controller | undefined = await getController({
//       socketId: socket.id
//     })

//     const room: Room | undefined = await getRepository(Room).findOne({
//       where: {
//         name: data.roomName
//       }
//     })

//     if (!room || !controller) {
//       socket.emit(controllerEvent.error, {
//         message: 'controller or room is not found'
//       })

//       return
//     }

//     socket.join(room.name)
//     controller.room = room
//     await controller.save()
//     console.log('success save controller')

//     if (room.status !== Status.SignageReady) {
//       console.log(`room status is not Created: ${Status[room.status]}`)
//       socket.emit(controllerEvent.updatedStatus, {
//         status: room.status
//       })

//       return
//     }

//     room.status = Status.ControllerReady
//     await room.save()

//     const res: Responce = {
//       roomName: room.name,
//       status: room.status
//     }

//     io.of(controllerNameSpace)
//       .in(room.name)
//       .emit(controllerEvent.updatedStatus, res)

//     io.of(signageNameSpace)
//       .in(room.name)
//       .emit(controllerEvent.updatedStatus, res)
//   }
// }

function onStartStreaming(
  socket: socketIo.Socket
): (data: any) => Promise<void> {
  return async (data: any): Promise<void> => {
    const controller: Controller | undefined = await getController({
      socketId: socket.id
    })

    const room: Room | undefined = await getRepository(Room).findOne({
      where: {
        name: data.roomName
      }
    })

    if (!(controller && room)) {
      socket.emit(controllerEvent.error, {
        message: 'controller is not found'
      })

      return
    }

    socket.join(room.name)
    controller.room = room
    await controller.save()

    if (room.status !== Status.SignageReady) {
      socket.emit(controllerEvent.updatedStatus, {
        status: room.status
      })

      return
    }

    room.status = Status.ControllerReady
    await room.save()

    const res: Responce = {
      roomName: controller.room.name,
      status: controller.room.status
    }

    io.of(signageNameSpace)
      .in(controller.room.name)
      .emit(signageEvent.updatedStatus, res)

    io.of(controllerNameSpace)
      .in(controller.room.name)
      .emit(controllerEvent.updatedStatus, res)
  }
}

function onShoot(socket: socketIo.Socket): (data: any) => Promise<void> {
  return async (): Promise<void> => {
    const controller: Controller | undefined = await getController({
      socketId: socket.id
    })

    console.log('onShoot')
    console.log(controller)

    if (!(controller && controller.room)) {
      socket.emit(controllerEvent.error, {
        message: 'controller or room is nor found'
      })

      return
    }

    if (controller.room.status !== Status.Streaming) {
      socket.emit(controllerEvent.updatedStatus, {
        status: controller.room.status
      })

      return
    }

    const res: Responce = {
      roomName: controller.room.name,
      status: controller.room.status
    }

    io.of(signageNameSpace)
      .to(controller.room.name)
      .emit(signageEvent.shot, res)
  }
}

function onRetake(socket: socketIo.Socket): (data: any) => Promise<void> {
  return async (): Promise<void> => {
    const controller: Controller | undefined = await getController({
      socketId: socket.id
    })

    if (!controller || !controller.room) {
      socket.emit(controllerEvent.error, {
        message: 'controller is not found'
      })

      return
    }

    if (controller.room.status !== Status.Shot) {
      socket.emit(controllerEvent.updatedStatus, {
        status: controller.room.status
      })

      return
    }

    const res: Responce = {
      roomName: controller.room.name,
      status: controller.room.status
    }

    io.of(signageNameSpace)
      .to(controller.room.name)
      .emit(signageEvent.retake, res)
  }
}

function onDecide(socket: socketIo.Socket) {
  return async (): Promise<void> => {
    const controller: Controller | undefined = await getController({
      socketId: socket.id
    })

    console.log('onDecide')
    console.log(controller)

    if (!(controller && controller.room)) {
      socket.emit(controllerEvent.error, {
        message: 'controller is not found'
      })

      return
    }

    if (controller.room.status !== Status.Shot) {
      socket.emit(controllerEvent.updatedStatus, {
        status: controller.room.status
      })

      return
    }

    const res: Responce = {
      roomName: controller.room.name,
      status: controller.room.status
    }

    io.of(signageNameSpace)
      .in(controller.room.name)
      .emit(signageEvent.decided, res)
  }
}

function onChangeFrame(socket: socketIo.Socket): (data: any) => Promise<void> {
  return async (data: any): Promise<void> => {
    const controller: Controller | undefined = await getController({
      socketId: socket.id
    })

    if (!(controller && controller.room)) {
      socket.emit(controllerEvent.error, {
        message: 'controller is not found'
      })

      return
    }

    const roomName: string = controller.room.name

    io.of(signageNameSpace)
      .in(roomName)
      .emit(signageEvent.changeFrame, {
        selectedIndex: data.selectedIndex
      })

    io.of(controllerNameSpace)
      .in(roomName)
      .emit(controllerEvent.changeFrame, {
        selectedIndex: data.selectedIndex
      })
  }
}

function getController(whereOption: any): Promise<Controller | undefined> {
  return getRepository(Controller).findOne({
    relations: ['room'],
    where: whereOption
  })
}
