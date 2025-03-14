import { RestorePasswordForm } from "@/components/auth/restore-password-form";
import { AuthorizationLayout } from "@/layouts/auth-layout";
import { restorePassword } from "@/server-actions/auth/restore-password";

export default function RestorePasswordPage() {
  return (
    <AuthorizationLayout coverImageVariant="restore">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <RestorePasswordForm action={restorePassword as any} />
    </AuthorizationLayout>
  )
}
