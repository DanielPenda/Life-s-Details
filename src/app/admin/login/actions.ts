"use server";

import { redirect } from "next/navigation";
import {
  authenticateOwner,
  requestOwnerPasswordRecovery,
  updateOwnerPassword,
  updateOwnerPasswordWithRecoveryToken,
} from "@/lib/admin-auth";

export async function loginOwner(_state: { error?: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password || !(await authenticateOwner(email, password))) {
    return { error: "The email or password was not recognised." };
  }
  redirect("/admin");
}

export async function sendOwnerRecoveryEmail(_state: { error?: string; success?: boolean }) {
  void _state;
  if (!(await requestOwnerPasswordRecovery())) {
    return { error: "A recovery email could not be sent right now. Please try again shortly." };
  }
  return { success: true };
}

export async function resetOwnerPassword(
  _state: { error?: string; success?: boolean },
  formData: FormData,
) {
  const accessToken = String(formData.get("accessToken") ?? "");
  const tokenHash = String(formData.get("tokenHash") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (!accessToken && !tokenHash) return { error: "This recovery link is invalid or has expired." };
  if (password.length < 12) return { error: "Use at least 12 characters for the new password." };
  if (password !== confirmation) return { error: "The passwords do not match." };
  const updated = tokenHash
    ? await updateOwnerPasswordWithRecoveryToken(tokenHash, password)
    : await updateOwnerPassword(accessToken, password);
  if (!updated) {
    return { error: "The recovery link is invalid or has expired." };
  }
  return { success: true };
}
