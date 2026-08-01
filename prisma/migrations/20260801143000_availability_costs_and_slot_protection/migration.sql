DO $$ BEGIN
  CREATE TYPE "CostCategory" AS ENUM ('TRANSPORT', 'PRODUCTS', 'EQUIPMENT', 'SUBSCRIPTIONS', 'OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "WorkAvailability" (
  "id" TEXT NOT NULL,
  "date" DATE NOT NULL,
  "startMinute" INTEGER NOT NULL,
  "endMinute" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "WorkAvailability_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "WorkAvailability_valid_window" CHECK ("startMinute" >= 0 AND "endMinute" <= 1440 AND "startMinute" < "endMinute")
);

CREATE TABLE IF NOT EXISTS "BusinessCost" (
  "id" TEXT NOT NULL,
  "incurredOn" DATE NOT NULL,
  "category" "CostCategory" NOT NULL,
  "description" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BusinessCost_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BusinessCost_positive_amount" CHECK ("amount" > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS "WorkAvailability_date_key" ON "WorkAvailability"("date");
CREATE INDEX IF NOT EXISTS "WorkAvailability_date_idx" ON "WorkAvailability"("date");
CREATE INDEX IF NOT EXISTS "BusinessCost_incurredOn_idx" ON "BusinessCost"("incurredOn");
CREATE INDEX IF NOT EXISTS "BusinessCost_category_incurredOn_idx" ON "BusinessCost"("category", "incurredOn");

CREATE EXTENSION IF NOT EXISTS btree_gist;
DO $$ BEGIN
  ALTER TABLE "Booking" ADD CONSTRAINT "Booking_no_active_appointment_overlap"
    EXCLUDE USING gist (tsrange("appointmentStartAt", "appointmentEndAt", '[)') WITH &&)
    WHERE ("appointmentStartAt" IS NOT NULL AND "appointmentEndAt" IS NOT NULL AND "status" IN ('REQUESTED', 'REVIEWING', 'CONFIRMED', 'RESCHEDULE_REQUIRED'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "WorkAvailability" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "BusinessCost" ENABLE ROW LEVEL SECURITY;
