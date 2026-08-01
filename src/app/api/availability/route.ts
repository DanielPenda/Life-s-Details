import { NextResponse } from "next/server";
import { getAvailableSchedule } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const service = url.searchParams.get("service")?.trim() ?? "";
  const addOns = url.searchParams.getAll("addOn").filter(Boolean);
  if (!service) return NextResponse.json({ durationMinutes: 0, days: [] });
  return NextResponse.json(await getAvailableSchedule(service, addOns), {
    headers: { "Cache-Control": "no-store" },
  });
}
