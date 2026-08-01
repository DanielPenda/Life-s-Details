CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID');
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'CARD', 'PAYCONIQ', 'OTHER');

ALTER TABLE "Booking"
  ADD COLUMN "appointmentStartAt" TIMESTAMP(3),
  ADD COLUMN "appointmentEndAt" TIMESTAMP(3),
  ADD COLUMN "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
  ADD COLUMN "paymentMethod" "PaymentMethod",
  ADD COLUMN "paidAt" TIMESTAMP(3);

CREATE TABLE "BookingAuditLog" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "field" TEXT,
  "fromValue" TEXT,
  "toValue" TEXT,
  "note" TEXT,
  "actorEmail" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BookingAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Booking_appointmentStartAt_idx" ON "Booking"("appointmentStartAt");
CREATE INDEX "Booking_paymentStatus_idx" ON "Booking"("paymentStatus");
CREATE INDEX "BookingAuditLog_bookingId_createdAt_idx" ON "BookingAuditLog"("bookingId", "createdAt");

ALTER TABLE "BookingAuditLog" ADD CONSTRAINT "BookingAuditLog_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BookingAuditLog" ENABLE ROW LEVEL SECURITY;
