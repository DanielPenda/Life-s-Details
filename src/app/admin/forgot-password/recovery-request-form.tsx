"use client";

import { CheckCircle2, LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendOwnerRecoveryEmail } from "../login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="button button-primary admin-login-button" disabled={pending} type="submit">{pending ? <LoaderCircle aria-hidden="true" className="spin" size={18} /> : <Mail aria-hidden="true" size={18} />}{pending ? "Sending..." : "Send recovery email"}</button>;
}

export function RecoveryRequestForm() {
  const initialState: { error?: string; success?: boolean } = {};
  const [state, action] = useActionState(sendOwnerRecoveryEmail, initialState);

  if (state.success) return <div className="admin-login-form"><CheckCircle2 aria-hidden="true" size={28} /><p>Recovery email sent. Use the newest message and open its link once.</p><Link className="button button-secondary admin-login-button" href="/admin/login">Back to sign in</Link></div>;

  return <form action={action} className="admin-login-form">
    {state.error ? <p className="form-alert" role="alert">{state.error}</p> : null}
    <SubmitButton />
  </form>;
}
