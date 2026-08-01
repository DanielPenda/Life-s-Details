import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
  { name: "Refresh", slug: "refresh", shortDescription: "A practical reset for a regularly maintained vehicle.", fullDescription: "Routine interior and exterior maintenance.", basePrice: 49, pricingType: "FROM", estimatedDurationMinutes: 120, displayOrder: 1 },
  { name: "Deep Clean", slug: "deep-clean", shortDescription: "More focused care for a vehicle that needs extra attention.", fullDescription: "A deeper interior and exterior clean for built-up dirt and marks.", basePrice: 99, pricingType: "FROM", estimatedDurationMinutes: 240, displayOrder: 2 },
  { name: "Full Detail", slug: "full-detail", shortDescription: "The most complete inside-and-out treatment in the range.", fullDescription: "A complete transformation with final pricing after inspection.", basePrice: null, pricingType: "INSPECTION", estimatedDurationMinutes: 420, displayOrder: 3 },
];

const addOns = [
  { name: "Pet hair treatment", slug: "pet-hair", description: "Extra time for embedded pet hair.", price: 25, estimatedDurationMinutes: 45 },
  { name: "Seat stain treatment", slug: "seat-stains", description: "Targeted treatment for visible seat stains.", price: 20, estimatedDurationMinutes: 30 },
  { name: "Odour treatment", slug: "odour-treatment", description: "Focused treatment for persistent interior odours.", price: 25, estimatedDurationMinutes: 30 },
];

for (const service of services) {
  await prisma.service.upsert({ where: { slug: service.slug }, update: service, create: service });
}

for (const addOn of addOns) {
  await prisma.addOn.upsert({ where: { slug: addOn.slug }, update: addOn, create: addOn });
}

await prisma.$disconnect();
