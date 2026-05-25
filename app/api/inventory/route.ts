import { prisma } from "../../../lib/prisma";

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";


// GET INVENTORY
export async function GET() {

  try {

    const inventory =
      await prisma.inventory.findMany({

        include: {
          product: true,
          warehouse: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const formatted =
      inventory.map((item) => ({

        ...item,

        availableUnits:
          item.totalUnits -
          item.reservedUnits,
      }));

    return NextResponse.json({
      success: true,
      inventory: formatted,
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



// CREATE INVENTORY
export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    // CHECK WAREHOUSE
    if (!body.warehouseId) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Warehouse required",
        },
        {
          status: 400,
        }
      );
    }

    // CREATE PRODUCT
    const product =
      await prisma.product.create({

        data: {

          name: body.name,

          category:
            body.category,

          price:
            Number(body.price),
        },
      });

    // CREATE INVENTORY
    const inventory =
      await prisma.inventory.create({

        data: {

          totalUnits:
            Number(body.quantity),

          reservedUnits: 0,

          warehouseId:
            body.warehouseId,

          productId:
            product.id,
        },

        include: {
          product: true,
          warehouse: true,
        },
      });

    return NextResponse.json({

      success: true,

      inventory: {

        ...inventory,

        availableUnits:
          inventory.totalUnits,
      },
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