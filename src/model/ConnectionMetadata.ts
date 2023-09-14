import { ConnectionRecord } from '@aries-framework/core'
import { UserProfileData } from '../model'

export const getConnectionProfile = (record: ConnectionRecord) =>
  record.metadata.get('UserProfile') as UserProfileData | null

export const setConnectionProfile = (record: ConnectionRecord, metadata: UserProfileData) =>
  record.metadata.add('UserProfile', metadata)
