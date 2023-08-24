/**
 * UserProfileModuleConfigOptions defines the interface for the options of the UserProfileModuleConfig class.
 * This can contain optional parameters that have default values in the config class itself.
 */
export interface UserProfileModuleConfigOptions {
  /**
   * Whether to automatically send our profile when asked to do so.
   *
   * @default true
   */
  autoSendProfile?: boolean
}

export class UserProfileModuleConfig {
  #autoSendProfile?: boolean

  private options: UserProfileModuleConfigOptions

  public constructor(options?: UserProfileModuleConfigOptions) {
    this.options = options ?? {}
    this.#autoSendProfile = this.options.autoSendProfile
  }

  /** See {@link UserProfileModuleConfigOptions.autoSendProfile} */
  public get autoSendProfile() {
    return this.#autoSendProfile ?? true
  }
}
