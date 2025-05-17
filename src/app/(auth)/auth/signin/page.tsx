import { AuthorizationLayout } from "@/layouts/auth-layout";
import { SigninForm } from "@/components/auth/signin-form";
import { signin } from "@/server-actions/auth/signin";

export default async function SigninPage() {
  return (
    <AuthorizationLayout coverImageVariant="signin">
      <SigninForm action={signin as any} />
    </AuthorizationLayout>
  );
}
