"use server";

import type { Booking } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearAdminSession, requireAdminSession } from "@/lib/admin-auth";
import { adminBookingUpdateSchema, brusselsLocalToUtc, parseOptionalMoney } from "@/lib/admin-booking";
import { sendBookingConfirmation } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function logoutOwner() {
  await clearAdminSession();
  redirect("/admin/login");
}

function auditEntries(previous: Booking, next: Record<string, unknown>, actorEmail: string, note: string) {
  const fields = ["status", "appointmentStartAt", "appointmentEndAt", "estimatedPrice", "finalPrice", "paymentStatus", "paymentMethod", "paidAt", "internalNotes"] as const;
  return fields.flatMap((field) => {
    const previousValue = previous[field as keyof Booking] as unknown;
    const before = previousValue === null ? null : String(previousValue);
    const afterValue = next[field];
    const after = afterValue === null || afterValue === undefined ? null : String(afterValue);
    return before === after ? [] : [{ action: "BOOKING_UPDATED", field: String(field), fromValue: before, toValue: after, note: note || null, actorEmail }];
  });
}

export async function updateBooking(formData: FormData) {
  const user = await requireAdminSession();
  const bookingId = String(formData.get("bookingId") ?? "");
  const reference = String(formData.get("reference") ?? "");
  const parsed = adminBookingUpdateSchema.safeParse({
    bookingId,
    status: formData.get("status"),
    appointmentDate: formData.get("appointmentDate"),
    appointmentTime: formData.get("appointmentTime"),
    estimatedPrice: parseOptionalMoney(formData.get("estimatedPrice")),
    finalPrice: parseOptionalMoney(formData.get("finalPrice")),
    paymentStatus: formData.get("paymentStatus"),
    paymentMethod: formData.get("paymentMethod") || null,
    internalNotes: formData.get("internalNotes"),
    actionNote: formData.get("actionNote"),
  });
  if (!parsed.success) redirect(`/admin/bookings/${encodeURIComponent(reference)}?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Check the booking details.")}`);

  const input = parsed.data;
  const previous = await prisma.booking.findUnique({ where: { id: bookingId }, include: { service: true } });
  if (!previous || previous.publicReference !== reference) redirect("/admin?error=Booking%20not%20found");

  const appointmentStartAt = brusselsLocalToUtc(input.appointmentDate, input.appointmentTime);
  const appointmentEndAt = appointmentStartAt ? new Date(appointmentStartAt.getTime() + previous.service.estimatedDurationMinutes * 60000) : null;
  const paidAt = input.paymentStatus === "PAID" ? previous.paidAt ?? new Date() : null;
  const update = { status: input.status, appointmentStartAt, appointmentEndAt, estimatedPrice: input.estimatedPrice, finalPrice: input.finalPrice, paymentStatus: input.paymentStatus, paymentMethod: input.paymentMethod, paidAt, internalNotes: input.internalNotes || null };
  const audits = auditEntries(previous, update, user.email ?? "owner", input.actionNote);

  const updated = await prisma.$transaction(async (tx) => {
    const result = await tx.booking.update({ where: { id: bookingId }, data: { ...update, ...(previous.status !== input.status ? { statusHistory: { create: { fromStatus: previous.status, toStatus: input.status, note: input.actionNote || "Updated by owner." } } } : {}) }, include: { service: true } });
    if (audits.length) await tx.bookingAuditLog.createMany({ data: audits.map((entry) => ({ ...entry, bookingId })) });
    return result;
  });

  if (input.status === "CONFIRMED" && previous.status !== "CONFIRMED" && appointmentStartAt) {
    await sendBookingConfirmation({ customerEmail: updated.email, customerName: updated.customerName, reference: updated.publicReference, serviceName: updated.service.name, appointmentStartAt, address: `${updated.addressLine}, ${updated.postcode} ${updated.city}` }).catch((error: unknown) => console.error("booking_confirmation_notification_failed", { reference: updated.publicReference, reason: error instanceof Error ? error.message : "Unknown email error" }));
  }
  revalidatePath("/admin"); revalidatePath("/admin/calendar"); revalidatePath(`/admin/bookings/${reference}`);
  redirect(`/admin/bookings/${encodeURIComponent(reference)}?saved=1`);
}
