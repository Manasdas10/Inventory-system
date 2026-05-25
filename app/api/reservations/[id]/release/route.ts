import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(
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
    // FIND
    //////////////////////////////////////////////////////

    const reservation =

      await prisma.reservation.findUnique({

        where: { id },
      });

    //////////////////////////////////////////////////////
    // NOT FOUND
    //////////////////////////////////////////////////////

    if (!reservation) {

      return NextResponse.json(

        {
          success: false,
          message:
            "Reservation not found",
        },

        {
          status: 404,
        }
      );
    }

    //////////////////////////////////////////////////////
    // ALREADY CLOSED
    //////////////////////////////////////////////////////

    if (
      reservation.status !==
      "PENDING"
    ) {

      return NextResponse.json(

        {
          success: false,
          message:
            "Reservation already closed",
        },

        {
          status: 400,
        }
      );
    }

    //////////////////////////////////////////////////////
    // RESTORE STOCK
    //////////////////////////////////////////////////////

    await prisma.inventory.updateMany({

      where: {

        productId:
          reservation.productId,

        warehouseId:
          reservation.warehouseId,
      },

      data: {

        reservedUnits: {

          decrement:
            reservation.quantity,
        },
      },
    });

    //////////////////////////////////////////////////////
    // UPDATE STATUS
    //////////////////////////////////////////////////////

    await prisma.reservation.update({

      where: { id },

      data: {

        status:
          "CANCELLED",
      },
    });

    //////////////////////////////////////////////////////
    // SUCCESS
    //////////////////////////////////////////////////////

    return NextResponse.json({

      success: true,
    });

  } catch (error) {

    console.log(
      "RELEASE ERROR:",
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