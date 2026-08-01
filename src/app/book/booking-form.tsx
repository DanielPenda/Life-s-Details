"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, LoaderCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { type FieldPath, get, useForm } from "react-hook-form";
import { useLocale, useTranslations } from "@/i18n/locale-provider";
import type { TranslationKey } from "@/i18n/translations";
import { bookingRequestSchema, type BookingRequestInput } from "@/lib/booking-schema";
import { submitBookingRequest, type BookingActionState } from "./actions";

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

const steps = ["booking.step.service", "booking.step.vehicle", "booking.step.location", "booking.step.timing", "booking.step.contact", "booking.step.review"] as const;
const initialBookingActionState: BookingActionState = { status: "idle" };
const stepFields: FieldPath<BookingRequestInput>[][] = [
  ["serviceSlug"],
  ["vehicleType", "vehicleMake", "vehicleModel", "vehicleCondition"],
  ["addressLine", "postcode", "city", "serviceLocationType", "accessToWater", "accessToElectricity"],
  ["preferredDate", "appointmentTime"],
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
  appointmentTime: "",
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

const validationMessageKeys: Record<string, TranslationKey> = {
  "Choose a service.": "validation.service",
  "Enter the vehicle make.": "validation.make",
  "Enter the vehicle model.": "validation.model",
  "Enter the service address.": "validation.address",
  "Enter a four-digit Belgian postcode.": "validation.postcode",
  "Enter the city or town.": "validation.city",
  "Choose a preferred date.": "validation.date",
  "Choose an available start time.": "validation.time",
  "Enter your name.": "validation.name",
  "Enter a valid phone number.": "validation.phone",
  "Enter a valid email address.": "validation.email",
  "Consent is required to process the request.": "validation.consent",
  "Choose today or a future date.": "validation.future",
};

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
  const locale = useLocale();
  const t = useTranslations();
  const formRef = useRef<HTMLFormElement>(null);
  const [step, setStep] = useState(0);
  const [actionState, formAction] = useActionState(
    submitBookingRequest,
    initialBookingActionState,
  );
  const [isSubmitting, startTransition] = useTransition();
  const [schedule, setSchedule] = useState<{ durationMinutes: number; days: { date: string; label: string; openTime: string; closeTime: string; slots: string[] }[] }>({ durationMinutes: 0, days: [] });
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
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
  const selectedAddOnKey = [...values.addOnSlugs].sort().join(",");
  const estimate = selectedService?.basePrice === null
    ? null
    : (selectedService?.basePrice ?? 0) + selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  useEffect(() => {
    setValue("idempotencyKey", crypto.randomUUID());
  }, [setValue]);

  useEffect(() => {
    if (actionState.status === "success" && actionState.confirmationUrl) {
      router.push(actionState.confirmationUrl);
    }
  }, [actionState, router]);

  useEffect(() => {
    setValue("preferredDate", ""); setValue("appointmentTime", "");
    if (!values.serviceSlug) { setSchedule({ durationMinutes: 0, days: [] }); return; }
    const controller = new AbortController(); const params = new URLSearchParams({ service: values.serviceSlug, locale });
    selectedAddOnKey.split(",").filter(Boolean).forEach((slug) => params.append("addOn", slug));
    setIsLoadingSchedule(true);
    fetch(`/api/availability?${params}`, { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Availability unavailable")))
      .then(setSchedule).catch((error: unknown) => { if (!(error instanceof DOMException && error.name === "AbortError")) setSchedule({ durationMinutes: 0, days: [] }); })
      .finally(() => { if (!controller.signal.aborted) setIsLoadingSchedule(false); });
    return () => controller.abort();
  }, [locale, selectedAddOnKey, setValue, values.serviceSlug]);

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

  const errorFor = (name: FieldPath<BookingRequestInput>) => {
    const message = (get(errors, name)?.message as string | undefined) ?? actionState.fieldErrors?.[name]?.[0];
    const key = message ? validationMessageKeys[message] : undefined;
    return key ? t(key) : message;
  };

  const formatChoice = (value: string) => t(`choice.${value}` as TranslationKey);

  return (
    <div className="booking-workspace">
      <nav aria-label={t("booking.progress")} className="booking-progress">
        <ol>
          {steps.map((label, index) => (
            <li aria-current={index === step ? "step" : undefined} key={label}>
              <button
                aria-label={t("booking.goTo", { step: t(label) })}
                disabled={index > step}
                onClick={() => index <= step && setStep(index)}
                type="button"
              >
                <span>{index < step ? <Check aria-hidden="true" size={15} /> : index + 1}</span>
                <small>{t(label)}</small>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <form className="booking-form" noValidate onSubmit={submit} ref={formRef}>
        <input {...register("idempotencyKey")} type="hidden" />
        <input name="locale" type="hidden" value={locale} />
        <div aria-hidden="true" className="honeypot">
          <label htmlFor="website">Website</label>
          <input {...register("website")} autoComplete="off" id="website" tabIndex={-1} />
        </div>

        <section className="booking-step" hidden={step !== 0}>
          <div className="step-heading"><span>{t("booking.stepCount", { step: 1 })}</span><h2>{t("booking.serviceTitle")}</h2><p>{t("booking.serviceCopy")}</p></div>
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
            <legend>{t("booking.optionalAddons")}</legend>
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
          <div className="step-heading"><span>{t("booking.stepCount", { step: 2 })}</span><h2>{t("booking.vehicleTitle")}</h2><p>{t("booking.vehicleCopy")}</p></div>
          <div className="form-grid two-columns">
            <Field label={t("booking.vehicleType")} error={errorFor("vehicleType")}>
              <select {...register("vehicleType")}><option value="small-car">{t("booking.smallCar")}</option><option value="medium-car">{t("booking.mediumCar")}</option><option value="large-car">{t("booking.largeCar")}</option><option value="van">{t("booking.van")}</option></select>
            </Field>
            <Field label={t("booking.condition")} error={errorFor("vehicleCondition")}>
              <select {...register("vehicleCondition")}><option value="LIGHT">{t("booking.lightDirt")}</option><option value="MODERATE">{t("booking.moderateDirt")}</option><option value="HEAVY">{t("booking.heavyDirt")}</option></select>
            </Field>
            <Field label={t("booking.make")} error={errorFor("vehicleMake")}><input {...register("vehicleMake")} autoComplete="off" placeholder={t("booking.makeExample")} /></Field>
            <Field label={t("booking.model")} error={errorFor("vehicleModel")}><input {...register("vehicleModel")} autoComplete="off" placeholder={t("booking.modelExample")} /></Field>
            <Field label={t("booking.colour")}><input {...register("vehicleColour")} autoComplete="off" /></Field>
            <Field label={t("booking.plate")}><input {...register("licencePlateOptional")} autoCapitalize="characters" autoComplete="off" /></Field>
          </div>
          <fieldset className="booking-fieldset"><legend>{t("booking.extraAttention")}</legend><div className="inline-checks">
            <CheckOption label={t("booking.petHair")} registration={register("hasPetHair")} />
            <CheckOption label={t("booking.seatStains")} registration={register("hasStains")} />
            <CheckOption label={t("booking.strongOdour")} registration={register("hasStrongOdour")} />
          </div></fieldset>
          <Field label={t("booking.conditionNotes")} hint={t("booking.noSensitive")}><textarea {...register("conditionNotes")} maxLength={600} rows={4} /></Field>
        </section>

        <section className="booking-step" hidden={step !== 2}>
          <div className="step-heading"><span>{t("booking.stepCount", { step: 3 })}</span><h2>{t("booking.locationTitle")}</h2><p>{t("booking.locationCopy")}</p></div>
          <div className="form-grid">
            <Field label={t("booking.street")} error={errorFor("addressLine")}><input {...register("addressLine")} autoComplete="street-address" /></Field>
            <div className="form-grid postcode-grid">
              <Field label={t("booking.postcode")} error={errorFor("postcode")}><input {...register("postcode")} autoComplete="postal-code" inputMode="numeric" maxLength={4} /></Field>
              <Field label={t("booking.city")} error={errorFor("city")}><input {...register("city")} autoComplete="address-level2" /></Field>
            </div>
            <Field label={t("booking.workWhere")} error={errorFor("serviceLocationType")}><select {...register("serviceLocationType")}><option value="HOME">{t("booking.home")}</option><option value="WORKPLACE">{t("booking.workplace")}</option><option value="OTHER">{t("booking.otherLocation")}</option></select></Field>
          </div>
          <div className="form-grid two-columns">
            <YesNo legend={t("booking.water")} name="accessToWater" onChange={(value) => setValue("accessToWater", value)} value={values.accessToWater} />
            <YesNo legend={t("booking.electricity")} name="accessToElectricity" onChange={(value) => setValue("accessToElectricity", value)} value={values.accessToElectricity} />
          </div>
        </section>

        <section className="booking-step" hidden={step !== 3}>
          <div className="step-heading"><span>{t("booking.stepCount", { step: 4 })}</span><h2>{t("booking.timingTitle")}</h2><p>{t("booking.timingCopy")}</p></div>
          {isLoadingSchedule ? <div className="slot-loading"><LoaderCircle aria-hidden="true" className="spin" size={19} />{t("booking.checking")}</div> : schedule.days.length ? <div className="slot-picker"><Field label={t("booking.availableDay")} error={errorFor("preferredDate")}><select {...register("preferredDate")}><option value="">{t("booking.chooseDay")}</option>{schedule.days.map((day) => <option key={day.date} value={day.date}>{day.label} · {day.openTime}-{day.closeTime}</option>)}</select></Field>{values.preferredDate ? <fieldset className="booking-fieldset"><legend>{t("booking.startTime")}</legend><p className="slot-duration"><Clock3 aria-hidden="true" size={16} />{t("booking.duration", { hours: Math.ceil(schedule.durationMinutes / 60 * 10) / 10 })}</p><div className="time-slot-grid">{schedule.days.find((day) => day.date === values.preferredDate)?.slots.map((time) => <label data-selected={values.appointmentTime === time} key={time}><input {...register("appointmentTime")} type="radio" value={time} /><Clock3 aria-hidden="true" size={15} />{time}</label>)}</div>{errorFor("appointmentTime") ? <p className="field-error">{errorFor("appointmentTime")}</p> : null}</fieldset> : null}</div> : <div className="no-slots"><CalendarDays aria-hidden="true" size={25} /><strong>{t("booking.noDates")}</strong><span>{t("booking.noDatesCopy")}</span></div>}
        </section>

        <section className="booking-step" hidden={step !== 4}>
          <div className="step-heading"><span>{t("booking.stepCount", { step: 5 })}</span><h2>{t("booking.contactTitle")}</h2><p>{t("booking.contactCopy")}</p></div>
          <div className="form-grid two-columns">
            <Field label={t("booking.name")} error={errorFor("customerName")}><input {...register("customerName")} autoComplete="name" /></Field>
            <Field label={t("booking.phone")} error={errorFor("phone")}><input {...register("phone")} autoComplete="tel" inputMode="tel" /></Field>
            <Field label={t("booking.email")} error={errorFor("email")}><input {...register("email")} autoComplete="email" inputMode="email" type="email" /></Field>
            <Field label={t("booking.preferredContact")} error={errorFor("preferredContactMethod")}><select {...register("preferredContactMethod")}><option value="WHATSAPP">WhatsApp</option><option value="PHONE">{t("contact.phone")}</option><option value="EMAIL">{t("contact.email")}</option></select></Field>
            <Field label={t("booking.payment")}><select {...register("paymentMethodPreference")}><option value="DISCUSS_LATER">{t("booking.discussLater")}</option><option value="CASH">{t("booking.cash")}</option><option value="CARD">{t("booking.card")}</option><option value="BANK_TRANSFER">{t("booking.bankTransfer")}</option></select></Field>
            <Field label={t("booking.source")}><input {...register("acquisitionSource")} placeholder={t("booking.sourceExample")} /></Field>
          </div>
          <div className="consent-list">
            <label className="consent-option"><input {...register("customerConsent")} type="checkbox" /><span>{t("booking.consent")} <a href="/privacy" target="_blank">{t("booking.privacyNotice")}</a>.</span></label>
            {errorFor("customerConsent") ? <p className="field-error">{errorFor("customerConsent")}</p> : null}
            <label className="consent-option"><input {...register("marketingConsent")} type="checkbox" /><span>{t("booking.marketing")}</span></label>
          </div>
        </section>

        <section className="booking-step" hidden={step !== 5}>
          <div className="step-heading"><span>{t("booking.stepCount", { step: 6 })}</span><h2>{t("booking.reviewTitle")}</h2><p>{t("booking.reviewCopy")}</p></div>
          <div className="review-list">
            <ReviewBlock title={t("booking.step.service")} onEdit={() => setStep(0)}><strong>{selectedService?.name ?? t("booking.notSelected")}</strong><span>{selectedAddOns.length ? selectedAddOns.map((item) => item.name).join(", ") : t("booking.noAddons")}</span><b>{estimate === null ? t("booking.afterInspection") : t("booking.estimatedFrom", { amount: estimate })}</b></ReviewBlock>
            <ReviewBlock title={t("booking.step.vehicle")} onEdit={() => setStep(1)}><strong>{values.vehicleMake} {values.vehicleModel}</strong><span>{formatChoice(values.vehicleType)} · {t("booking.dirt", { condition: formatChoice(values.vehicleCondition) })}</span></ReviewBlock>
            <ReviewBlock title={t("booking.step.location")} onEdit={() => setStep(2)}><strong>{values.addressLine}</strong><span>{values.postcode} {values.city} · {formatChoice(values.serviceLocationType)}</span></ReviewBlock>
            <ReviewBlock title={t("booking.appointment")} onEdit={() => setStep(3)}><strong>{values.preferredDate || t("booking.noDate")}</strong><span>{values.appointmentTime || t("booking.noTime")}</span></ReviewBlock>
            <ReviewBlock title={t("booking.step.contact")} onEdit={() => setStep(4)}><strong>{values.customerName}</strong><span>{values.email} · {values.phone}</span><span>{t("booking.replyBy", { method: formatChoice(values.preferredContactMethod) })}</span></ReviewBlock>
          </div>
          <div className="request-notice"><ShieldCheck aria-hidden="true" /><p><strong>{t("booking.slotHeld")}</strong><span>{t("booking.reviewNotice")}</span></p></div>
        </section>

        {actionState.status === "error" ? <div className="form-alert" role="alert"><strong>{t("booking.requestNotSent")}</strong><span>{actionState.message}</span></div> : null}

        <div className="booking-actions">
          {step > 0 ? <button className="button button-secondary" onClick={() => setStep((current) => current - 1)} type="button"><ArrowLeft aria-hidden="true" size={18} /> {t("booking.back")}</button> : <span />}
          {step < steps.length - 1 ? <button className="button button-primary" onClick={goNext} type="button">{t("booking.continue")} <ArrowRight aria-hidden="true" size={18} /></button> : <button className="button button-primary" disabled={isSubmitting || !values.idempotencyKey} type="submit">{isSubmitting ? <LoaderCircle aria-hidden="true" className="spin" size={18} /> : <Check aria-hidden="true" size={18} />} {isSubmitting ? t("booking.sending") : t("booking.send")}</button>}
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
  const t = useTranslations();
  return <fieldset className="yes-no"><legend>{legend}</legend><div><label data-selected={value}><input checked={value} name={name} onChange={() => onChange(true)} type="radio" value="true" />{t("booking.yes")}</label><label data-selected={!value}><input checked={!value} name={name} onChange={() => onChange(false)} type="radio" value="false" />{t("booking.no")}</label></div></fieldset>;
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  const t = useTranslations();
  return <article className="review-block"><div><h3>{title}</h3><button onClick={onEdit} type="button">{t("booking.edit")}</button></div>{children}</article>;
}
