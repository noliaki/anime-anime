import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

import { Status } from '@@/common/Status'
import { getUuid } from '@@/common/helper'

import { Signage } from './Signage'
import { Controller } from './Controller'

@Entity()
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  id?: number

  @Column({
    type: 'varchar',
    unique: true
  })
  name: string

  @OneToMany(() => Signage, signage => signage.room)
  @JoinColumn()
  signages?: Signage

  @OneToMany(() => Controller, controller => controller.room)
  @JoinColumn()
  controllers?: Controller[]

  @Column({
    type: 'int',
    default: Status.SignageReady
  })
  status: Status = Status.SignageReady

  @Column({
    type: 'varchar',
    unique: true,
    default: null
  })
  animationFileName?: string

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  constructor() {
    super()
    this.name = getUuid()
  }
}
