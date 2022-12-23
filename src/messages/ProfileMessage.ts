import { AgentMessage, IsValidMessageType, parseMessageType } from '@aries-framework/core'
import { Expose } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import { ConnectionProfile } from '../model'

export interface ProfileMessageOptions {
  id?: string
  profile: Partial<ConnectionProfile>
  threadId?: string
  sendBackYours?: boolean
}

export class ProfileMessage extends AgentMessage {
  public constructor(options?: ProfileMessageOptions) {
    super()

    if (options) {
      this.id = options.id ?? this.generateId()
      this.setThread({
        threadId: options.threadId,
      })
      this.profile = options.profile
      this.sendBackYours = options.sendBackYours ?? false
    }
  }

  @IsValidMessageType(ProfileMessage.type)
  public readonly type = ProfileMessage.type.messageTypeUri
  public static readonly type = parseMessageType('https://2060.io/didcomm/user-profile/0.1/profile')

  @Expose({ name: 'profile' })
  public profile?: ConnectionProfile

  @IsOptional()
  @IsBoolean()
  @Expose({ name: 'send_back_yours' })
  public sendBackYours?: boolean
}
