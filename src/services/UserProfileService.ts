import { Lifecycle, scoped } from 'tsyringe'
import { CommunicationPolicyRecord } from '../repository/CommunicationPolicyRecord'
import {
  AgentContext,
  ConnectionRecord,
  ConnectionService,
  EventEmitter,
  InboundMessageContext,
} from '@aries-framework/core'
import { UserProfileRepository } from '../repository/UserProfileRepository'
import { UserProfileRecord, UserProfileData } from '../repository/UserProfileRecord'
import { RecordNotFoundError } from '@aries-framework/core'
import { ConnectionAcceptancePolicy } from '../repository/ConnectionAcceptancePolicy'
import {
  ConnectionProfileUpdatedEvent,
  ProfileEventTypes,
  UserProfileRequestedEvent,
  UserProfileUpdatedEvent,
} from './UserProfileEvents'
import { CommunicationPolicyService } from './CommunicationPolicyService'
import { RequestProfileMessage, GetProfileMessageOptions, ProfileMessage, ProfileMessageOptions } from '../messages'
import { getConnectionProfile, setConnectionProfile, UserProfile } from '../model'

@scoped(Lifecycle.ContainerScoped)
export class UserProfileService {
  private userProfileRepository: UserProfileRepository
  private communicationPolicyService: CommunicationPolicyService
  private connectionService: ConnectionService
  private eventEmitter: EventEmitter
  private _userProfileRecord?: UserProfileRecord

  public constructor(
    userProfileRepository: UserProfileRepository,
    communicationPolicyService: CommunicationPolicyService,
    connectionService: ConnectionService,
    eventEmitter: EventEmitter
  ) {
    this.userProfileRepository = userProfileRepository
    this.communicationPolicyService = communicationPolicyService
    this.connectionService = connectionService
    this.eventEmitter = eventEmitter
  }

  /**
   * Update current User Profile Record, persisting it in repository
   *
   * @param props object containing fields to be updated
   *
   * @returns updated User Profile Record
   */
  public async updateUserProfile(agentContext: AgentContext, props: Partial<UserProfileData>) {
    const userProfile = await this.getUserProfile(agentContext)
    const previousUserProfileData = {
      displayName: userProfile.displayName,
      displayPicture: userProfile.displayPicture,
      defaultCommunicationPolicyId: userProfile.defaultCommunicationPolicyId,
    }

    Object.assign(userProfile, props)
    await this.userProfileRepository.update(agentContext, userProfile)
    // Update internal state
    this._userProfileRecord = userProfile

    this.eventEmitter.emit<UserProfileUpdatedEvent>(agentContext, {
      type: ProfileEventTypes.UserProfileUpdated,
      payload: {
        userProfile,
        previousUserProfileData,
      },
    })

    return userProfile
  }

  /**
   * Get user profile. If not exists yet, it creates it with default
   * values.
   *
   * @returns User Profile Record
   */
  public async getUserProfile(agentContext: AgentContext): Promise<UserProfileRecord> {
    if (!this._userProfileRecord) {
      let userProfileRecord = await this.userProfileRepository.findById(
        agentContext,
        this.userProfileRepository.DEFAULT_USER_PROFILE_RECORD
      )

      // If we don't have an user profile record yet, create it
      if (!userProfileRecord) {
        userProfileRecord = new UserProfileRecord({
          id: this.userProfileRepository.DEFAULT_USER_PROFILE_RECORD,
        })

        // Create default communication policy
        const defaultCommPolicy = await this.communicationPolicyService.create(agentContext, {
          displayName: 'default',
          connectionAcceptance: ConnectionAcceptancePolicy.AutoAccept,
          autoSendProfile: false,
        })
        userProfileRecord.defaultCommunicationPolicyId = defaultCommPolicy.id
        await this.userProfileRepository.save(agentContext, userProfileRecord)
      }

      this._userProfileRecord = userProfileRecord
    }
    return this._userProfileRecord
  }

  /**
   * Retrieve default communication policy
   *
   * @throws {RecordNotFoundError} If no record is found
   * @return The communication policy record
   *
   */
  public async getDefaultCommunicationPolicy(agentContext: AgentContext): Promise<CommunicationPolicyRecord> {
    const defaultCommunicationPolicyId = (await this.getUserProfile(agentContext)).defaultCommunicationPolicyId
    if (!defaultCommunicationPolicyId) {
      throw new RecordNotFoundError('Default communication policy not defined', {
        recordType: CommunicationPolicyRecord.type,
      })
    }
    return await this.communicationPolicyService.getById(agentContext, defaultCommunicationPolicyId)
  }

  public async processProfile(messageContext: InboundMessageContext<ProfileMessage>) {
    const connection = messageContext.assertReadyConnection()

    const agentContext = messageContext.agentContext

    let currentProfile = getConnectionProfile(connection)
    const receivedProfile = messageContext.message.profile

    // TODO: use composed objects
    if (currentProfile) {
      Object.assign(currentProfile, receivedProfile)
    } else {
      currentProfile = receivedProfile
    }

    setConnectionProfile(connection, currentProfile ?? {})

    connection.setTags({ type: currentProfile?.type })

    await this.connectionService.update(agentContext, connection)

    this.eventEmitter.emit<ConnectionProfileUpdatedEvent>(agentContext, {
      type: ProfileEventTypes.ConnectionProfileUpdated,
      payload: {
        connection,
        profile: getConnectionProfile(connection) ?? {},
      },
    })

    if (messageContext.message.sendBackYours) {
      return this.createProfileMessageAsReply(agentContext, connection, messageContext.message.threadId)
    }
  }

  public async createProfileMessage(options: ProfileMessageOptions) {
    const message = new ProfileMessage(options)

    return message
  }

  public async createRequestProfileMessage(options: GetProfileMessageOptions) {
    const message = new RequestProfileMessage(options)

    return message
  }

  public async processRequestProfile(messageContext: InboundMessageContext<RequestProfileMessage>) {
    const connection = messageContext.assertReadyConnection()

    const policyId = (connection.getTag('communicationPolicyId') as string) ?? null
    if (policyId) {
      const policy = await this.communicationPolicyService.findById(messageContext.agentContext, policyId)

      if (policy && policy.autoSendProfile) {
        return await this.createProfileMessageAsReply(
          messageContext.agentContext,
          connection,
          messageContext.message.threadId
        )
      }
    }
    this.eventEmitter.emit<UserProfileRequestedEvent>(messageContext.agentContext, {
      type: ProfileEventTypes.UserProfileRequested,
      payload: {
        connection,
        query: messageContext.message.query,
      },
    })
  }

  private async createProfileMessageAsReply(
    agentContext: AgentContext,
    connection: ConnectionRecord,
    threadId: string
  ) {
    const userProfile = await this.getUserProfile(agentContext)
    const profile: UserProfile = {
      displayName: userProfile.displayName,
      displayPicture: userProfile.displayPicture,
      description: userProfile.description,
    }

    const message = this.createProfileMessage({
      profile,
      threadId,
    })

    return message
  }
}
