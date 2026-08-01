CREATE TYPE "PricingType" AS ENUM ('FIXED', 'FROM', 'INSPECTION');
CREATE TYPE "BookingStatus" AS ENUM ('REQUESTED', 'REVIEWING', 'CONFIRMED', 'RESCHEDULE_REQUIRED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');
CREATE TYPE "PreferredContactMethod" AS ENUM ('WHATSAPP', 'PHONE', 'EMAIL');
CREATE TYPE "ServiceLocationType" AS ENUM ('HOME', 'WORKPLACE', 'OTHER');
CREATE TYPE "TimeWindow" AS ENUM ('MORNING', 'AFTERNOON', 'EVENING');
CREATE TYPE "VehicleCondition" AS ENUM ('LIGHT', 'MODERATE', 'HEAVY');
CREATE TYPE "PaymentMethodPreference" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER', 'DISCUSS_LATER');

CREATE TABLE "Service" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "fullDescription" TEXT NOT NULL,
  "basePrice" DECIMAL(10,2),
  "pricingType" "PricingType" NOT NULL,
  "estimatedDurationMinutes" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "displayOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AddOn" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "estimatedDurationMinutes" INTEGER NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "AddOn_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Booking" (
  "id" TEXT NOT NULL,
  "publicReference" TEXT NOT NULL,
  "accessTokenHash" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "status" "BookingStatus" NOT NULL DEFAULT 'REQUESTED',
  "customerName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "preferredContactMethod" "PreferredContactMethod" NOT NULL,
  "serviceId" TEXT NOT NULL,
  "preferredDate" DATE NOT NULL,
  "preferredTimeWindow" "TimeWindow" NOT NULL,
  "alternativeDate" DATE,
  "addressLine" TEXT NOT NULL,
  "postcode" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "serviceLocationType" "ServiceLocationType" NOT NULL,
  "vehicleMake" TEXT NOT NULL,
  "vehicleModel" TEXT NOT NULL,
  "vehicleType" TEXT NOT NULL,
  "vehicleColour" TEXT,
  "licencePlateOptional" TEXT,
  "vehicleCondition" "VehicleCondition" NOT NULL,
  "hasPetHair" BOOLEAN NOT NULL DEFAULT false,
  "hasStains" BOOLEAN NOT NULL DEFAULT false,
  "hasStrongOdour" BOOLEAN NOT NULL DEFAULT false,
  "conditionNotes" TEXT,
  "accessToWater" BOOLEAN NOT NULL,
  "accessToElectricity" BOOLEAN NOT NULL,
  "paymentMethodPreference" "PaymentMethodPreference",
  "estimatedPrice" DECIMAL(10,2),
  "finalPrice" DECIMAL(10,2),
  "acquisitionSource" TEXT,
  "customerConsent" BOOLEAN NOT NULL,
  "consentAt" TIMESTAMP(3) NOT NULL,
  "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
  "marketingConsentAt" TIMESTAMP(3),
  "internalNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BookingAddOn" (
  "bookingId" TEXT NOT NULL,
  "addOnId" TEXT NOT NULL,
  CONSTRAINT "BookingAddOn_pkey" PRIMARY KEY ("bookingId", "addOnId")
);

CREATE TABLE "BookingStatusHistory" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "fromStatus" "BookingStatus",
  "toStatus" "BookingStatus" NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BookingStatusHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
CREATE UNIQUE INDEX "AddOn_slug_key" ON "AddOn"("slug");
CREATE UNIQUE INDEX "Booking_publicReference_key" ON "Booking"("publicReference");
CREATE UNIQUE INDEX "Booking_idempotencyKey_key" ON "Booking"("idempotencyKey");
CREATE INDEX "Booking_status_createdAt_idx" ON "Booking"("status", "createdAt");
CREATE INDEX "Booking_preferredDate_idx" ON "Booking"("preferredDate");
CREATE INDEX "Booking_email_idx" ON "Booking"("email");
CREATE INDEX "BookingStatusHistory_bookingId_createdAt_idx" ON "BookingStatusHistory"("bookingId", "createdAt");
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BookingAddOn" ADD CONSTRAINT "BookingAddOn_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BookingAddOn" ADD CONSTRAINT "BookingAddOn_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "AddOn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BookingStatusHistory" ADD CONSTRAINT "BookingStatusHistory_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- These tables live in Supabase's exposed public schema. Prisma connects with
-- the database role, while API-facing anon/authenticated roles get no policies.
ALTER TABLE "Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AddOn" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BookingAddOn" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BookingStatusHistory" ENABLE ROW LEVEL SECURITY;
