import { ConnectionRecord, JsonTransformer } from '@aries-framework/core'
import { UserProfile } from './UserProfile'

export const getConnectionProfile = (record: ConnectionRecord) =>
  record.metadata.get('UserProfile')
    ? JsonTransformer.fromJSON(record.metadata.get('UserProfile'), UserProfile)
    : undefined

export const setConnectionProfile = (record: ConnectionRecord, metadata: UserProfile) =>
  record.metadata.add('UserProfile', JsonTransformer.toJSON(metadata))
