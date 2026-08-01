"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { addUtcDays, dateOnly, timeToMinutes } from "@/lib/availability";
import { prisma } from "@/lib/prisma";

const availabilitySchema = z.object({
  from: z.string().date(),
  to: z.string().date(),
  openTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
}).superRefine((value, context) => {
  if (value.to < value.from) context.addIssue({ code: "custom", path: ["to"], message: "End date must be on or after the start date." });
  if (timeToMinutes(value.closeTime) <= timeToMinutes(value.openTime)) context.addIssue({ code: "custom", path: ["closeTime"], message: "Closing time must be after opening time." });
  const span = Math.round((dateOnly(value.to).getTime() - dateOnly(value.from).getTime()) / 86400000);
  if (span > 730) context.addIssue({ code: "custom", path: ["to"], message: "Choose a range of two years or less." });
});

export async function saveAvailability(formData: FormData) {
  await requireAdminSession();
  const parsed = availabilitySchema.safeParse({
    from: formData.get("from"), to: formData.get("to"),
    openTime: formData.get("openTime"), closeTime: formData.get("closeTime"),
  });
  const week = String(formData.get("week") ?? "");
  if (!parsed.success) redirect(`/admin/calendar?week=${encodeURIComponent(week)}&error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Check availability details.")}`);
  const start = dateOnly(parsed.data.from); const end = dateOnly(parsed.data.to); const rows = [];
  for (let date = start; date <= end; date = addUtcDays(date, 1)) rows.push(new Date(date));
  await prisma.$transaction(rows.map((date) => prisma.workAvailability.upsert({
    where: { date },
    create: { date, startMinute: timeToMinutes(parsed.data.openTime), endMinute: timeToMinutes(parsed.data.closeTime) },
    update: { startMinute: timeToMinutes(parsed.data.openTime), endMinute: timeToMinutes(parsed.data.closeTime) },
  })));
  revalidatePath("/admin/calendar"); revalidatePath("/book");
  redirect(`/admin/calendar?week=${encodeURIComponent(week || parsed.data.from)}&saved=${rows.length}`);
}

export async function closeAvailability(formData: FormData) {
  await requireAdminSession();
  const date = String(formData.get("date") ?? ""); const week = String(formData.get("week") ?? "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) await prisma.workAvailability.deleteMany({ where: { date: dateOnly(date) } });
  revalidatePath("/admin/calendar"); revalidatePath("/book");
  redirect(`/admin/calendar?week=${encodeURIComponent(week || date)}&closed=1`);
}
