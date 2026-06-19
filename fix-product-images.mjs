import { prisma } from "./lib/prisma.js";

async function setImage(nameContains, imageUrl) {
  const result = await prisma.product.updateMany({
    where: { name: { contains: nameContains } },
    data: { imageUrl }
  });

  console.log(nameContains, "=>", imageUrl, "| geändert:", result.count);
}

await setImage("Buffet-Tisch", "/public/images/buffet-table.jpg");
await setImage("Geschirr", "/public/images/cutlery-set.jpg");
await setImage("Besteck", "/public/images/cutlery-set.jpg");
await setImage("Glühwein", "/public/images/hot-drink-dispenser.jpg");
await setImage("Getränkespender", "/public/images/drinks-dispenser.jpg");
await setImage("Chafing", "/public/images/catering-photo.jpg");
await setImage("Bierzelt", "/public/images/hero-event.jpg");
await setImage("Stehtisch", "/public/images/service-photo.jpg");
await setImage("Pavillon", "/public/images/equipment-photo.jpg");

await prisma.$disconnect();

console.log("Produktbilder wurden neu zugeordnet.");
