import { RestorePasswordForm } from "@/components/auth/restore-password-form";
import { AuthorizationLayout } from "@/layouts/auth-layout";
import { restorePassword } from "@/server-actions/auth/restore-password";

export default function RestorePasswordPage() {
  return (
    <AuthorizationLayout coverImageVariant="restore">
      <RestorePasswordForm action={restorePassword as any} />
    </AuthorizationLayout>
  )
}
