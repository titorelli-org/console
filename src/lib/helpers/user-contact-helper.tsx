import type { UserContactVm } from "@/types/my-profile";
import { Mail, MessageCircle, Phone } from "lucide-react";

export class UserContactHelper implements UserContactVm {
  readonly id: UserContactVm["id"];
  readonly type: UserContactVm["type"];
  readonly value: UserContactVm["value"];
  readonly status: UserContactVm["status"];

  constructor(data: UserContactVm) {
    Object.assign(this, data);
  }

  get listIcon() {
    switch (this.type) {
      case "email":
        return <Mail className="w-5 h-5" />;
      case "phone":
        return <Phone className="w-5 h-5" />;
      case "telegram":
        return <MessageCircle className="w-5 h-5" />;
    }
  }

  get displayType() {
    switch (this.type) {
      case "email":
        return "Email";
      case "phone":
        return "Телефон";
      case "telegram":
        return "Telegram";
      default:
        return "Не понятно";
    }
  }
}
