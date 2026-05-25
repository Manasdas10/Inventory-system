import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  //////////////////////////////////////////////////////
  // CLEAR OLD DATA
  //////////////////////////////////////////////////////

  await prisma.reservation.deleteMany();

  await prisma.inventory.deleteMany();

  await prisma.product.deleteMany();

  await prisma.warehouse.deleteMany();

  //////////////////////////////////////////////////////
  // WAREHOUSES
  //////////////////////////////////////////////////////

  const bhopalWarehouse =
    await prisma.warehouse.create({

      data: {

        name:
          "Main Warehouse",

        location:
          "Bhopal",
      },
    });

  const delhiWarehouse =
    await prisma.warehouse.create({

      data: {

        name:
          "Delhi Warehouse",

        location:
          "Delhi",
      },
    });

  const puneWarehouse =
    await prisma.warehouse.create({

      data: {

        name:
          "Sub Warehouse",

        location:
          "Pune",
      },
    });

  //////////////////////////////////////////////////////
  // PRODUCTS
  //////////////////////////////////////////////////////

  const hivProduct =
    await prisma.product.create({

      data: {

        name:
          "HIV Medicine",

        price: 2500,
      },
    });

  const covidProduct =
    await prisma.product.create({

      data: {

        name:
          "Covid Vaccine",

        price: 1800,
      },
    });

  const fluProduct =
    await prisma.product.create({

      data: {

        name:
          "Flu Vaccine",

        price: 1200,
      },
    });

  //////////////////////////////////////////////////////
  // INVENTORY
  //////////////////////////////////////////////////////

  await prisma.inventory.create({

    data: {

      productId:
        hivProduct.id,

      warehouseId:
        bhopalWarehouse.id,

      totalUnits: 100,

      reservedUnits: 0,
    },
  });

  await prisma.inventory.create({

    data: {

      productId:
        covidProduct.id,

      warehouseId:
        delhiWarehouse.id,

      totalUnits: 80,

      reservedUnits: 0,
    },
  });

  await prisma.inventory.create({

    data: {

      productId:
        fluProduct.id,

      warehouseId:
        puneWarehouse.id,

      totalUnits: 75,

      reservedUnits: 0,
    },
  });

  console.log(
    "Seed completed successfully"
  );
}

main()

  .catch((e) => {

    console.error(e);

    process.exit(1);
  })

  .finally(async () => {

    await prisma.$disconnect();
  });