"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { type FieldPath, get, useForm } from "react-hook-form";
import { bookingRequestSchema, type BookingRequestInput } from "@/lib/booking-schema";
import {
  initialBookingActionState,
  submitBookingRequest,
} from "./actions";

type ServiceOption = {
  readonly name: string;
  readonly slug: string;
  readonly bestFor: string;
  readonly duration: string;
  readonly priceLabel: string;
  readonly basePrice: number | null;
};

type AddOnOption = {
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly price: number;
};

const steps = ["Service", "Vehicle", "Location", "Timing", "Contact", "Review"];
const stepFields: FieldPath<BookingRequestInput>[][] = [
  ["serviceSlug"],
  ["vehicleType", "vehicleMake", "vehicleModel", "vehicleCondition"],
  ["addressLine", "postcode", "city", "serviceLocationType", "accessToWater", "accessToElectricity"],
  ["preferredDate", "preferredTimeWindow"],
  ["customerName", "phone", "email", "preferredContactMethod", "customerConsent"],
  [],
];

const defaultValues: BookingRequestInput = {
  serviceSlug: "",
  addOnSlugs: [],
  vehicleType: "medium-car",
  vehicleMake: "",
  vehicleModel: "",
  vehicleColour: "",
  licencePlateOptional: "",
  vehicleCondition: "MODERATE",
  hasPetHair: false,
  hasStains: false,
  hasStrongOdour: false,
  conditionNotes: "",
  addressLine: "",
  postcode: "9880",
  city: "Aalter",
  serviceLocationType: "HOME",
  accessToWater: true,
  accessToElectricity: true,
  preferredDate: "",
  preferredTimeWindow: "MORNING",
  alternativeDate: "",
  customerName: "",
  phone: "",
  email: "",
  preferredContactMethod: "WHATSAPP",
  paymentMethodPreference: "DISCUSS_LATER",
  acquisitionSource: "",
  customerConsent: false,
  marketingConsent: false,
  idempotencyKey: "",
  website: "",
};

function formatChoice(value: string) {
  return value.toLowerCase().replaceAll("_", " ").replaceAll("-", " ");
}

export function BookingForm({
  services,
  addOns,
  initialService,
}: {
  services: readonly ServiceOption[];
  addOns: readonly AddOnOption[];
  initialService: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [actionState, formAction] = useActionState(
    submitBookingRequest,
    initialBookingActionState,
  );
  const [isSubmitting, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingRequestInput>({
    resolver: zodResolver(bookingRequestSchema),
    defaultValues: { ...defaultValues, serviceSlug: initialService },
    mode: "onBlur",
  });

  const values = watch();
  const selectedService = services.find((service) => service.slug === values.serviceSlug);
  const selectedAddOns = addOns.filter((addOn) => values.addOnSlugs.includes(addOn.slug));
  const estimate = selectedService?.basePrice === null
    ? null
    : (selectedService?.basePrice ?? 0) + selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setValue("idempotencyKey", crypto.randomUUID());
  }, [setValue]);

  useEffect(() => {
    if (actionState.status === "success" && actionState.confirmationUrl) {
      router.push(actionState.confirmationUrl);
    }
  }, [actionState, router]);

  const goNext = async () => {
    const valid = await trigger(stepFields[step], { shouldFocus: true });
    if (valid) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submit = handleSubmit(() => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    startTransition(() => formAction(data));
  });

  const errorFor = (name: FieldPath<BookingRequestInput>) =>
    (get(errors, name)?.message as string | undefined) ?? actionState.fieldErrors?.[name]?.[0];

  return (
    <div className="booking-workspace">
      <nav aria-label="Booking progress" className="booking-progress">
        <ol>
          {steps.map((label, index) => (
            <li aria-current={index === step ? "step" : undefined} key={label}>
              <button
                aria-label={`Go to ${label}`}
                disabled={index > step}
                onClick={() => index <= step && setStep(index)}
                type="button"
              >
                <span>{index < step ? <Check aria-hidden="true" size={15} /> : index + 1}</span>
                <small>{label}</small>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <form className="booking-form" noValidate onSubmit={submit} ref={formRef}>
        <input {...register("idempotencyKey")} type="hidden" />
        <div aria-hidden="true" className="honeypot">
          <label htmlFor="website">Website</label>
          <input {...register("website")} autoComplete="off" id="website" tabIndex={-1} />
        </div>

        <section className="booking-step" hidden={step !== 0}>
          <div className="step-heading"><span>Step 1 of 6</span><h2>Choose a service</h2><p>Start with the closest match. We can adjust it after reviewing your vehicle.</p></div>
          <div className="choice-grid service-choice-grid">
            {services.map((service) => (
              <label className="choice-card" data-selected={values.serviceSlug === service.slug} key={service.slug}>
                <input {...register("serviceSlug")} type="radio" value={service.slug} />
                <span className="choice-mark"><Check aria-hidden="true" size={15} /></span>
                <strong>{service.name}</strong>
                <small>{service.bestFor}</small>
                <b>{service.priceLabel}</b>
              </label>
            ))}
          </div>
          {errorFor("serviceSlug") ? <p className="field-error">{errorFor("serviceSlug")}</p> : null}
          <fieldset className="booking-fieldset">
            <legend>Optional add-ons</legend>
            <div className="choice-grid addon-choice-grid">
              {addOns.map((addOn) => (
                <label className="check-card" key={addOn.slug}>
                  <input {...register("addOnSlugs")} type="checkbox" value={addOn.slug} />
                  <span><strong>{addOn.name}</strong><small>{addOn.description}</small></span>
                  <b>+€{addOn.price}</b>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="booking-step" hidden={step !== 1}>
          <div className="step-heading"><span>Step 2 of 6</span><h2>Your vehicle</h2><p>A few practical details help us allow enough time.</p></div>
          <div className="form-grid two-columns">
            <Field label="Vehicle type" error={errorFor("vehicleType")}>
              <select {...register("vehicleType")}><option value="small-car">Small car</option><option value="medium-car">Medium car</option><option value="large-car">Large car / SUV</option><option value="van">Van</option></select>
            </Field>
            <Field label="General condition" error={errorFor("vehicleCondition")}>
              <select {...register("vehicleCondition")}><option value="LIGHT">Light dirt</option><option value="MODERATE">Moderate dirt</option><option value="HEAVY">Heavy dirt</option></select>
            </Field>
            <Field label="Make" error={errorFor("vehicleMake")}><input {...register("vehicleMake")} autoComplete="off" placeholder="e.g. Volkswagen" /></Field>
            <Field label="Model" error={errorFor("vehicleModel")}><input {...register("vehicleModel")} autoComplete="off" placeholder="e.g. Golf" /></Field>
            <Field label="Colour (optional)"><input {...register("vehicleColour")} autoComplete="off" /></Field>
            <Field label="Licence plate (optional)"><input {...register("licencePlateOptional")} autoCapitalize="characters" autoComplete="off" /></Field>
          </div>
          <fieldset className="booking-fieldset"><legend>Anything needing extra attention?</legend><div className="inline-checks">
            <CheckOption label="Pet hair" registration={register("hasPetHair")} />
            <CheckOption label="Seat stains" registration={register("hasStains")} />
            <CheckOption label="Strong odour" registration={register("hasStrongOdour")} />
          </div></fieldset>
          <Field label="Condition notes (optional)" hint="Please do not include sensitive personal information."><textarea {...register("conditionNotes")} maxLength={600} rows={4} /></Field>
        </section>

        <section className="booking-step" hidden={step !== 2}>
          <div className="step-heading"><span>Step 3 of 6</span><h2>Service location</h2><p>We currently work in Aalter and nearby areas. Travel fees may apply outside the core zone.</p></div>
          <div className="form-grid">
            <Field label="Street and number" error={errorFor("addressLine")}><input {...register("addressLine")} autoComplete="street-address" /></Field>
            <div className="form-grid postcode-grid">
              <Field label="Postcode" error={errorFor("postcode")}><input {...register("postcode")} autoComplete="postal-code" inputMode="numeric" maxLength={4} /></Field>
              <Field label="City or town" error={errorFor("city")}><input {...register("city")} autoComplete="address-level2" /></Field>
            </div>
            <Field label="Where will we work?" error={errorFor("serviceLocationType")}><select {...register("serviceLocationType")}><option value="HOME">Home</option><option value="WORKPLACE">Workplace</option><option value="OTHER">Another location</option></select></Field>
          </div>
          <div className="form-grid two-columns">
            <YesNo legend="Access to water" name="accessToWater" onChange={(value) => setValue("accessToWater", value)} value={values.accessToWater} />
            <YesNo legend="Access to electricity" name="accessToElectricity" onChange={(value) => setValue("accessToElectricity", value)} value={values.accessToElectricity} />
          </div>
        </section>

        <section className="booking-step" hidden={step !== 3}>
          <div className="step-heading"><span>Step 4 of 6</span><h2>Preferred timing</h2><p>This is a preference, not live availability. We will confirm the final appointment with you.</p></div>
          <div className="form-grid two-columns">
            <Field label="Preferred date" error={errorFor("preferredDate")}><input {...register("preferredDate")} min={today} type="date" /></Field>
            <Field label="Time window" error={errorFor("preferredTimeWindow")}><select {...register("preferredTimeWindow")}><option value="MORNING">Morning</option><option value="AFTERNOON">Afternoon</option><option value="EVENING">Evening</option></select></Field>
            <Field label="Alternative date (optional)"><input {...register("alternativeDate")} min={today} type="date" /></Field>
          </div>
        </section>

        <section className="booking-step" hidden={step !== 4}>
          <div className="step-heading"><span>Step 5 of 6</span><h2>Contact details</h2><p>We use these details to review and respond to this request.</p></div>
          <div className="form-grid two-columns">
            <Field label="Name" error={errorFor("customerName")}><input {...register("customerName")} autoComplete="name" /></Field>
            <Field label="Phone" error={errorFor("phone")}><input {...register("phone")} autoComplete="tel" inputMode="tel" /></Field>
            <Field label="Email" error={errorFor("email")}><input {...register("email")} autoComplete="email" inputMode="email" type="email" /></Field>
            <Field label="Preferred contact method" error={errorFor("preferredContactMethod")}><select {...register("preferredContactMethod")}><option value="WHATSAPP">WhatsApp</option><option value="PHONE">Phone</option><option value="EMAIL">Email</option></select></Field>
            <Field label="Payment preference (optional)"><select {...register("paymentMethodPreference")}><option value="DISCUSS_LATER">Discuss later</option><option value="CASH">Cash</option><option value="CARD">Card</option><option value="BANK_TRANSFER">Bank transfer</option></select></Field>
            <Field label="How did you find us? (optional)"><input {...register("acquisitionSource")} placeholder="e.g. Google, Instagram, referral" /></Field>
          </div>
          <div className="consent-list">
            <label className="consent-option"><input {...register("customerConsent")} type="checkbox" /><span>I agree that Life&apos;s Details may use these details to process and respond to my booking request. <a href="/privacy" target="_blank">Privacy notice</a>.</span></label>
            {errorFor("customerConsent") ? <p className="field-error">{errorFor("customerConsent")}</p> : null}
            <label className="consent-option"><input {...register("marketingConsent")} type="checkbox" /><span>Send me occasional offers and detailing reminders. Optional and unchecked by default.</span></label>
          </div>
        </section>

        <section className="booking-step" hidden={step !== 5}>
          <div className="step-heading"><span>Step 6 of 6</span><h2>Review your request</h2><p>Check the essentials before sending. Nothing is confirmed until we contact you.</p></div>
          <div className="review-list">
            <ReviewBlock title="Service" onEdit={() => setStep(0)}><strong>{selectedService?.name ?? "Not selected"}</strong><span>{selectedAddOns.length ? selectedAddOns.map((item) => item.name).join(", ") : "No add-ons"}</span><b>{estimate === null ? "Estimate after inspection" : `Estimated from €${estimate}`}</b></ReviewBlock>
            <ReviewBlock title="Vehicle" onEdit={() => setStep(1)}><strong>{values.vehicleMake} {values.vehicleModel}</strong><span>{formatChoice(values.vehicleType)} · {formatChoice(values.vehicleCondition)} dirt</span></ReviewBlock>
            <ReviewBlock title="Location" onEdit={() => setStep(2)}><strong>{values.addressLine}</strong><span>{values.postcode} {values.city} · {formatChoice(values.serviceLocationType)}</span></ReviewBlock>
            <ReviewBlock title="Preferred time" onEdit={() => setStep(3)}><strong>{values.preferredDate || "No date selected"}</strong><span>{formatChoice(values.preferredTimeWindow)}{values.alternativeDate ? ` · Alternative ${values.alternativeDate}` : ""}</span></ReviewBlock>
            <ReviewBlock title="Contact" onEdit={() => setStep(4)}><strong>{values.customerName}</strong><span>{values.email} · {values.phone}</span><span>Reply by {formatChoice(values.preferredContactMethod)}</span></ReviewBlock>
          </div>
          <div className="request-notice"><ShieldCheck aria-hidden="true" /><p><strong>This sends a request, not a confirmed appointment.</strong><span>We will check the service, location and timing before confirming.</span></p></div>
        </section>

        {actionState.status === "error" ? <div className="form-alert" role="alert"><strong>Request not sent</strong><span>{actionState.message}</span></div> : null}

        <div className="booking-actions">
          {step > 0 ? <button className="button button-secondary" onClick={() => setStep((current) => current - 1)} type="button"><ArrowLeft aria-hidden="true" size={18} /> Back</button> : <span />}
          {step < steps.length - 1 ? <button className="button button-primary" onClick={goNext} type="button">Continue <ArrowRight aria-hidden="true" size={18} /></button> : <button className="button button-primary" disabled={isSubmitting || !values.idempotencyKey} type="submit">{isSubmitting ? <LoaderCircle aria-hidden="true" className="spin" size={18} /> : <Check aria-hidden="true" size={18} />} {isSubmitting ? "Sending..." : "Send booking request"}</button>}
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return <label className="form-field"><span>{label}</span>{children}{hint ? <small>{hint}</small> : null}{error ? <small className="field-error">{error}</small> : null}</label>;
}

function CheckOption({ label, registration }: { label: string; registration: ReturnType<ReturnType<typeof useForm<BookingRequestInput>>["register"]> }) {
  return <label className="inline-check"><input {...registration} type="checkbox" /><span>{label}</span></label>;
}

function YesNo({ legend, name, onChange, value }: { legend: string; name: string; onChange: (value: boolean) => void; value: boolean }) {
  return <fieldset className="yes-no"><legend>{legend}</legend><div><label data-selected={value}><input checked={value} name={name} onChange={() => onChange(true)} type="radio" value="true" />Yes</label><label data-selected={!value}><input checked={!value} name={name} onChange={() => onChange(false)} type="radio" value="false" />No</label></div></fieldset>;
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return <article className="review-block"><div><h3>{title}</h3><button onClick={onEdit} type="button">Edit</button></div>{children}</article>;
}
