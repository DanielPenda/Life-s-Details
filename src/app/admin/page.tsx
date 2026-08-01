import type { BookingStatus, PaymentStatus, Prisma } from "@prisma/client";
import { ArrowRight, Banknote, CalendarCheck, CircleAlert, ClipboardCheck, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { formatAdminDate, PaymentBadge, StatusBadge } from "@/components/admin-booking-ui";
import { requireAdminSession } from "@/lib/admin-auth";
import { formatMoney } from "@/lib/admin-booking";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Booking desk", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const statuses: BookingStatus[] = ["REQUESTED", "REVIEWING", "CONFIRMED", "RESCHEDULE_REQUIRED", "COMPLETED", "CANCELLED", "NO_SHOW"];
const paymentStatuses: PaymentStatus[] = ["UNPAID", "PAID"];

function validDate(value?: string) { const date = value ? new Date(`${value}T00:00:00.000Z`) : null; return date && !Number.isNaN(date.valueOf()) ? date : null; }

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const [user, filters] = await Promise.all([requireAdminSession(), searchParams]);
  const status = statuses.includes(filters.status as BookingStatus) ? filters.status as BookingStatus : undefined;
  const paymentStatus = paymentStatuses.includes(filters.paymentStatus as PaymentStatus) ? filters.paymentStatus as PaymentStatus : undefined;
  const from = validDate(filters.from); const to = validDate(filters.to); if (to) to.setUTCHours(23, 59, 59, 999);
  const query = filters.q?.trim();
  const where: Prisma.BookingWhereInput = {
    ...(status ? { status } : {}), ...(paymentStatus ? { paymentStatus } : {}),
    ...(filters.service ? { service: { slug: filters.service } } : {}),
    ...(from || to ? { preferredDate: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } } : {}),
    ...(query ? { OR: [
      { customerName: { contains: query, mode: "insensitive" } },
      { publicReference: { contains: query, mode: "insensitive" } },
      { postcode: { contains: query, mode: "insensitive" } },
    ] } : {}),
  };
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0); const tomorrow = new Date(todayStart); tomorrow.setDate(tomorrow.getDate() + 1);
  const [bookings, services, newCount, awaitingCount, upcomingCount, todayCount, completedCount, cancelledCount, revenue] = await Promise.all([
    prisma.booking.findMany({ where, include: { service: true, addOns: { include: { addOn: true } } }, orderBy: [{ createdAt: "desc" }], take: 100 }),
    prisma.service.findMany({ where: { active: true }, orderBy: { displayOrder: "asc" } }),
    prisma.booking.count({ where: { status: "REQUESTED" } }),
    prisma.booking.count({ where: { status: { in: ["REQUESTED", "REVIEWING", "RESCHEDULE_REQUIRED"] } } }),
    prisma.booking.count({ where: { status: "CONFIRMED", appointmentStartAt: { gte: tomorrow } } }),
    prisma.booking.count({ where: { status: "CONFIRMED", appointmentStartAt: { gte: todayStart, lt: tomorrow } } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({ where: { status: "CANCELLED" } }),
    prisma.booking.aggregate({ where: { status: "COMPLETED" }, _sum: { finalPrice: true } }),
  ]);

  return <AdminShell email={user.email ?? "owner"}><div className="admin-content"><div className="admin-page-heading"><div><p className="eyebrow">Owner dashboard</p><h1>Booking desk</h1><p>Review requests, schedule work and keep every payment recorded.</p></div><Link className="button button-primary" href="/admin/calendar"><CalendarCheck aria-hidden="true" size={18} />Open calendar</Link></div>
    <section aria-label="Booking summary" className="admin-metrics">
      <div><CircleAlert aria-hidden="true" /><span>New</span><strong>{newCount}</strong></div><div><ClipboardCheck aria-hidden="true" /><span>Awaiting action</span><strong>{awaitingCount}</strong></div><div><CalendarCheck aria-hidden="true" /><span>Today / upcoming</span><strong>{todayCount} / {upcomingCount}</strong></div><div><span>Completed / cancelled</span><strong>{completedCount} / {cancelledCount}</strong></div><div><Banknote aria-hidden="true" /><span>Completed revenue</span><strong>{formatMoney(revenue._sum.finalPrice ?? 0)}</strong></div>
    </section>
    <form className="admin-filters" method="get"><label><span>Search</span><div><Search aria-hidden="true" size={17} /><input defaultValue={filters.q} name="q" placeholder="Name, reference or postcode" /></div></label><label><span>Status</span><select defaultValue={status ?? ""} name="status"><option value="">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select></label><label><span>Service</span><select defaultValue={filters.service ?? ""} name="service"><option value="">All services</option>{services.map((service) => <option key={service.id} value={service.slug}>{service.name}</option>)}</select></label><label><span>Payment</span><select defaultValue={paymentStatus ?? ""} name="paymentStatus"><option value="">All payments</option>{paymentStatuses.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>From</span><input defaultValue={filters.from} name="from" type="date" /></label><label><span>To</span><input defaultValue={filters.to} name="to" type="date" /></label><button className="button button-secondary" type="submit">Apply filters</button></form>
    <section className="admin-bookings"><div className="admin-section-title"><h2>Bookings</h2><span>{bookings.length} shown</span></div>{bookings.length ? <div className="admin-booking-list">{bookings.map((booking) => <Link className="admin-booking-row" href={`/admin/bookings/${booking.publicReference}`} key={booking.id}><div className="admin-booking-main"><div><strong>{booking.customerName}</strong><code>{booking.publicReference}</code></div><span>{booking.service.name} · {booking.vehicleMake} {booking.vehicleModel}</span><small>{booking.postcode} {booking.city} · requested {formatAdminDate(booking.preferredDate)}</small></div><div className="admin-booking-state"><StatusBadge status={booking.status} /><PaymentBadge status={booking.paymentStatus} /><span>{formatAdminDate(booking.appointmentStartAt, true)}</span></div><ArrowRight aria-hidden="true" size={19} /></Link>)}</div> : <div className="admin-empty"><ClipboardCheck aria-hidden="true" size={30} /><h3>No bookings match these filters.</h3><p>Clear one or more filters to return to the full queue.</p></div>}</section>
  </div></AdminShell>;
}
