import fs from "fs";
import { prisma } from "./lib/prisma.js";

function pick(...webPaths) {
  for (const webPath of webPaths) {
    const localPath = "." + webPath;
    if (fs.existsSync(localPath)) return webPath;
  }
  return webPaths[webPaths.length - 1];
}

async function setImage(nameContains, imageUrl) {
  await prisma.product.updateMany({
    where: { name: { contains: nameContains } },
    data: { imageUrl }
  });
  console.log("gesetzt:", nameContains, "->", imageUrl);
}

async function main() {
  // schon ok / zur Sicherheit sauber setzen
  await setImage("Buffet", pick(
    "/public/images/buffet-table.jpg",
    "/public/images/catering-photo.jpg"
  ));

  await setImage("Geschirr", pick(
    "/public/images/cutlery-set.jpg",
    "/public/images/elegantes_gedeckter_hochzeitstisch.png",
    "/public/images/hero-event.jpg"
  ));

  await setImage("Besteck", pick(
    "/public/images/cutlery-set.jpg",
    "/public/images/elegantes_gedeckter_hochzeitstisch.png",
    "/public/images/hero-event.jpg"
  ));

  // doppelte Getränke-Bilder trennen
  await setImage("Glühwein", pick(
    "/public/images/hot-drink-dispenser.jpg",
    "/public/images/drinks-dispenser.jpg"
  ));

  await setImage("Getränkespender", pick(
    "/public/images/drinks-dispenser.jpg",
    "/public/images/erfrischende_getränkeausgabe_im_sonnenlicht.png",
    "/public/images/service-photo.jpg"
  ));

  // Buffet/Chafing
  await setImage("Chafing", pick(
    "/public/images/catering-photo.jpg",
    "/public/images/elegantes_buffetscene_mit_blumenarrangement.png",
    "/public/images/elegantes_buffet_in_festlicher_atmosphäre.png",
    "/public/images/buffet-table.jpg"
  ));

  // die 3 gleichen Zelt-/Outdoor-Bilder trennen
  await setImage("Bierzelt", pick(
    "/public/images/elegante_gartenparty_unter_zelt.png",
    "/public/images/event_setup_in_a_sunlit_garden.png",
    "/public/images/equipment-photo.jpg"
  ));

  await setImage("Stehtisch", pick(
    "/public/images/event_setup_in_a_sunlit_garden.png",
    "/public/images/elegante_hochzeitsdeko_im_zelt.png",
    "/public/images/equipment-photo.jpg"
  ));

  await setImage("Pavillon", pick(
    "/public/images/elegante_hochzeitsdeko_im_zelt.png",
    "/public/images/elegante_gartenparty_unter_zelt.png",
    "/public/images/equipment-photo.jpg"
  ));

  await prisma.$disconnect();
  console.log("Fertig: doppelte Produktbilder wurden ersetzt.");
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
