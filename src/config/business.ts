export const businessInfo = {
  name: "Life's Details",
  email: "info.lifesdetails@gmail.com",
  phone: {
    display: "+32 491 64 57 00",
    e164: "+32491645700",
  },
  whatsapp: {
    display: "+32 491 64 57 00",
    number: "32491645700",
    defaultMessage:
      "Hello Life's Details, I would like information about a car-detailing service.",
  },
  serviceArea: {
    city: "Aalter",
    postcode: "9880",
    country: "Belgium",
  },
} as const;

export const contactLinks = {
  phone: `tel:${businessInfo.phone.e164}`,
  email: `mailto:${businessInfo.email}`,
  whatsapp: `https://wa.me/${businessInfo.whatsapp.number}?text=${encodeURIComponent(
    businessInfo.whatsapp.defaultMessage,
  )}`,
} as const;
