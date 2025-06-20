import { redirect } from "next/navigation";
import { AuthorizationLayout } from "@/layouts/auth-layout";
import { resetPassword } from "@/server-actions/auth/reset-password";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getTokenService } from "@/lib/server/services/instances";

export default async function ResetPasswordEmailLandingPage(props: {
  params: Promise<{
    token: string;
  }>;
}) {
  const tokenService = getTokenService();

  const token = (await props.params).token;

  const success =
    await tokenService.validateRestorePasswordTokenFromEmail(token);

  if (!success) redirect("/auth/restore/reset/fail");

  return (
    <AuthorizationLayout coverImageVariant="restore">
      <ResetPasswordForm token={token} action={resetPassword as any} />
    </AuthorizationLayout>
  );
}
