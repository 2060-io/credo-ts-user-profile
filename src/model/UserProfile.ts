export interface PictureData {
  mimeType?: string
  links?: string[]
  base64?: string
}

export interface UserProfileData {
  displayName?: string
  displayPicture?: PictureData
  displayIcon?: PictureData
  description?: string
  organizationDid?: string
  organizationName?: string
  registrarDid?: string
  registrarName?: string
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
