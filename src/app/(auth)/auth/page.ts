import { redirect } from "next/navigation";

export default async function AuthorizationPage() {
  redirect('/auth/signin')
}
