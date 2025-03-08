import { AuthorizationLayout } from "@/layouts/auth-layout";
import { SigninForm } from "@/components/auth/signin-form";
import { signin } from "@/server-actions/auth/signin";

export default async function SigninPage() {
  return (
    <AuthorizationLayout coverImageVariant="signin">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <SigninForm action={signin as any} />
    </AuthorizationLayout>
  );
}
