import { ResetPasswordForm } from "@/components/modules/auth/reset-password-form";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Reset Password | Cloud Vault",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
