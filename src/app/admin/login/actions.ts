"use server";

import { redirect } from "next/navigation";
import { authenticateOwner } from "@/lib/admin-auth";

export async function loginOwner(_state: { error?: string }, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password || !(await authenticateOwner(email, password))) {
    return { error: "The email or password was not recognised." };
  }
  redirect("/admin");
}
