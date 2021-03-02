export type QueryProfile = {
  id: string
  createdAt: Date
  username: string
  name: string | null
  biography: string
  iconImageId: string | null
  headerImageId: string | null
  siteURL: string
  isFollowee: boolean
  followeesCount: number
  followersCount: number
}
