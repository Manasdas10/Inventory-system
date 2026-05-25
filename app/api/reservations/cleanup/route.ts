import { prisma } from "../../../../lib/prisma";

import { NextResponse } from "next/server";

export async function POST() {

  try {

    // FIND EXPIRED RESERVATIONS
    const expiredReservations =

      await prisma.reservation.findMany({

        where: {

          expiresAt: {
            lte: new Date(),
          },

          status: "PENDING",
        },
      });

    // RELEASE STOCK
    for (const reservation of expiredReservations) {

      // RESTORE INVENTORY
      const inventory =
        await prisma.inventory.findFirst({

          where: {
            productId:
              reservation.productId,
          },
        });

      if (inventory) {

        await prisma.inventory.update({

          where: {
            id: inventory.id,
          },

          data: {

            reservedUnits: {

              decrement:
                reservation.quantity,
            },
          },
        });
      }

      // MARK EXPIRED
      await prisma.reservation.update({

        where: {
          id: reservation.id,
        },

        data: {
          status: "EXPIRED",
        },
      });
    }

    return NextResponse.json({

      success: true,

      expired:
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