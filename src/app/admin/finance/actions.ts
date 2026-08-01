"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { dateOnly } from "@/lib/availability";
import { prisma } from "@/lib/prisma";

const costSchema = z.object({
  incurredOn: z.string().date(),
  category: z.enum(["TRANSPORT", "PRODUCTS", "EQUIPMENT", "SUBSCRIPTIONS", "OTHER"]),
  description: z.string().trim().min(2).max(120),
  amount: z.coerce.number().positive().max(100000),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function addBusinessCost(formData: FormData) {
  await requireAdminSession();
  const parsed = costSchema.safeParse({ incurredOn: formData.get("incurredOn"), category: formData.get("category"), description: formData.get("description"), amount: formData.get("amount"), notes: formData.get("notes") });
  if (!parsed.success) redirect(`/admin/finance?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Check the cost details.")}`);
  await prisma.businessCost.create({ data: { ...parsed.data, incurredOn: dateOnly(parsed.data.incurredOn), notes: parsed.data.notes || null } });
  revalidatePath("/admin/finance"); redirect("/admin/finance?saved=1");
}

export async function deleteBusinessCost(formData: FormData) {
  await requireAdminSession(); const id = String(formData.get("id") ?? "");
  if (id) await prisma.businessCost.deleteMany({ where: { id } });
  revalidatePath("/admin/finance"); redirect("/admin/finance?deleted=1");
}
