"use client";

import { CheckCircle2, LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { resetOwnerPassword } from "../login/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button className="button button-primary admin-login-button" disabled={pending} type="submit">{pending ? <LoaderCircle aria-hidden="true" className="spin" size={18} /> : <LockKeyhole aria-hidden="true" size={18} />}{pending ? "Updating..." : "Set new password"}</button>;
}

export function ResetPasswordForm() {
  const [accessToken, setAccessToken] = useState("");
  const [ready, setReady] = useState(false);
  const initialState: { error?: string; success?: boolean } = {};
  const [state, action] = useActionState(resetOwnerPassword, initialState);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.get("type") === "recovery") setAccessToken(hash.get("access_token") ?? "");
    window.history.replaceState(null, "", window.location.pathname);
    setReady(true);
  }, []);

  if (state.success) return <div className="admin-login-form"><CheckCircle2 aria-hidden="true" size={28} /><p>Your password is ready.</p><Link className="button button-primary admin-login-button" href="/admin/login">Continue to sign in</Link></div>;

  return <form action={action} className="admin-login-form">
    <input name="accessToken" type="hidden" value={accessToken} />
    <label className="form-field">New password<input autoComplete="new-password" minLength={12} name="password" required type="password" /></label>
    <label className="form-field">Confirm password<input autoComplete="new-password" minLength={12} name="confirmation" required type="password" /></label>
    {ready && !accessToken ? <p className="form-alert" role="alert">This recovery link is invalid or has expired.</p> : null}
    {state.error ? <p className="form-alert" role="alert">{state.error}</p> : null}
    <SubmitButton />
  </form>;
}
