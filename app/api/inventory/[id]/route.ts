import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

//////////////////////////////////////////////////////
// UPDATE INVENTORY
//////////////////////////////////////////////////////

export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;

    const body =
      await request.json();

    //////////////////////////////////////////////////////
    // FIND INVENTORY
    //////////////////////////////////////////////////////

    const inventory =
      await prisma.inventory.findUnique({

        where: {
          id,
        },

        include: {
          product: true,
        },
      });

    //////////////////////////////////////////////////////
    // NOT FOUND
    //////////////////////////////////////////////////////

    if (!inventory) {

      return NextResponse.json(

        {
          success: false,
          message:
            "Inventory not found",
        },

        {
          status: 404,
        }
      );
    }

    //////////////////////////////////////////////////////
    // UPDATE PRODUCT
    //////////////////////////////////////////////////////

    await prisma.product.update({

      where: {
        id:
          inventory.productId,
      },

      data: {

        name:
          body.name,

        
        price:
          Number(body.price),
      },
    });

    //////////////////////////////////////////////////////
    // UPDATE INVENTORY
    //////////////////////////////////////////////////////

    const updatedInventory =
      await prisma.inventory.update({

        where: {
          id,
        },

        data: {

          totalUnits:
            Number(body.quantity),

          warehouseId:
            body.warehouseId,
        },

        include: {

          product: true,

          warehouse: true,
        },
      });

    return NextResponse.json({

      success: true,

      inventory: {

        ...updatedInventory,

        availableUnits:

          updatedInventory.totalUnits -

          updatedInventory.reservedUnits,
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

//////////////////////////////////////////////////////
// DELETE INVENTORY
//////////////////////////////////////////////////////

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;

    //////////////////////////////////////////////////////
    // FIND INVENTORY
    //////////////////////////////////////////////////////

    const inventory =
      await prisma.inventory.findUnique({

        where: {
          id,
        },
      });

    if (!inventory) {

      return NextResponse.json(

        {
          success: false,
          message:
            "Inventory not found",
        },

        {
          status: 404,
        }
      );
    }

    //////////////////////////////////////////////////////
    // DELETE INVENTORY
    //////////////////////////////////////////////////////

    await prisma.inventory.delete({

      where: {
        id,
      },
    });

    //////////////////////////////////////////////////////
    // DELETE PRODUCT
    //////////////////////////////////////////////////////

    await prisma.product.delete({

      where: {
        id:
          inventory.productId,
      },
    });

    return NextResponse.json({

      success: true,
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