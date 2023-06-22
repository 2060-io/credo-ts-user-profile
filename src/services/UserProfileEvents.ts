import { BaseEvent, ConnectionRecord } from '@aries-framework/core'
import { UserProfile } from '../model'
import { ConnectionProfileKey } from '../messages'
import { UserProfileData, UserProfileRecord } from '../repository'

export enum ProfileEventTypes {
  UserProfileUpdated = 'UserProfileUpdated',
  UserProfileRequested = 'UserProfileRequested',
  ConnectionProfileUpdated = 'ConnectionProfileUpdated',
}

export interface UserProfileRequestedEvent extends BaseEvent {
  type: ProfileEventTypes.UserProfileRequested
  payload: {
    connection: ConnectionRecord
    query?: ConnectionProfileKey[]
  }
}

export interface UserProfileUpdatedEvent extends BaseEvent {
  type: ProfileEventTypes.UserProfileUpdated
  payload: {
    userProfile: UserProfileRecord
    previousUserProfileData: UserProfileData
  }
}

export interface ConnectionProfileUpdatedEvent extends BaseEvent {
  type: ProfileEventTypes.ConnectionProfileUpdated
  payload: {
    profile: UserProfile
    connection: ConnectionRecord
  }
}
