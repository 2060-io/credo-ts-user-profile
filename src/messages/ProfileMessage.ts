import { AgentMessage, Attachment, IsValidMessageType, parseMessageType } from '@aries-framework/core'
import { Expose } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import { UserProfile, UserProfileData } from '../model'

export interface ProfileMessageOptions {
  id?: string
  profile: Partial<UserProfileData>
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
      this.profile = {
        ...options.profile,
        displayPicture: options.profile.displayPicture ? '#displayPicture' : undefined,
        displayIcon: options.profile.displayIcon ? '#displayIcon' : undefined,
      }

      if (options.profile.displayPicture) {
        // If there is a display picture, we need to add an attachment including picture data
        this.addAppendedAttachment(
          new Attachment({
            id: 'displayPicture',
            mimeType: options.profile.displayPicture.mimeType,
            data: {
              base64: options.profile.displayPicture.base64,
              links: options.profile.displayPicture.links,
            },
          })
        )
      }

      if (options.profile.displayIcon) {
        // If there is a display icon, we need to add an attachment including picture data
        this.addAppendedAttachment(
          new Attachment({
            id: 'displayIcon',
            mimeType: options.profile.displayIcon.mimeType,
            data: {
              base64: options.profile.displayIcon.base64,
              links: options.profile.displayIcon.links,
            },
          })
        )
      }

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
