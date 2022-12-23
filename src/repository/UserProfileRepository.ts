import { EventEmitter, InjectionSymbols } from '@aries-framework/core'
import { Repository, StorageService } from '@aries-framework/core'
import { inject, scoped, Lifecycle } from 'tsyringe'
import { UserProfileRecord } from './UserProfileRecord'

@scoped(Lifecycle.ContainerScoped)
export class UserProfileRepository extends Repository<UserProfileRecord> {
  public readonly DEFAULT_USER_PROFILE_RECORD = 'DEFAULT_USER_PROFILE_RECORD'

  public constructor(
    @inject(InjectionSymbols.StorageService) storageService: StorageService<UserProfileRecord>,
    eventEmitter: EventEmitter
  ) {
    super(UserProfileRecord, storageService, eventEmitter)
  }
}
