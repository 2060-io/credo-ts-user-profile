export interface DisplayPictureData {
  mimeType?: string
  links?: string[]
  base64?: string
}

export class UserProfile {
  public type?: string
  public category?: string
  public displayName?: string
  public displayPicture?: string
  public displayIcon?: string
  public description?: string
  public organizationDid?: string
  public organizationName?: string
  public registrarDid?: string
  public registrarName?: string
}
