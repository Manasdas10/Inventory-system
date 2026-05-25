import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST() {

  try {

    //////////////////////////////////////////////////////
    // FIND EXPIRED RESERVATIONS
    //////////////////////////////////////////////////////

    const expiredReservations =

      await prisma.reservation.findMany({

        where: {

          status: "PENDING",

          expiresAt: {

            lt: new Date(),
          },
        },
      });

    //////////////////////////////////////////////////////
    // RELEASE EACH
    //////////////////////////////////////////////////////

    for (
      const reservation
      of expiredReservations
    ) {

      ////////////////////////////////////////////////////
      // RESTORE INVENTORY
      ////////////////////////////////////////////////////

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

      ////////////////////////////////////////////////////
      // UPDATE STATUS
      ////////////////////////////////////////////////////

      await prisma.reservation.update({

        where: {
          id:
            reservation.id,
        },

        data: {

          status:
            "EXPIRED",
        },
      });
    }

    //////////////////////////////////////////////////////
    // SUCCESS
    //////////////////////////////////////////////////////

    return NextResponse.json({

      success: true,

      cleaned:
        expiredReservations.length,
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