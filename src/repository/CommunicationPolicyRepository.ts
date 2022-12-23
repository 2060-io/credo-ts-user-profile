import { EventEmitter, InjectionSymbols } from '@aries-framework/core'
import { Repository, StorageService } from '@aries-framework/core'
import { inject, scoped, Lifecycle } from 'tsyringe'
import { CommunicationPolicyRecord } from './CommunicationPolicyRecord'

@scoped(Lifecycle.ContainerScoped)
export class CommunicationPolicyRepository extends Repository<CommunicationPolicyRecord> {
  public constructor(
    @inject(InjectionSymbols.StorageService) storageService: StorageService<CommunicationPolicyRecord>,
    eventEmitter: EventEmitter
  ) {
    super(CommunicationPolicyRecord, storageService, eventEmitter)
  }
}
