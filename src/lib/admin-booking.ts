import { z } from "zod";

export const adminBookingUpdateSchema = z.object({
  bookingId: z.string().min(1),
  status: z.enum(["REQUESTED", "REVIEWING", "CONFIRMED", "RESCHEDULE_REQUIRED", "CANCELLED", "COMPLETED", "NO_SHOW"]),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal("")),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/).or(z.literal("")),
  estimatedPrice: z.coerce.number().min(0).max(100000).nullable(),
  finalPrice: z.coerce.number().min(0).max(100000).nullable(),
  paymentStatus: z.enum(["UNPAID", "PAID"]),
  paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "CARD", "PAYCONIQ", "OTHER"]).nullable(),
  internalNotes: z.string().trim().max(3000),
  actionNote: z.string().trim().max(500),
}).superRefine((value, context) => {
  if (value.status === "CONFIRMED" && (!value.appointmentDate || !value.appointmentTime)) {
    context.addIssue({ code: "custom", path: ["appointmentDate"], message: "A confirmed booking needs an appointment date and time." });
  }
  if (value.paymentStatus === "PAID" && !value.paymentMethod) {
    context.addIssue({ code: "custom", path: ["paymentMethod"], message: "Choose how the payment was received." });
  }
});

export function parseOptionalMoney(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim() ? value : null;
}

export function brusselsLocalToUtc(date: string, time: string) {
  if (!date || !time) return null;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const desired = Date.UTC(year, month - 1, day, hour, minute);
  let result = new Date(desired);

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Brussels",
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(result);
    const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
    const represented = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
    result = new Date(result.getTime() + desired - represented);
  }
  return result;
}

export function formatMoney(value: { toString(): string } | number | null) {
  if (value === null) return "Not set";
  return new Intl.NumberFormat("en-BE", { style: "currency", currency: "EUR" }).format(Number(value));
}
