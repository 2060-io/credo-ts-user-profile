import { ConnectionRecord, JsonTransformer } from '@aries-framework/core'
import { ConnectionProfile } from './ConnectionProfile'

export const getConnectionProfile = (record: ConnectionRecord) =>
  record.metadata.get('ConnectionProfile')
    ? JsonTransformer.fromJSON(record.metadata.get('ConnectionProfile'), ConnectionProfile)
    : undefined

export const setConnectionProfile = (record: ConnectionRecord, metadata: ConnectionProfile) =>
  record.metadata.add('ConnectionProfile', JsonTransformer.toJSON(metadata))
