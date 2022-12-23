import {
  ConnectionService,
  injectable,
  Dispatcher,
  MessageSender,
  AgentContext,
  ConnectionRecord,
  OutboundMessageContext,
} from '@aries-framework/core'
import { ProfileHandler, GetProfileHandler } from './handlers'
import { ConnectionType } from './model'
import { CommunicationPolicyBaseProps, CommunicationPolicyRecord, UserProfileData } from './repository'
import { UserProfileService } from './services'
import { CommunicationPolicyService } from './services/CommunicationPolicyService'

@injectable()
export class UserProfileApi {
  private messageSender: MessageSender
  private userProfileService: UserProfileService
  private connectionService: ConnectionService
  private communicationPolicyService: CommunicationPolicyService
  private agentContext: AgentContext

  public constructor(
    agentContext: AgentContext,
    dispatcher: Dispatcher,
    messageSender: MessageSender,
    userProfileService: UserProfileService,
    connectionService: ConnectionService,
    communicationPolicyService: CommunicationPolicyService
  ) {
    this.agentContext = agentContext
    this.messageSender = messageSender
    this.userProfileService = userProfileService
    this.connectionService = connectionService
    this.communicationPolicyService = communicationPolicyService
    this.registerHandlers(dispatcher)
  }

  public async requestConnectionProfile(connection: ConnectionRecord) {
    const message = await this.userProfileService.createGetProfileMessage({})

    await this.messageSender.sendMessage(
      new OutboundMessageContext(message, { agentContext: this.agentContext, connection })
    )
  }

  public async sendConnectionProfile(connection: ConnectionRecord, sendBackYours?: boolean) {
    const myProfile = await this.userProfileService.getUserProfile(this.agentContext)
    const message = await this.userProfileService.createProfileMessage({
      profile: {
        displayName: myProfile.displayName,
        displayPicture: myProfile.displayPicture,
        description: myProfile.description,
        type: ConnectionType.User,
        commChannels: ['text'],
      },
      sendBackYours,
    })

    await this.messageSender.sendMessage(
      new OutboundMessageContext(message, { agentContext: this.agentContext, connection })
    )
  }

  public async getCommunicationPolicies(): Promise<CommunicationPolicyRecord[]> {
    return await this.communicationPolicyService.getAll(this.agentContext)
  }

  public async createCommunicationPolicy(props: CommunicationPolicyBaseProps) {
    return await this.communicationPolicyService.create(this.agentContext, props)
  }

  public async updateCommunicationPolicy(
    communicationPolicyRecord: CommunicationPolicyRecord,
    props: CommunicationPolicyBaseProps
  ) {
    await this.communicationPolicyService.update(this.agentContext, communicationPolicyRecord, props)
  }

  public async deleteCommunicationPolicy(communicationPolicyRecord: CommunicationPolicyRecord) {
    await this.communicationPolicyService.delete(this.agentContext, communicationPolicyRecord)
  }

  /**
   * Update editable properties of user profile record and persist in repository
   *
   * @param props new user data (only fields that have changed)
   *
   * @returns updated User Profile data
   */
  public async updateUserProfileData(props: Partial<UserProfileData>) {
    await this.userProfileService.updateUserProfile(this.agentContext, props)
    return await this.getUserProfileData()
  }

  public async getUserProfileData(): Promise<UserProfileData> {
    const userProfile = await this.userProfileService.getUserProfile(this.agentContext)
    return {
      defaultCommunicationPolicyId: userProfile.defaultCommunicationPolicyId,
      displayName: userProfile.displayName,
      displayPicture: userProfile.displayPicture,
      description: userProfile.description,
    }
  }

  /**
   * Update default communication policy record for new connections, persisting it in repository
   *
   * @param communicationPolicyRecord new default communication policy record
   *
   * @returns updated User Profile Record
   */
  public async setDefaultCommunicationPolicy(communicationPolicyRecord: CommunicationPolicyRecord) {
    await this.userProfileService.updateUserProfile(this.agentContext, {
      defaultCommunicationPolicyId: communicationPolicyRecord.id,
    })

    return await this.userProfileService.getUserProfile(this.agentContext)
  }

  public async getDefaultCommunicationPolicy() {
    return await this.userProfileService.getDefaultCommunicationPolicy(this.agentContext)
  }

  private registerHandlers(dispatcher: Dispatcher) {
    dispatcher.registerMessageHandler(new ProfileHandler(this.userProfileService))
    dispatcher.registerMessageHandler(new GetProfileHandler(this.userProfileService))
  }
}
