import { File, User } from "db"

export type UserWithIcon = User & { iconImage: File | null }
