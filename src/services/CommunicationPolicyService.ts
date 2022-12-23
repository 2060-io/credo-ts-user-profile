import { Lifecycle, scoped } from 'tsyringe'
import { CommunicationPolicyBaseProps, CommunicationPolicyRecord } from '../repository/CommunicationPolicyRecord'
import { AgentContext, EventEmitter } from '@aries-framework/core'
import { CommunicationPolicyRepository } from '../repository/CommunicationPolicyRepository'
import { CommunicationPolicyEventTypes, CommunicationPolicyStateChangedEvent } from './CommunicationPolicyEvents'
import { CommunicationPolicyState } from '../repository/CommunicationPolicyState'

@scoped(Lifecycle.ContainerScoped)
export class CommunicationPolicyService {
  private communicationPolicyRepository: CommunicationPolicyRepository
  private eventEmitter: EventEmitter

  public constructor(communicationPolicyRepository: CommunicationPolicyRepository, eventEmitter: EventEmitter) {
    this.communicationPolicyRepository = communicationPolicyRepository
    this.eventEmitter = eventEmitter
  }

  /** Create and persist a new communication policy record based on properties
   *
   * @param props new record properties
   *
   * @returns newly created record
   */
  public async create(agentContext: AgentContext, props: CommunicationPolicyBaseProps) {
    const record = new CommunicationPolicyRecord({ ...props, state: CommunicationPolicyState.Init })
    await this.communicationPolicyRepository.save(agentContext, record)

    this.eventEmitter.emit<CommunicationPolicyStateChangedEvent>(agentContext, {
      type: CommunicationPolicyEventTypes.StateChanged,
      payload: { communicationPolicyRecord: record, previousState: null },
    })

    return record
  }

  /** Update and persist an existing communication policy record. Only fields defined in props
   * are changed.
   *
   * @param props fields to update
   *
   * @return updated record
   */
  public async update(
    agentContext: AgentContext,
    communicationPolicyRecord: CommunicationPolicyRecord,
    props: CommunicationPolicyBaseProps
  ) {
    Object.assign(communicationPolicyRecord, props)
    await this.communicationPolicyRepository.update(agentContext, communicationPolicyRecord)

    return communicationPolicyRecord
  }

  /**
   * Delete a communication policy
   *
   */
  public async delete(agentContext: AgentContext, communicationPolicyRecord: CommunicationPolicyRecord) {
    await this.communicationPolicyRepository.delete(agentContext, communicationPolicyRecord)
  }

  /**
   * Retrieve all communication policy records
   *
   * @returns List containing all communication policy records
   */
  public getAll(agentContext: AgentContext): Promise<CommunicationPolicyRecord[]> {
    return this.communicationPolicyRepository.getAll(agentContext)
  }

  /**
   * Retrieve a communication policy record by id
   *
   * @param communicationPolicyRecordId The communication policy record id
   * @throws {RecordNotFoundError} If no record is found
   * @return The communication policy record
   *
   */
  public getById(agentContext: AgentContext, communicationPolicyRecordId: string): Promise<CommunicationPolicyRecord> {
    return this.communicationPolicyRepository.getById(agentContext, communicationPolicyRecordId)
  }

  /**
   * Find a communication policy record by id
   *
   * @param communicationPolicyRecordId the communication policy record id
   * @returns The communication policy record or null if not found
   */
  public findById(
    agentContext: AgentContext,
    communicationPolicyRecordId: string
  ): Promise<CommunicationPolicyRecord | null> {
    return this.communicationPolicyRepository.findById(agentContext, communicationPolicyRecordId)
  }

  /**
   * Delete a communication policy record by id
   *
   * @param communicationPolicyId the communication policy record id
   */
  public async deleteById(agentContext: AgentContext, communicationPolicyId: string) {
    const communicationPolicyRecord = await this.getById(agentContext, communicationPolicyId)
    return this.communicationPolicyRepository.delete(agentContext, communicationPolicyRecord)
  }

  /**
   * Update the record to a new state and emit an state changed event. Also updates the record
   * in storage.
   *
   * @param communicationPolicyRecord The proof record to update the state for
   * @param newState The state to update to
   *
   */
  public async updateState(
    agentContext: AgentContext,
    communicationPolicyRecord: CommunicationPolicyRecord,
    newState: CommunicationPolicyState
  ) {
    const previousState = communicationPolicyRecord.state
    communicationPolicyRecord.state = newState
    await this.communicationPolicyRepository.update(agentContext, communicationPolicyRecord)

    this.eventEmitter.emit<CommunicationPolicyStateChangedEvent>(agentContext, {
      type: CommunicationPolicyEventTypes.StateChanged,
      payload: { communicationPolicyRecord, previousState: previousState },
    })
  }
}
