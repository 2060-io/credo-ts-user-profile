import { BaseRecord } from '@aries-framework/core'
import { v4 as uuid } from 'uuid'
import { CommunicationPolicyState } from './CommunicationPolicyState'
import { ConnectionAcceptancePolicy } from './ConnectionAcceptancePolicy'

export interface CommunicationPolicyBaseProps {
  displayName?: string
  state?: CommunicationPolicyState
  lifeTime?: number
  allowChats?: boolean
  allowVideoCalls?: boolean
  allowAudioCalls?: boolean
  connectionAcceptance?: ConnectionAcceptancePolicy
  autoSendProfile?: boolean
}

export interface CommunicationPolicyStorageProps extends CommunicationPolicyBaseProps {
  id?: string
  createdAt?: Date
}

export class CommunicationPolicyRecord extends BaseRecord implements CommunicationPolicyStorageProps {
  public displayName!: string
  public lifeTime!: number
  public allowChats!: boolean
  public allowVideoCalls!: boolean
  public allowAudioCalls!: boolean
  public connectionAcceptance!: ConnectionAcceptancePolicy
  public autoSendProfile!: boolean
  public state!: CommunicationPolicyState

  public static readonly type = 'CommunicationPolicyRecord'
  public readonly type = CommunicationPolicyRecord.type

  public constructor(props: CommunicationPolicyStorageProps) {
    super()

    if (props) {
      this.id = props.id ?? uuid()
      this.state = props.state ?? CommunicationPolicyState.Init
      this.createdAt = props.createdAt ?? new Date()
      this.displayName = props.displayName || ''
      this.lifeTime = props.lifeTime || 24 * 60
      this.allowChats = props.allowChats || true
      this.allowVideoCalls = props.allowVideoCalls || false
      this.allowAudioCalls = props.allowAudioCalls || false
      this.autoSendProfile = props.autoSendProfile || true
      this.connectionAcceptance = props.connectionAcceptance || ConnectionAcceptancePolicy.AutoAccept
    }
  }

  public getTags() {
    return {
      ...this._tags,
    }
  }
}
