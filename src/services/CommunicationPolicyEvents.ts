import { CommunicationPolicyRecord } from '../repository/CommunicationPolicyRecord'
import { CommunicationPolicyState } from '../repository/CommunicationPolicyState'
import { BaseEvent } from '@aries-framework/core'

export enum CommunicationPolicyEventTypes {
  StateChanged = 'CommunicationPolicyStateChanged',
}

export interface CommunicationPolicyStateChangedEvent extends BaseEvent {
  type: CommunicationPolicyEventTypes.StateChanged
  payload: {
    communicationPolicyRecord: CommunicationPolicyRecord
    previousState: CommunicationPolicyState | null
  }
}
