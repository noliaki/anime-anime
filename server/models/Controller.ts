import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm'

import { Room } from './Room'

@Entity()
export class Controller extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    type: 'varchar',
    unique: true
  })
  socketId?: string

  @ManyToOne(() => Room, room => room.controllers)
  @JoinColumn()
  room?: Room

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
