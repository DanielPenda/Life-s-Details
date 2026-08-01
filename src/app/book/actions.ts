"use server";

import { headers } from "next/headers";
import { businessInfo } from "@/config/business";
import { createBookingReference, hashBookingAccessToken } from "@/lib/booking-reference";
import { parseBookingFormData } from "@/lib/booking-schema";
import { sendBookingNotifications } from "@/lib/email";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { checkBookingRateLimit } from "@/lib/rate-limit";

export type BookingActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[]>;
  reference?: string;
  confirmationUrl?: string;
};

function confirmationUrl(reference: string, token: string) {
  return `${env.NEXT_PUBLIC_SITE_URL}/book/confirmation/${reference}?token=${encodeURIComponent(token)}`;
}

export async function submitBookingRequest(
  _previousState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  const requestHeaders = await headers();
  const clientKey =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    requestHeaders.get("x-real-ip") ??
    "local";
  const limit = checkBookingRateLimit(clientKey);

  if (!limit.allowed) {
    return {
      status: "error",
      message: `Too many booking attempts. Please try again in about ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
    };
  }

  const parsed = parseBookingFormData(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted details before sending your request.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const input = parsed.data;

  try {
    const duplicate = await prisma.booking.findUnique({
      where: { idempotencyKey: input.idempotencyKey },
      select: { publicReference: true },
    });

    if (duplicate) {
      return {
        status: "success",
        reference: duplicate.publicReference,
        confirmationUrl: confirmationUrl(duplicate.publicReference, input.idempotencyKey),
      };
    }

    const [service, selectedAddOns] = await Promise.all([
      prisma.service.findFirst({ where: { slug: input.serviceSlug, active: true } }),
      prisma.addOn.findMany({
        where: { slug: { in: input.addOnSlugs }, active: true },
      }),
    ]);

    if (!service) {
      return { status: "error", message: "That service is no longer available. Please choose another package." };
    }

    if (selectedAddOns.length !== new Set(input.addOnSlugs).size) {
      return { status: "error", message: "One of the selected add-ons is no longer available." };
    }

    const addOnTotal = selectedAddOns.reduce((total, addOn) => total + Number(addOn.price), 0);
    const estimatedPrice = service.basePrice === null ? null : Number(service.basePrice) + addOnTotal;
    const publicReference = createBookingReference();
    const created = await prisma.booking.create({
      data: {
        publicReference,
        accessTokenHash: hashBookingAccessToken(input.idempotencyKey),
        idempotencyKey: input.idempotencyKey,
        customerName: input.customerName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        preferredContactMethod: input.preferredContactMethod,
        serviceId: service.id,
        preferredDate: new Date(`${input.preferredDate}T00:00:00.000Z`),
        preferredTimeWindow: input.preferredTimeWindow,
        alternativeDate: input.alternativeDate
          ? new Date(`${input.alternativeDate}T00:00:00.000Z`)
          : null,
        addressLine: input.addressLine,
        postcode: input.postcode,
        city: input.city,
        serviceLocationType: input.serviceLocationType,
        vehicleMake: input.vehicleMake,
        vehicleModel: input.vehicleModel,
        vehicleType: input.vehicleType,
        vehicleColour: input.vehicleColour || null,
        licencePlateOptional: input.licencePlateOptional || null,
        vehicleCondition: input.vehicleCondition,
        hasPetHair: input.hasPetHair,
        hasStains: input.hasStains,
        hasStrongOdour: input.hasStrongOdour,
        conditionNotes: input.conditionNotes || null,
        accessToWater: input.accessToWater,
        accessToElectricity: input.accessToElectricity,
        paymentMethodPreference: input.paymentMethodPreference || null,
        estimatedPrice,
        acquisitionSource: input.acquisitionSource || null,
        customerConsent: true,
        consentAt: new Date(),
        marketingConsent: input.marketingConsent,
        marketingConsentAt: input.marketingConsent ? new Date() : null,
        addOns: {
          create: selectedAddOns.map((addOn) => ({ addOn: { connect: { id: addOn.id } } })),
        },
        statusHistory: {
          create: { toStatus: "REQUESTED", note: "Booking request submitted by customer." },
        },
      },
      select: { publicReference: true },
    });

    const url = confirmationUrl(created.publicReference, input.idempotencyKey);
    await sendBookingNotifications({
      reference: created.publicReference,
      customerName: input.customerName,
      customerEmail: input.email,
      serviceName: service.name,
      preferredDate: input.preferredDate,
      preferredTimeWindow: input.preferredTimeWindow,
      preferredContactMethod: input.preferredContactMethod,
      phone: input.phone,
      vehicle: `${input.vehicleMake} ${input.vehicleModel} (${input.vehicleType}, ${input.vehicleCondition.toLowerCase()} dirt)`,
      location: `${input.addressLine}, ${input.postcode} ${input.city}`,
      addOns: selectedAddOns.map((addOn) => addOn.name),
      notes: input.conditionNotes || "",
      confirmationUrl: url,
    }).catch((error: unknown) => {
      console.error("booking_notification_failed", {
        reference: created.publicReference,
        reason: error instanceof Error ? error.message : "Unknown email error",
      });
    });

    return { status: "success", reference: created.publicReference, confirmationUrl: url };
  } catch (error) {
    console.error("booking_request_failed", {
      reason: error instanceof Error ? error.message : "Unknown persistence error",
    });
    return {
      status: "error",
      message: `We could not save your request. Please contact us at ${businessInfo.phone.display} or try again shortly.`,
    };
  }
}
