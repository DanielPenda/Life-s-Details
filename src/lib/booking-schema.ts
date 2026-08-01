import { z } from "zod";

const optionalShortText = z.string().trim().max(120).optional().or(z.literal(""));

export const bookingRequestSchema = z.object({
  serviceSlug: z.string().trim().min(1, "Choose a service."),
  addOnSlugs: z.array(z.string()).max(3),
  vehicleType: z.enum(["small-car", "medium-car", "large-car", "van"]),
  vehicleMake: z.string().trim().min(2, "Enter the vehicle make.").max(60),
  vehicleModel: z.string().trim().min(1, "Enter the vehicle model.").max(60),
  vehicleColour: optionalShortText,
  licencePlateOptional: optionalShortText,
  vehicleCondition: z.enum(["LIGHT", "MODERATE", "HEAVY"]),
  hasPetHair: z.boolean(),
  hasStains: z.boolean(),
  hasStrongOdour: z.boolean(),
  conditionNotes: z.string().trim().max(600).optional().or(z.literal("")),
  addressLine: z.string().trim().min(4, "Enter the service address.").max(160),
  postcode: z.string().trim().regex(/^\d{4}$/, "Enter a four-digit Belgian postcode."),
  city: z.string().trim().min(2, "Enter the city or town.").max(80),
  serviceLocationType: z.enum(["HOME", "WORKPLACE", "OTHER"]),
  accessToWater: z.boolean(),
  accessToElectricity: z.boolean(),
  preferredDate: z.string().date("Choose a preferred date."),
  preferredTimeWindow: z.enum(["MORNING", "AFTERNOON", "EVENING"]),
  alternativeDate: z.string().date().optional().or(z.literal("")),
  customerName: z.string().trim().min(2, "Enter your name.").max(100),
  phone: z.string().trim().min(8, "Enter a valid phone number.").max(30),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  preferredContactMethod: z.enum(["WHATSAPP", "PHONE", "EMAIL"]),
  paymentMethodPreference: z
    .enum(["CASH", "CARD", "BANK_TRANSFER", "DISCUSS_LATER"])
    .optional()
    .or(z.literal("")),
  acquisitionSource: optionalShortText,
  customerConsent: z.boolean().refine((value) => value, {
    message: "Consent is required to process the request.",
  }),
  marketingConsent: z.boolean(),
  idempotencyKey: z.string().uuid(),
  website: z.string().max(0),
}).superRefine((request, context) => {
  const today = new Date().toISOString().slice(0, 10);
  if (request.preferredDate < today) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["preferredDate"], message: "Choose today or a future date." });
  }
  if (request.alternativeDate && request.alternativeDate < today) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["alternativeDate"], message: "Choose today or a future date." });
  }
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export function parseBookingFormData(formData: FormData) {
  const checked = (name: string) => formData.has(name);
  const yesNo = (name: string) => formData.get(name) === "true";

  return bookingRequestSchema.safeParse({
    serviceSlug: formData.get("serviceSlug"),
    addOnSlugs: formData.getAll("addOnSlugs"),
    vehicleType: formData.get("vehicleType"),
    vehicleMake: formData.get("vehicleMake"),
    vehicleModel: formData.get("vehicleModel"),
    vehicleColour: formData.get("vehicleColour"),
    licencePlateOptional: formData.get("licencePlateOptional"),
    vehicleCondition: formData.get("vehicleCondition"),
    hasPetHair: checked("hasPetHair"),
    hasStains: checked("hasStains"),
    hasStrongOdour: checked("hasStrongOdour"),
    conditionNotes: formData.get("conditionNotes"),
    addressLine: formData.get("addressLine"),
    postcode: formData.get("postcode"),
    city: formData.get("city"),
    serviceLocationType: formData.get("serviceLocationType"),
    accessToWater: yesNo("accessToWater"),
    accessToElectricity: yesNo("accessToElectricity"),
    preferredDate: formData.get("preferredDate"),
    preferredTimeWindow: formData.get("preferredTimeWindow"),
    alternativeDate: formData.get("alternativeDate"),
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    preferredContactMethod: formData.get("preferredContactMethod"),
    paymentMethodPreference: formData.get("paymentMethodPreference"),
    acquisitionSource: formData.get("acquisitionSource"),
    customerConsent: checked("customerConsent"),
    marketingConsent: checked("marketingConsent"),
    idempotencyKey: formData.get("idempotencyKey"),
    website: formData.get("website") ?? "",
  });
}
