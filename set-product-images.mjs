import { prisma } from "./lib/prisma.js";

await prisma.product.updateMany({
  where: { name: { contains: "Buffet" } },
  data: { imageUrl: "/public/images/buffet-table.jpg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Geschirr" } },
  data: { imageUrl: "/public/images/cutlery-set.jpg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Besteck" } },
  data: { imageUrl: "/public/images/cutlery-set.jpg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Glühwein" } },
  data: { imageUrl: "/public/images/hot-drink-dispenser.jpg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Getränkespender" } },
  data: { imageUrl: "/public/images/drinks-dispenser.jpg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Chafing" } },
  data: { imageUrl: "/public/images/buffet-table.jpg" }
});

await prisma.product.updateMany({
  where: { name: { contains: "Stehtisch" } },
  data: { imageUrl: "/public/images/equipment-photo.jpg" }
});

await prisma.$disconnect();

console.log("Produktbilder wurden erfolgreich gesetzt.");
