import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How Life's Details uses information submitted with booking requests.",
};

export default function PrivacyPage() {
  return (
    <section className="section">
      <div className="container narrow legal-copy">
        <p className="eyebrow">Privacy notice</p>
        <h1>How we use your booking information</h1>
        <p>
          Life&apos;s Details uses the contact, vehicle, location and scheduling details you submit to review your request, provide an estimate, arrange the service and keep appropriate business records.
        </p>
        <h2>Information we collect</h2>
        <p>
          A booking request may include your name, phone number, email address, service address, vehicle details, requested service, preferred dates and notes you choose to provide. Please do not include sensitive personal information in free-text notes.
        </p>
        <h2>Why we use it</h2>
        <p>
          Operational booking information is used because it is necessary to respond to your request and prepare a possible service agreement. Optional marketing messages are only sent when you select the separate marketing checkbox, and you can withdraw that choice at any time.
        </p>
        <h2>Storage and retention</h2>
        <p>
          Booking data is stored with contracted service providers in controlled systems. Unsuccessful enquiries are intended to be deleted or anonymised after 24 months unless a longer period is required for a dispute or legal obligation. Completed-job and payment records may need to be retained longer for accounting obligations.
        </p>
        <h2>Your choices</h2>
        <p>
          You may ask to access, correct or delete eligible personal information, or object to optional marketing, by emailing <a href="mailto:info.lifesdetails@gmail.com">info.lifesdetails@gmail.com</a>. Some records may need to be retained where the law requires it.
        </p>
        <p>
          This practical notice requires professional legal review before launch and may be updated when service providers or business processes change.
        </p>
      </div>
    </section>
  );
}
