import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

//////////////////////////////////////////////////////
// GET PRODUCTS
//////////////////////////////////////////////////////

export async function GET() {

  try {

    const inventory =
      await prisma.inventory.findMany({

        include: {

          product: true,

          warehouse: true,
        },
      });

    const formatted =
      inventory.map((item) => ({

        productId:
          item.product.id,

        productName:
          item.product.name,

        warehouseId:
          item.warehouse.id,

        warehouseName:
          item.warehouse.name,

        warehouseLocation:
          item.warehouse.location,

        totalUnits:
          item.totalUnits,

        reservedUnits:
          item.reservedUnits,

        availableUnits:

          item.totalUnits -

          item.reservedUnits,
      }));

    return NextResponse.json({

      success: true,

      products: formatted,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(

      {
        success: false,
      },

      {
        status: 500,
      }
    );
  }
}