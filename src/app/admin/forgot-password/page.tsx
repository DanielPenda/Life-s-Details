import { Mail } from "lucide-react";
import type { Metadata } from "next";
import { RecoveryRequestForm } from "./recovery-request-form";

export const metadata: Metadata = { title: "Recover owner access", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function ForgotOwnerPasswordPage() {
  return <section className="admin-login-page"><div className="admin-login-panel"><Mail aria-hidden="true" size={32} /><p className="eyebrow">Owner access</p><h1>Recover your account.</h1><p className="muted">A one-time recovery link will be sent to the configured owner email address.</p><RecoveryRequestForm /></div></section>;
}
