import { ConnectionType } from './ConnectionType'

export type CommChannel = 'text' | 'video' | 'audio'

export class ConnectionProfile {
  public type?: ConnectionType
  public category?: string
  public displayName?: string
  public displayPicture?: string
  public displayIcon?: string
  public commChannels?: CommChannel[]
  public description?: string
  public organizationDid?: string
  public organizationName?: string
  public registrarDid?: string
  public registrarName?: string
}
