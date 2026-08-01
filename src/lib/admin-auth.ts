import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

const accessCookie = "lifesdetails_admin_access";

type SupabaseUser = { id: string; email?: string };

function authConfig() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_PUBLISHABLE_KEY || !env.ADMIN_EMAIL) {
    throw new Error("Admin authentication is not configured.");
  }

  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    key: env.SUPABASE_PUBLISHABLE_KEY,
    ownerEmail: env.ADMIN_EMAIL.toLowerCase(),
  };
}

export async function authenticateOwner(email: string, password: string) {
  const config = authConfig();
  if (email.toLowerCase() !== config.ownerEmail) return false;

  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: config.key, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!response.ok) return false;
  const session = (await response.json()) as { access_token: string; expires_in: number; user: SupabaseUser };
  if (session.user.email?.toLowerCase() !== config.ownerEmail) return false;

  const store = await cookies();
  store.set(accessCookie, session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: session.expires_in,
  });
  return true;
}

export async function updateOwnerPassword(accessToken: string, password: string) {
  const config = authConfig();
  const headers = { apikey: config.key, Authorization: `Bearer ${accessToken}` };
  const userResponse = await fetch(`${config.url}/auth/v1/user`, { headers, cache: "no-store" });
  if (!userResponse.ok) return false;

  const user = (await userResponse.json()) as SupabaseUser;
  if (user.email?.toLowerCase() !== config.ownerEmail) return false;

  const response = await fetch(`${config.url}/auth/v1/user`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
    cache: "no-store",
  });
  return response.ok;
}

export async function getAdminSession(): Promise<SupabaseUser | null> {
  const config = authConfig();
  const token = (await cookies()).get(accessCookie)?.value;
  if (!token) return null;

  const response = await fetch(`${config.url}/auth/v1/user`, {
    headers: { apikey: config.key, Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;

  const user = (await response.json()) as SupabaseUser;
  return user.email?.toLowerCase() === config.ownerEmail ? user : null;
}

export async function requireAdminSession() {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  return user;
}

export async function clearAdminSession() {
  (await cookies()).set(accessCookie, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: new Date(0),
  });
}
