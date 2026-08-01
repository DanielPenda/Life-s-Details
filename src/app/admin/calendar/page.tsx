import { ArrowLeft, ArrowRight, CalendarDays, Clock3, X } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge } from "@/components/admin-booking-ui";
import { requireAdminSession } from "@/lib/admin-auth";
import { brusselsLocalToUtc } from "@/lib/admin-booking";
import { minutesToTime } from "@/lib/availability";
import { prisma } from "@/lib/prisma";
import { closeAvailability, saveAvailability } from "./actions";

export const metadata: Metadata = { title: "Availability calendar", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
function startOfWeek(input?: string) { const date = input && /^\d{4}-\d{2}-\d{2}$/.test(input) ? new Date(`${input}T12:00:00Z`) : new Date(); const day = date.getUTCDay() || 7; date.setUTCDate(date.getUTCDate() - day + 1); date.setUTCHours(0, 0, 0, 0); return date; }
function isoDate(date: Date) { return date.toISOString().slice(0, 10); }

export default async function AdminCalendar({ searchParams }: { searchParams: Promise<{ week?: string; saved?: string; closed?: string; error?: string }> }) {
  const [user, query] = await Promise.all([requireAdminSession(), searchParams]);
  const start = startOfWeek(query.week); const end = new Date(start); end.setUTCDate(end.getUTCDate() + 7);
  const queryStart = brusselsLocalToUtc(isoDate(start), "00:00") ?? start; const queryEnd = brusselsLocalToUtc(isoDate(end), "00:00") ?? end;
  const previous = new Date(start); previous.setUTCDate(previous.getUTCDate() - 7); const next = new Date(start); next.setUTCDate(next.getUTCDate() + 7);
  const [bookings, availability] = await Promise.all([
    prisma.booking.findMany({ where: { appointmentStartAt: { gte: queryStart, lt: queryEnd }, status: { notIn: ["CANCELLED"] } }, include: { service: true }, orderBy: { appointmentStartAt: "asc" } }),
    prisma.workAvailability.findMany({ where: { date: { gte: start, lt: end } }, orderBy: { date: "asc" } }),
  ]);
  const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(start); date.setUTCDate(date.getUTCDate() + index); return date; });
  return <AdminShell email={user.email ?? "owner"}><div className="admin-content">
    <div className="admin-page-heading"><div><p className="eyebrow">Schedule</p><h1>Availability calendar</h1><p>Open one day or apply the same working hours across a date range.</p></div><div className="admin-week-actions"><Link aria-label="Previous week" className="button button-secondary" href={`/admin/calendar?week=${isoDate(previous)}`}><ArrowLeft aria-hidden="true" size={18} /></Link><Link className="button button-secondary" href="/admin/calendar">Today</Link><Link aria-label="Next week" className="button button-secondary" href={`/admin/calendar?week=${isoDate(next)}`}><ArrowRight aria-hidden="true" size={18} /></Link></div></div>
    {query.error ? <div className="form-alert" role="alert">{query.error}</div> : null}{query.saved ? <div className="admin-success">Availability saved for {query.saved} day{query.saved === "1" ? "" : "s"}.</div> : null}{query.closed ? <div className="admin-success">Day closed for new bookings.</div> : null}
    <form action={saveAvailability} className="availability-form"><input name="week" type="hidden" value={isoDate(start)} /><label><span>From</span><input defaultValue={isoDate(start)} name="from" required type="date" /></label><label><span>To</span><input defaultValue={isoDate(start)} name="to" required type="date" /></label><label><span>Opens</span><input defaultValue="09:00" name="openTime" required type="time" /></label><label><span>Closes</span><input defaultValue="17:00" name="closeTime" required type="time" /></label><button className="button button-primary" type="submit"><Clock3 aria-hidden="true" size={18} />Save availability</button></form>
    <div className="admin-calendar">{days.map((day) => { const date = isoDate(day); const window = availability.find((item) => isoDate(item.date) === date); const dayBookings = bookings.filter((booking) => booking.appointmentStartAt && new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Brussels", year: "numeric", month: "2-digit", day: "2-digit" }).format(booking.appointmentStartAt) === date); return <section className="admin-calendar-day" key={date}><header><span>{day.toLocaleDateString("en-BE", { weekday: "short", timeZone: "UTC" })}</span><strong>{day.getUTCDate()}</strong></header>{window ? <div className="availability-window"><span><Clock3 aria-hidden="true" size={14} />{minutesToTime(window.startMinute)}-{minutesToTime(window.endMinute)}</span><form action={closeAvailability}><input name="date" type="hidden" value={date} /><input name="week" type="hidden" value={isoDate(start)} /><button aria-label={`Close ${date}`} title="Close this day" type="submit"><X aria-hidden="true" size={15} /></button></form></div> : <div className="availability-closed">Closed</div>}{dayBookings.length ? dayBookings.map((booking) => <Link href={`/admin/bookings/${booking.publicReference}`} key={booking.id}><time>{booking.appointmentStartAt?.toLocaleTimeString("en-BE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Brussels" })}</time><strong>{booking.customerName}</strong><span>{booking.service.name} · {booking.postcode}</span><StatusBadge status={booking.status} /></Link>) : <div className="admin-calendar-empty"><CalendarDays aria-hidden="true" size={18} />No bookings</div>}</section>; })}</div>
  </div></AdminShell>;
}
