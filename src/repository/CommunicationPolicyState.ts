/**
 * Communication Policy states as defined in
 * https://gitlab.mobiera.com/2060/2060-spec/-/blob/master/concepts/communication-policy.md
 */

export enum CommunicationPolicyState {
  Init = 'init',
  Enabled = 'enabled',
  Disabled = 'disabled',
}
