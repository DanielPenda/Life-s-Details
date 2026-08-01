"use server";

import { redirect } from "next/navigation";
import { authenticateOwner, updateOwnerPassword } from "@/lib/admin-auth";

export async function loginOwner(_state: { error?: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password || !(await authenticateOwner(email, password))) {
    return { error: "The email or password was not recognised." };
  }
  redirect("/admin");
}

export async function resetOwnerPassword(
  _state: { error?: string; success?: boolean },
  formData: FormData,
) {
  const accessToken = String(formData.get("accessToken") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (!accessToken) return { error: "This recovery link is invalid or has expired." };
  if (password.length < 12) return { error: "Use at least 12 characters for the new password." };
  if (password !== confirmation) return { error: "The passwords do not match." };
  if (!(await updateOwnerPassword(accessToken, password))) {
    return { error: "The recovery link is invalid or has expired." };
  }
  return { success: true };
}
