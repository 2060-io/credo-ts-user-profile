import { AgentMessage, IsValidMessageType, parseMessageType } from '@aries-framework/core'
import { Expose } from 'class-transformer'
import { ConnectionProfile } from '../model'

export interface GetProfileMessageOptions {
  id?: string
  threadId?: string
  query?: ConnectionProfileKey[]
}

export type ConnectionProfileKey = keyof ConnectionProfile

export class GetProfileMessage extends AgentMessage {
  public constructor(options?: GetProfileMessageOptions) {
    super()

    if (options) {
      this.id = options.id ?? this.generateId()
      this.query = options.query
      this.setThread({
        threadId: options.threadId,
      })
    }
  }

  @IsValidMessageType(GetProfileMessage.type)
  public readonly type = GetProfileMessage.type.messageTypeUri
  public static readonly type = parseMessageType('https://2060.io/didcomm/user-profile/0.1/get-profile')

  @Expose({ name: 'query' })
  public query?: ConnectionProfileKey[]
}
