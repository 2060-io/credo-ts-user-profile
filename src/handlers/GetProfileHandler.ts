import { MessageHandler, MessageHandlerInboundMessage, OutboundMessageContext } from '@aries-framework/core'
import { GetProfileMessage } from '../messages'
import { UserProfileService } from '../services'

export class GetProfileHandler implements MessageHandler {
  public supportedMessages = [GetProfileMessage]
  private userProfileService: UserProfileService

  public constructor(userProfileService: UserProfileService) {
    this.userProfileService = userProfileService
  }

  public async handle(inboundMessage: MessageHandlerInboundMessage<GetProfileHandler>) {
    const connection = inboundMessage.assertReadyConnection()

    const payload = await this.userProfileService.processGetProfile(inboundMessage)

    if (payload) {
      return new OutboundMessageContext(payload, { agentContext: inboundMessage.agentContext, connection })
    }
  }
}
