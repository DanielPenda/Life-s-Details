import { CalendarDays, ClipboardList, LogOut } from "lucide-react";
import Link from "next/link";
import { logoutOwner } from "@/app/admin/actions";

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  return <section className="admin-app"><header className="admin-toolbar"><div><span>Life&apos;s Details</span><strong>Booking desk</strong></div><nav aria-label="Admin navigation"><Link href="/admin"><ClipboardList aria-hidden="true" size={18} />Bookings</Link><Link href="/admin/calendar"><CalendarDays aria-hidden="true" size={18} />Calendar</Link></nav><form action={logoutOwner}><button aria-label="Sign out" title="Sign out" type="submit"><LogOut aria-hidden="true" size={19} /></button></form></header><div className="admin-owner">Signed in as {email}</div>{children}</section>;
}
