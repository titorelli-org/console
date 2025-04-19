export class UserAccountRoleHelper {
  constructor(private role: "owner" | "member" | "invited") {}

  get displayName() {
    switch (this.role) {
      case "owner":
        return "Владелец";
      case "member":
        return "Участник";
      case "invited":
        return "Приглашен";
      default:
        throw new Error("Unreachable");
    }
  }
}
