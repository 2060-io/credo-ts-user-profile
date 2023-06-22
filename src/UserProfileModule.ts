import type { DependencyManager, FeatureRegistry, Module } from '@aries-framework/core'

import { Protocol } from '@aries-framework/core'

import { UserProfileApi } from './UserProfileApi'
import { UserProfileService } from './services'

export class UserProfileModule implements Module {
  public readonly api = UserProfileApi

  /**
   * Registers the dependencies of the question answer module on the dependency manager.
   */
  public register(dependencyManager: DependencyManager, featureRegistry: FeatureRegistry) {
    // Api
    dependencyManager.registerContextScoped(UserProfileApi)

    // Services
    dependencyManager.registerSingleton(UserProfileService)

    // Feature Registry
    featureRegistry.register(
      new Protocol({
        id: 'https://didcomm.org/user-profile/1.0',
      })
    )
  }
}
