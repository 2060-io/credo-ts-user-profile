import { BaseRecord } from '@aries-framework/core'
import { DisplayPictureData } from '../model'
import { v4 as uuid } from 'uuid'

export interface UserProfileData {
  displayName?: string
  displayPicture?: DisplayPictureData
  description?: string
}

export interface UserProfileStorageProps extends UserProfileData {
  id?: string
  createdAt?: Date
}

export class UserProfileRecord extends BaseRecord implements UserProfileStorageProps {
  public displayName?: string
  public displayPicture?: DisplayPictureData
  public description?: string

  public static readonly type = 'UserProfileRecord'
  public readonly type = UserProfileRecord.type

  public constructor(props: UserProfileStorageProps) {
    super()

    if (props) {
      this.id = props.id ?? uuid()
      this.createdAt = props.createdAt ?? new Date()
      this.displayName = props.displayName
      this.displayPicture = props.displayPicture
      this.description = props.description
    }
  }

  public getTags() {
    return {
      ...this._tags,
    }
  }
}
