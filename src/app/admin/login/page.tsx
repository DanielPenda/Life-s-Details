import { LockKeyhole } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Owner sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <section className="admin-login-page"><div className="admin-login-panel"><LockKeyhole aria-hidden="true" size={32} /><p className="eyebrow">Owner access</p><h1>Manage bookings securely.</h1><p className="muted">Sign in with the single owner account. Customer booking details are never available publicly.</p><LoginForm /></div></section>;
}
