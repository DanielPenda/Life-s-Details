"use client";

import { LoaderCircle, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginOwner } from "./actions";

function LoginButton() {
  const { pending } = useFormStatus();
  return <button className="button button-primary admin-login-button" disabled={pending} type="submit">{pending ? <LoaderCircle aria-hidden="true" className="spin" size={18} /> : <LockKeyhole aria-hidden="true" size={18} />}{pending ? "Signing in..." : "Sign in securely"}</button>;
}

export function LoginForm() {
  const initialState: { error?: string } = {};
  const [state, action] = useActionState(loginOwner, initialState);
  return (
    <form action={action} className="admin-login-form">
      <label className="form-field">Owner email<input autoComplete="username" name="email" required type="email" /></label>
      <label className="form-field">Password<input autoComplete="current-password" name="password" required type="password" /></label>
      {state.error ? <p className="form-alert" role="alert">{state.error}</p> : null}
      <LoginButton />
      <Link className="admin-login-link" href="/admin/forgot-password">Forgot password?</Link>
    </form>
  );
}
