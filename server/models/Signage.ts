import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

import { Room } from './Room'

@Entity()
export class Signage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number = 0

  @Column({
    type: 'varchar',
    unique: true
  })
  socketId?: string

  @ManyToOne(() => Room, room => room.signages)
  @JoinColumn()
  room?: Room

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
