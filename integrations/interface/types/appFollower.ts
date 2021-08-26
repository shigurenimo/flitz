export type AppFollower = {
  id: string
  createdAt: Date
  userId: string
  username: string | null
  name: string | null
  biography: string
  isFollowee: boolean
  isFollower: boolean
}
