import { KeyRound } from "lucide-react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: "Reset owner password", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function ResetOwnerPasswordPage() {
  return <section className="admin-login-page"><div className="admin-login-panel"><KeyRound aria-hidden="true" size={32} /><p className="eyebrow">Owner access</p><h1>Choose a new password.</h1><p className="muted">Use the secure recovery link from your email. It can only update the configured owner account.</p><ResetPasswordForm /></div></section>;
}
