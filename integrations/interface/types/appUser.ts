/**
 * ユーザ
 */
export type AppUser = {
  id: string
  createdAt: Date
  username: string
  name: string | null
  biography: string
  followeesCount: number
  followersCount: number
  siteURL: string
  isFollowee: boolean
  isFollower: boolean
}
