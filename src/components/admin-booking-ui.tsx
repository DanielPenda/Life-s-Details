import type { BookingStatus, PaymentStatus } from "@prisma/client";

const statusLabels: Record<BookingStatus, string> = {
  REQUESTED: "New request", REVIEWING: "Reviewing", CONFIRMED: "Confirmed",
  RESCHEDULE_REQUIRED: "Needs new date", CANCELLED: "Cancelled", COMPLETED: "Completed", NO_SHOW: "No-show",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className="admin-status" data-status={status}>{statusLabels[status]}</span>;
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return <span className="admin-payment" data-status={status}>{status === "PAID" ? "Paid" : "Unpaid"}</span>;
}

export function formatAdminDate(value: Date | null, includeTime = false) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en-BE", { dateStyle: "medium", ...(includeTime ? { timeStyle: "short" as const } : {}), timeZone: "Europe/Brussels" }).format(value);
}
