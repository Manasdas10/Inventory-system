import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {

  try {

    // CLEAN EXPIRED RESERVATIONS
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/reservations/cleanup`,
      {
        method: "POST",
      }
    );

    const body =
      await request.json();

    // VALIDATION
    if (
      !body.productId ||
      !body.quantity
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Product ID and quantity are required",
        },
        {
          status: 400,
        }
      );
    }

    const reserveQuantity =
      Number(body.quantity);

    if (
      isNaN(reserveQuantity) ||
      reserveQuantity <= 0
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid reservation quantity",
        },
        {
          status: 400,
        }
      );
    }

    // FIND INVENTORY
    const inventory =
      await prisma.inventory.findFirst({

        where: {
          productId:
            body.productId,
        },

        include: {
          product: true,
          warehouse: true,
        },
      });

    // INVENTORY NOT FOUND
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

    // AVAILABLE STOCK
    const availableUnits =

      inventory.totalUnits -
      inventory.reservedUnits;

    // STOCK CHECK
    if (
      availableUnits <
      reserveQuantity
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Not enough stock available",
        },
        {
          status: 409,
        }
      );
    }

    // TRANSACTION
    const result =
      await prisma.$transaction(

        async (tx) => {

          // UPDATE RESERVED STOCK
          const updatedInventory =

            await tx.inventory.update({

              where: {
                id: inventory.id,
              },

              data: {

                reservedUnits: {

                  increment:
                    reserveQuantity,
                },
              },
            });

          // CREATE RESERVATION
          const reservation =

            await tx.reservation.create({

              data: {

                quantity:
                  reserveQuantity,

                productId:
                  body.productId,

                warehouseId:
                  inventory.warehouseId,

                expiresAt:
                  new Date(
                    Date.now() +
                    10 *
                    60 *
                    1000
                  ),

                status:
                  "PENDING",
              },
            });

          return {

            updatedInventory,

            reservation,
          };
        }
      );

    return NextResponse.json(

      {
        success: true,

        message:
          "Product reserved successfully",

        reservation:
          result.reservation,

        availableUnits:

          result.updatedInventory
            .totalUnits -

          result.updatedInventory
            .reservedUnits,
      },

      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(
      "RESERVATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to reserve product",
      },
      {
        status: 500,
      }
    );
  }
}