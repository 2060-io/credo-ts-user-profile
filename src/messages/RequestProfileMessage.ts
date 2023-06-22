import { AgentMessage, IsValidMessageType, parseMessageType } from '@aries-framework/core'
import { Expose } from 'class-transformer'
import { UserProfile } from '../model'

export interface GetProfileMessageOptions {
  id?: string
  threadId?: string
  query?: ConnectionProfileKey[]
}

export type ConnectionProfileKey = keyof UserProfile

export class RequestProfileMessage extends AgentMessage {
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

  @IsValidMessageType(RequestProfileMessage.type)
  public readonly type = RequestProfileMessage.type.messageTypeUri
  public static readonly type = parseMessageType('https://didcomm.org/user-profile/1.0/request-profile')

  public query?: ConnectionProfileKey[]
}
