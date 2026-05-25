import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

//////////////////////////////////////////////////////
// CREATE RESERVATION
//////////////////////////////////////////////////////

export async function POST(
  request: Request
) {

  try {

    //////////////////////////////////////////////////////
    // RAW BODY
    //////////////////////////////////////////////////////

    const rawBody =
      await request.text();

    console.log(
      "RAW BODY:",
      rawBody
    );

    //////////////////////////////////////////////////////
    // PARSE BODY
    //////////////////////////////////////////////////////

    const body =
      JSON.parse(rawBody);

    console.log(
      "PARSED BODY:",
      body
    );

    //////////////////////////////////////////////////////
    // EXTRACT DATA
    //////////////////////////////////////////////////////

    const productId =
      String(
        body.productId || ""
      );

    const warehouseId =
      String(
        body.warehouseId || ""
      );

    const quantity =
      Number(
        body.quantity || 0
      );

    console.log({

      productId,

      warehouseId,

      quantity,
    });

    //////////////////////////////////////////////////////
    // VALIDATION
    //////////////////////////////////////////////////////

    if (!productId) {

      return NextResponse.json(

        {
          success: false,

          message:
            "Missing productId",
        },

        {
          status: 400,
        }
      );
    }

    if (!warehouseId) {

      return NextResponse.json(

        {
          success: false,

          message:
            "Missing warehouseId",
        },

        {
          status: 400,
        }
      );
    }

    if (
      quantity <= 0
    ) {

      return NextResponse.json(

        {
          success: false,

          message:
            "Invalid quantity",
        },

        {
          status: 400,
        }
      );
    }

    //////////////////////////////////////////////////////
    // FIND INVENTORY
    //////////////////////////////////////////////////////

    const inventory =
      await prisma.inventory.findFirst({

        where: {

          productId,

          warehouseId,
        },
      });

    console.log(
      "FOUND INVENTORY:",
      inventory
    );

    //////////////////////////////////////////////////////
    // INVENTORY NOT FOUND
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
    // AVAILABLE STOCK
    //////////////////////////////////////////////////////

    const availableUnits =

      inventory.totalUnits -

      inventory.reservedUnits;

    //////////////////////////////////////////////////////
    // OUT OF STOCK
    //////////////////////////////////////////////////////

    if (
      availableUnits <
      quantity
    ) {

      return NextResponse.json(

        {
          success: false,

          message:
            "Not enough stock",
        },

        {
          status: 409,
        }
      );
    }

    //////////////////////////////////////////////////////
    // TRANSACTION
    //////////////////////////////////////////////////////

    const reservation =
      await prisma.$transaction(

        async (tx) => {

          ////////////////////////////////////////////////////
          // UPDATE INVENTORY
          ////////////////////////////////////////////////////

          await tx.inventory.update({

            where: {
              id:
                inventory.id,
            },

            data: {

              reservedUnits: {

                increment:
                  quantity,
              },
            },
          });

          ////////////////////////////////////////////////////
          // CREATE RESERVATION
          ////////////////////////////////////////////////////

          return await tx.reservation.create({

            data: {

              productId,

              warehouseId,

              quantity,

              status:
                "PENDING",

              expiresAt:
                new Date(

                  Date.now() +

                  15 *
                  60 *
                  1000
                ),
            },
          });
        },

        {
          isolationLevel:
            "Serializable",
        }
      );

    //////////////////////////////////////////////////////
    // SUCCESS
    //////////////////////////////////////////////////////

    return NextResponse.json({

      success: true,

      reservation: {

        ...reservation,

        availableStockLeft:

          availableUnits - quantity,
      },
    });

  } catch (error) {

    console.log(
      "RESERVATION ERROR:",
      error
    );

    return NextResponse.json(

      {
        success: false,

        message:
          "Internal server error",
      },

      {
        status: 500,
      }
    );
  }
}