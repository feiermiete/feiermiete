import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  { name: "Zelte & Pavillons", slug: "zelte-pavillons" },
  { name: "Tische & Sitzmöbel", slug: "tische-sitzmoebel" },
  { name: "Buffet & Warmhalten", slug: "buffet-warmhalten" },
  { name: "Geschirr & Besteck", slug: "geschirr-besteck" },
  { name: "Getränke-Equipment", slug: "getraenke-equipment" }
];

const products = [
  {
    name: "Pavillon 6x3 m",
    slug: "pavillon-6x3",
    description: "Stabiler Pavillon für Gartenfeiern, Firmenfeiern und Outdoor-Events.",
    priceCents: 7900,
    depositCents: 10000,
    categorySlug: "zelte-pavillons"
  },
  {
    name: "Stehtisch",
    slug: "stehtisch",
    description: "Klassischer Stehtisch für Empfänge, Buffets und Firmenveranstaltungen.",
    priceCents: 1200,
    depositCents: 3000,
    categorySlug: "tische-sitzmoebel"
  },
  {
    name: "Bierzeltgarnitur",
    slug: "bierzeltgarnitur",
    description: "Biertisch mit zwei Bänken, ideal für Geburtstage, Sommerfeste und Gartenfeiern.",
    priceCents: 1800,
    depositCents: 5000,
    categorySlug: "tische-sitzmoebel"
  },
  {
    name: "Chafing Dish",
    slug: "chafing-dish",
    description: "Warmhaltebehälter für Buffets, Catering und warme Speisen.",
    priceCents: 1500,
    depositCents: 4000,
    categorySlug: "buffet-warmhalten"
  },
  {
    name: "Getränkespender",
    slug: "getraenkespender",
    description: "Getränkespender für Wasser, Limonade, Eistee oder Infused Water.",
    priceCents: 1000,
    depositCents: 2500,
    categorySlug: "getraenke-equipment"
  },
  {
    name: "Glühweinbehälter",
    slug: "gluehweinbehaelter",
    description: "Elektrischer Behälter für Glühwein, Tee oder heiße Getränke.",
    priceCents: 1800,
    depositCents: 5000,
    categorySlug: "getraenke-equipment"
  },
  {
    name: "Geschirr & Besteck Set",
    slug: "geschirr-besteck-set",
    description: "Teller, Besteck und Serviermaterial für Events und Buffets.",
    priceCents: 250,
    depositCents: 1000,
    categorySlug: "geschirr-besteck"
  },
  {
    name: "Buffet-Tisch",
    slug: "buffet-tisch",
    description: "Tisch für Buffetaufbau, Cateringstationen und Getränkeausgabe.",
    priceCents: 1500,
    depositCents: 4000,
    categorySlug: "tische-sitzmoebel"
  }
];

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category
    });
  }

  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug }
    });

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        priceCents: product.priceCents,
        depositCents: product.depositCents,
        categoryId: category?.id,
        isActive: true
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        priceCents: product.priceCents,
        depositCents: product.depositCents,
        categoryId: category?.id,
        isActive: true
      }
    });
  }

  console.log("Feiermiete Produkte wurden erstellt.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
