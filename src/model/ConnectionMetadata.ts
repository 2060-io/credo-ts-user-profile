import { ConnectionRecord } from '@aries-framework/core'
import { UserProfileData } from '../repository'

export const getConnectionProfile = (record: ConnectionRecord) => record.metadata.get('UserProfile') as UserProfileData

export const setConnectionProfile = (record: ConnectionRecord, metadata: UserProfileData) =>
  record.metadata.add('UserProfile', metadata)
