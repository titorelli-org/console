export type ProfileAccountRoles = "member" | "owner" | "invited"

export type ProfileAccountVm = {
  id: string
  name: string
  owner: {
    id: string
    username: string
  }
  role: ProfileAccountRoles
}
