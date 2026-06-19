const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const updates = [
    { contains: "Buffet-Tisch", imageUrl: "/public/images/buffet-table.jpg" },
    { contains: "Geschirr", imageUrl: "/public/images/cutlery-set.jpg" },
    { contains: "Besteck", imageUrl: "/public/images/cutlery-set.jpg" },
    { contains: "Glühwein", imageUrl: "/public/images/hot-drink-dispenser.jpg" },
    { contains: "Getränkespender", imageUrl: "/public/images/drinks-dispenser.jpg" },
    { contains: "Chafing", imageUrl: "/public/images/chafing-dish.jpg" },
    { contains: "Bierzelt", imageUrl: "/public/images/bierzeltgarnitur.jpg" },
    { contains: "Stehtisch", imageUrl: "/public/images/stehtisch.jpg" },
    { contains: "Pavillon", imageUrl: "/public/images/pavillon-6x3.jpg" }
  ];

  for (const item of updates) {
    const result = await prisma.product.updateMany({
      where: {
        name: {
          contains: item.contains
        }
      },
      data: {
        imageUrl: item.imageUrl
      }
    });

    console.log(item.contains, "=>", item.imageUrl, "| geändert:", result.count);
  }
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
