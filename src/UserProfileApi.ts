import { injectable, MessageSender, AgentContext, OutboundMessageContext, ConnectionsApi } from '@credo-ts/core'
import { ProfileHandler, RequestProfileHandler } from './handlers'
import { UserProfileService } from './services'
import { UserProfileData } from './model'

@injectable()
export class UserProfileApi {
  private messageSender: MessageSender
  private userProfileService: UserProfileService
  private agentContext: AgentContext

  public constructor(agentContext: AgentContext, messageSender: MessageSender, userProfileService: UserProfileService) {
    this.agentContext = agentContext
    this.messageSender = messageSender
    this.userProfileService = userProfileService

    this.agentContext.dependencyManager.registerMessageHandlers([
      new ProfileHandler(this.userProfileService),
      new RequestProfileHandler(this.userProfileService),
    ])
  }

  /**
   * Request the user profile for a given connection. It will store received UserProfileData into ConnectionRecord metadata
   * (`UserProfile` key).
   *
   * @param options
   */
  public async requestUserProfile(options: { connectionId: string }) {
    const connection = await this.agentContext.dependencyManager.resolve(ConnectionsApi).getById(options.connectionId)

    const message = await this.userProfileService.createRequestProfileMessage({})

    await this.messageSender.sendMessage(
      new OutboundMessageContext(message, { agentContext: this.agentContext, connection })
    )
  }

  /**
   * Sends User Profile to a given connection. It will send our own stored profile data if `profileData` is not specified.
   *
   * Note: to specify a profileData here does not mean that it will persist and be used in further profile data sharing. It
   * is meant in case we want to send diferent profiles to each connection or update it according to the context.
   *
   * @param options
   */
  public async sendUserProfile(options: {
    connectionId: string
    profileData?: Partial<UserProfileData>
    sendBackYours?: boolean
  }) {
    const { connectionId, profileData, sendBackYours } = options
    const connection = await this.agentContext.dependencyManager.resolve(ConnectionsApi).getById(connectionId)

    const myProfile = await this.userProfileService.getUserProfile(this.agentContext)
    const message = await this.userProfileService.createProfileMessage({
      profile: profileData ?? {
        displayName: myProfile.displayName,
        displayPicture: myProfile.displayPicture,
        description: myProfile.description,
      },
      sendBackYours,
    })

    await this.messageSender.sendMessage(
      new OutboundMessageContext(message, { agentContext: this.agentContext, connection })
    )
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

  /**
   * Retrieve our User Profile Data from storage.
   *
   * @returns our own UserProfileData
   */
  public async getUserProfileData(): Promise<UserProfileData> {
    const userProfile = await this.userProfileService.getUserProfile(this.agentContext)
    return {
      displayName: userProfile.displayName,
      displayPicture: userProfile.displayPicture,
      description: userProfile.description,
    }
  }
}
