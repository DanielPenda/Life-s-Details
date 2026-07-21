export const services = [
  {
    name: "Refresh",
    slug: "refresh",
    description: "A practical reset for a regularly maintained vehicle.",
    bestFor: "Routine cleaning and maintenance",
    duration: "About 1.5-2 hours",
    priceLabel: "From \u20AC49",
    inclusions: [
      "Exterior hand wash",
      "Wheels and tyres cleaned",
      "Interior vacuum and wipe-down",
      "Interior and exterior glass",
    ],
  },
  {
    name: "Deep Clean",
    slug: "deep-clean",
    description: "More focused care for a vehicle that needs extra attention.",
    bestFor: "Built-up dirt, marks and a fuller reset",
    duration: "About 3-4 hours",
    priceLabel: "From \u20AC99",
    inclusions: [
      "Everything in Refresh",
      "Detailed interior vacuum",
      "Mats, dashboard and trim cleaned",
      "Targeted spot-stain treatment",
    ],
  },
  {
    name: "Full Detail",
    slug: "full-detail",
    description: "The most complete inside-and-out treatment in the range.",
    bestFor: "A full transformation or sale preparation",
    duration: "About 5-7 hours",
    priceLabel: "Request estimate",
    inclusions: [
      "Everything in Deep Clean",
      "Exterior decontamination",
      "Protective exterior finish",
      "Deeper interior attention and final inspection",
    ],
  },
] as const;
