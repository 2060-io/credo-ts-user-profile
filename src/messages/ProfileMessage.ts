import { AgentMessage, IsValidMessageType, parseMessageType } from '@aries-framework/core'
import { Expose } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import { UserProfile } from '../model'

export interface ProfileMessageOptions {
  id?: string
  profile: Partial<UserProfile>
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
  public static readonly type = parseMessageType('https://didcomm.org/user-profile/1.0/profile')

  public profile!: UserProfile

  @IsOptional()
  @IsBoolean()
  @Expose({ name: 'send_back_yours' })
  public sendBackYours?: boolean
}
