import type { Metadata } from "next";
import { BookingVisitTracker } from "@/components/booking-visit-tracker";
import { addOns } from "@/config/add-ons";
import { services } from "@/config/services";
import { BookingForm } from "./booking-form";

export const metadata: Metadata = {
  title: "Request a Detail",
  description:
    "Send a structured mobile car-detailing request to Life's Details in Aalter. No account or instant payment required.",
};

type BookPageProps = { searchParams: Promise<{ service?: string }> };

export default async function BookPage({ searchParams }: BookPageProps) {
  const { service: selectedSlug } = await searchParams;
  const initialService = selectedSlug && services.some((service) => service.slug === selectedSlug)
    ? selectedSlug
    : "";

  return (
    <section className="booking-page">
      <BookingVisitTracker />
      <div className="container booking-shell">
        <header className="booking-intro">
          <p className="eyebrow">Booking request</p>
          <h1>Tell us what your car needs.</h1>
          <p>
            Choose a service and an exact open time. Your slot is held while we review the details.
          </p>
        </header>
        <BookingForm addOns={addOns} initialService={initialService} services={services} />
      </div>
    </section>
  );
}
