import uuid from 'uuid/v1'

export function getUuid(): string {
  return Buffer.from(uuid()).toString('base64')
}
