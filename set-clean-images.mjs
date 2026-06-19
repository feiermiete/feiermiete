import { prisma } from "./lib/prisma.js";

await prisma.product.updateMany({
  where: { name: { contains: "Buffet" } },
  data: { imageUrl: "/public/images/buffet-clean.svg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Geschirr" } },
  data: { imageUrl: "/public/images/tableware-clean.svg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Besteck" } },
  data: { imageUrl: "/public/images/tableware-clean.svg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Glühwein" } },
  data: { imageUrl: "/public/images/drinks-clean.svg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Getränkespender" } },
  data: { imageUrl: "/public/images/drinks-clean.svg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Chafing" } },
  data: { imageUrl: "/public/images/buffet-clean.svg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Stehtisch" } },
  data: { imageUrl: "/public/images/equipment-clean.svg" }
});

await prisma.$disconnect();

console.log("Saubere Bilder gesetzt.");
