import {
  injectable,
  MessageSender,
  AgentContext,
  ConnectionRecord,
  OutboundMessageContext,
} from '@aries-framework/core'
import { ProfileHandler, RequestProfileHandler } from './handlers'
import { UserProfileData } from './repository'
import { UserProfileService } from './services'

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

  public async requestUserProfile(connection: ConnectionRecord) {
    const message = await this.userProfileService.createRequestProfileMessage({})

    await this.messageSender.sendMessage(
      new OutboundMessageContext(message, { agentContext: this.agentContext, connection })
    )
  }

  public async sendUserProfile(connection: ConnectionRecord, sendBackYours?: boolean) {
    const myProfile = await this.userProfileService.getUserProfile(this.agentContext)
    const message = await this.userProfileService.createProfileMessage({
      profile: {
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

  public async getUserProfileData(): Promise<UserProfileData> {
    const userProfile = await this.userProfileService.getUserProfile(this.agentContext)
    return {
      displayName: userProfile.displayName,
      displayPicture: userProfile.displayPicture,
      description: userProfile.description,
    }
  }
}
