import { brusselsLocalToUtc } from "@/lib/admin-booking";
import { prisma } from "@/lib/prisma";

export const SLOT_STEP_MINUTES = 30;
export const ACTIVE_SLOT_STATUSES = ["REQUESTED", "REVIEWING", "CONFIRMED", "RESCHEDULE_REQUIRED"] as const;

export type AvailableDay = {
  date: string;
  label: string;
  openTime: string;
  closeTime: string;
  slots: string[];
};

export function minutesToTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function dateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function addUtcDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export async function getAvailableSchedule(serviceSlug: string, addOnSlugs: string[] = [], horizonDays = 365, locale = "en-BE") {
  const today = dateOnly(new Date().toISOString().slice(0, 10));
  const horizon = addUtcDays(today, horizonDays + 1);
  const [service, addOns, availability, bookings] = await Promise.all([
    prisma.service.findFirst({ where: { slug: serviceSlug, active: true } }),
    prisma.addOn.findMany({ where: { slug: { in: addOnSlugs }, active: true } }),
    prisma.workAvailability.findMany({
      where: { date: { gte: today, lt: horizon } },
      orderBy: { date: "asc" },
    }),
    prisma.booking.findMany({
      where: {
        status: { in: [...ACTIVE_SLOT_STATUSES] },
        appointmentStartAt: { not: null, lt: brusselsLocalToUtc(horizon.toISOString().slice(0, 10), "00:00") ?? horizon },
        appointmentEndAt: { not: null, gt: new Date() },
      },
      select: { appointmentStartAt: true, appointmentEndAt: true },
    }),
  ]);

  if (!service || addOns.length !== new Set(addOnSlugs).size) {
    return { durationMinutes: 0, days: [] as AvailableDay[] };
  }

  const durationMinutes = service.estimatedDurationMinutes
    + addOns.reduce((total, addOn) => total + addOn.estimatedDurationMinutes, 0);
  const now = new Date();
  const days = availability.flatMap((window) => {
    const date = window.date.toISOString().slice(0, 10);
    const slots: string[] = [];
    for (let minute = window.startMinute; minute + durationMinutes <= window.endMinute; minute += SLOT_STEP_MINUTES) {
      const time = minutesToTime(minute);
      const start = brusselsLocalToUtc(date, time);
      if (!start || start <= now) continue;
      const end = new Date(start.getTime() + durationMinutes * 60000);
      const overlaps = bookings.some((booking) =>
        booking.appointmentStartAt && booking.appointmentEndAt
        && start < booking.appointmentEndAt && end > booking.appointmentStartAt,
      );
      if (!overlaps) slots.push(time);
    }
    if (!slots.length) return [];
    return [{
      date,
      label: window.date.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }),
      openTime: minutesToTime(window.startMinute),
      closeTime: minutesToTime(window.endMinute),
      slots,
    }];
  });

  return { durationMinutes, days };
}

export function deriveTimeWindow(time: string) {
  const hour = Number(time.slice(0, 2));
  if (hour < 12) return "MORNING" as const;
  if (hour < 17) return "AFTERNOON" as const;
  return "EVENING" as const;
}
