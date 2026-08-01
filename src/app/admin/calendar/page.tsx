import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/admin-booking-ui";
import { requireAdminSession } from "@/lib/admin-auth";
import { brusselsLocalToUtc } from "@/lib/admin-booking";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Booking calendar", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

function startOfWeek(input?: string) { const date = input && /^\d{4}-\d{2}-\d{2}$/.test(input) ? new Date(`${input}T12:00:00Z`) : new Date(); const day = date.getUTCDay() || 7; date.setUTCDate(date.getUTCDate() - day + 1); date.setUTCHours(0, 0, 0, 0); return date; }
function isoDate(date: Date) { return date.toISOString().slice(0, 10); }

export default async function AdminCalendar({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const [user, query] = await Promise.all([requireAdminSession(), searchParams]);
  const start = startOfWeek(query.week); const end = new Date(start); end.setUTCDate(end.getUTCDate() + 7);
  const queryStart = brusselsLocalToUtc(isoDate(start), "00:00") ?? start;
  const queryEnd = brusselsLocalToUtc(isoDate(end), "00:00") ?? end;
  const previous = new Date(start); previous.setUTCDate(previous.getUTCDate() - 7); const next = new Date(start); next.setUTCDate(next.getUTCDate() + 7);
  const bookings = await prisma.booking.findMany({ where: { appointmentStartAt: { gte: queryStart, lt: queryEnd }, status: { in: ["CONFIRMED", "COMPLETED", "NO_SHOW"] } }, include: { service: true }, orderBy: { appointmentStartAt: "asc" } });
  const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(start); date.setUTCDate(date.getUTCDate() + index); return date; });
  return <AdminShell email={user.email ?? "owner"}><div className="admin-content"><div className="admin-page-heading"><div><p className="eyebrow">Schedule</p><h1>Week of {start.toLocaleDateString("en-BE", { dateStyle: "long", timeZone: "UTC" })}</h1><p>Confirmed work, completed jobs and no-shows in one simple weekly view.</p></div><div className="admin-week-actions"><Link aria-label="Previous week" className="button button-secondary" href={`/admin/calendar?week=${isoDate(previous)}`}><ArrowLeft aria-hidden="true" size={18} /></Link><Link className="button button-secondary" href="/admin/calendar">Today</Link><Link aria-label="Next week" className="button button-secondary" href={`/admin/calendar?week=${isoDate(next)}`}><ArrowRight aria-hidden="true" size={18} /></Link></div></div><div className="admin-calendar">{days.map((day) => { const dayBookings = bookings.filter((booking) => booking.appointmentStartAt && new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Brussels", year: "numeric", month: "2-digit", day: "2-digit" }).format(booking.appointmentStartAt) === isoDate(day)); return <section className="admin-calendar-day" key={day.toISOString()}><header><span>{day.toLocaleDateString("en-BE", { weekday: "short", timeZone: "UTC" })}</span><strong>{day.getUTCDate()}</strong></header>{dayBookings.length ? dayBookings.map((booking) => <Link href={`/admin/bookings/${booking.publicReference}`} key={booking.id}><time>{booking.appointmentStartAt?.toLocaleTimeString("en-BE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Brussels" })}</time><strong>{booking.customerName}</strong><span>{booking.service.name} · {booking.postcode}</span><StatusBadge status={booking.status} /></Link>) : <div className="admin-calendar-empty"><CalendarDays aria-hidden="true" size={18} />No work</div>}</section>; })}</div></div></AdminShell>;
}
