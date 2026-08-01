import { businessInfo } from "@/config/business";
import { env } from "@/lib/env";

type BookingEmail = {
  reference: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  preferredDate: string;
  preferredTimeWindow: string;
  preferredContactMethod: string;
  phone: string;
  vehicle: string;
  location: string;
  addOns: string[];
  notes: string;
  confirmationUrl: string;
};

type EmailMessage = { to: string; subject: string; text: string };

async function deliver(message: EmailMessage) {
  if (env.EMAIL_PROVIDER === "log") {
    console.info("booking_email_preview", {
      to: message.to,
      subject: message.subject,
    });
    return;
  }

  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required when EMAIL_PROVIDER=resend.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to: [message.to],
      subject: message.subject,
      text: message.text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email provider returned ${response.status}.`);
  }
}

export async function sendBookingNotifications(booking: BookingEmail) {
  const customerMessage: EmailMessage = {
    to: booking.customerEmail,
    subject: `We received your request ${booking.reference}`,
    text: [
      `Hello ${booking.customerName},`,
      "",
      `We received your request for ${booking.serviceName} on ${booking.preferredDate} (${booking.preferredTimeWindow.toLowerCase()}).`,
      "This is a booking request, not a confirmed appointment. We will review it and contact you using your preferred method.",
      "",
      `View your request: ${booking.confirmationUrl}`,
      "",
      "Life's Details",
    ].join("\n"),
  };

  const ownerMessage: EmailMessage = {
    to: businessInfo.email,
    subject: `New booking request ${booking.reference}`,
    text: [
      `New request from ${booking.customerName}.`,
      `Service: ${booking.serviceName}`,
      `Add-ons: ${booking.addOns.length ? booking.addOns.join(", ") : "None"}`,
      `Vehicle: ${booking.vehicle}`,
      `Preferred date: ${booking.preferredDate} (${booking.preferredTimeWindow.toLowerCase()})`,
      `Location: ${booking.location}`,
      `Preferred contact: ${booking.preferredContactMethod.toLowerCase()}`,
      `Phone: ${booking.phone}`,
      `Email: ${booking.customerEmail}`,
      `Condition notes: ${booking.notes || "None"}`,
      `Reference: ${booking.reference}`,
      "Review the request in the database until the Phase 3 admin dashboard is available.",
    ].join("\n"),
  };

  await Promise.all([deliver(customerMessage), deliver(ownerMessage)]);
}

export async function sendBookingConfirmation({
  customerEmail,
  customerName,
  reference,
  serviceName,
  appointmentStartAt,
  address,
}: {
  customerEmail: string;
  customerName: string;
  reference: string;
  serviceName: string;
  appointmentStartAt: Date;
  address: string;
}) {
  const appointment = new Intl.DateTimeFormat("en-BE", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Brussels",
  }).format(appointmentStartAt);

  await deliver({
    to: customerEmail,
    subject: `Your booking ${reference} is confirmed`,
    text: [
      `Hello ${customerName},`,
      "",
      `Your ${serviceName} booking is confirmed for ${appointment}.`,
      `Location: ${address}`,
      "",
      "Please remove valuables and make sure the vehicle and agreed water/electricity access are available when we arrive.",
      "Reply to this email or contact us if anything changes.",
      "",
      "Life's Details",
    ].join("\n"),
  });
}
