import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    let warehouses =
      await prisma.warehouse.findMany();

    //////////////////////////////////////////////////////
    // AUTO CREATE DEFAULT WAREHOUSE
    //////////////////////////////////////////////////////

    if (warehouses.length === 0) {

      const warehouse =
        await prisma.warehouse.create({

          data: {
            name: "Main Warehouse",
            location: "Bhopal",
          },
        });

      warehouses = [warehouse];
    }

    return NextResponse.json({
      success: true,
      warehouses,
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