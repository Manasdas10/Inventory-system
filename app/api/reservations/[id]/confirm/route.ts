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
    // FIND RESERVATION
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
    // EXPIRED
    //////////////////////////////////////////////////////

    if (

      reservation.status !==
      "PENDING"

    ) {

      return NextResponse.json(

        {
          success: false,
          message:
            "Reservation expired",
        },

        {
          status: 410,
        }
      );
    }

    //////////////////////////////////////////////////////
    // UPDATE
    //////////////////////////////////////////////////////

    const updated =

      await prisma.reservation.update({

        where: { id },

        data: {

          status:
            "CONFIRMED",
        },
      });

    //////////////////////////////////////////////////////
    // SUCCESS
    //////////////////////////////////////////////////////

    return NextResponse.json({

      success: true,

      reservation:
        updated,
    });

  } catch (error) {

    console.log(
      "CONFIRM ERROR:",
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