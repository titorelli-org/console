import {
  SignupForm,
  SignupFormInitialValues,
} from "@/components/auth/signup-form";
import { AuthorizationLayout } from "@/layouts/auth-layout";
import { getTokenService } from "@/lib/server/services/instances";
import { signup } from "@/server-actions/auth/signup";
import { AccountValueTypes } from "@/types/authoriaztion";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
    phone?: string;
    username?: string;
    account?: AccountValueTypes;
    v?: string;
  }>;
}) {
  const tokenService = getTokenService();
  const spPayload = await searchParams;
  let initialValues: SignupFormInitialValues | null = null;

  if (spPayload.v) {
    const valid = await tokenService.validateSignupPrefilledValidationToken(
      spPayload,
      spPayload.v,
    );

    if (valid) {
      initialValues = {
        email: spPayload.email,
        phone: spPayload.phone,
        username: spPayload.username,
        account: spPayload.account,
      };
    }
  }

  return (
    <AuthorizationLayout coverImageVariant="signup">
      <SignupForm initialValues={initialValues} action={signup as any} />
    </AuthorizationLayout>
  );
}
