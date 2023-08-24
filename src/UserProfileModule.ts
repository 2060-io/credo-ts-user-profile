import type { DependencyManager, FeatureRegistry, Module } from '@aries-framework/core'

import { Protocol } from '@aries-framework/core'

import { UserProfileApi } from './UserProfileApi'
import { UserProfileService } from './services'
import { UserProfileModuleConfig } from './UserProfileModuleConfig'

export class UserProfileModule implements Module {
  public readonly config: UserProfileModuleConfig
  public readonly api = UserProfileApi

  public constructor(config?: UserProfileModuleConfig) {
    this.config = new UserProfileModuleConfig(config)
  }

  /**
   * Registers the dependencies of the question answer module on the dependency manager.
   */
  public register(dependencyManager: DependencyManager, featureRegistry: FeatureRegistry) {
    // Api
    dependencyManager.registerContextScoped(UserProfileApi)

    // Config
    dependencyManager.registerInstance(UserProfileModuleConfig, this.config)

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
