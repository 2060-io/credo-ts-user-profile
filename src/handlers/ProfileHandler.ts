import { MessageHandler, MessageHandlerInboundMessage, OutboundMessageContext } from '@credo-ts/core'
import { ProfileMessage } from '../messages'
import { UserProfileService } from '../services'

export class ProfileHandler implements MessageHandler {
  public supportedMessages = [ProfileMessage]
  private userProfileService: UserProfileService

  public constructor(userProfileService: UserProfileService) {
    this.userProfileService = userProfileService
  }

  public async handle(inboundMessage: MessageHandlerInboundMessage<ProfileHandler>) {
    const connection = inboundMessage.assertReadyConnection()

    const payload = await this.userProfileService.processProfile(inboundMessage)

    if (payload) {
      return new OutboundMessageContext(payload, { agentContext: inboundMessage.agentContext, connection })
    }
  }
}
