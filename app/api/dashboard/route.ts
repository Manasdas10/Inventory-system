import { prisma } from "../../../lib/prisma";

import { NextResponse } from "next/server";

export async function GET() {

  try {

    const inventory =
      await prisma.inventory.findMany();

    const totalProducts =
      inventory.length;

    const totalStock =
      inventory.reduce(
        (acc, item) =>
          acc + item.totalUnits,
        0
      );

    const reservedStock =
      inventory.reduce(
        (acc, item) =>
          acc + item.reservedUnits,
        0
      );

    const lowStock =
      inventory.filter(
        (item) =>
          item.totalUnits -
            item.reservedUnits <
          5
      ).length;

    return NextResponse.json({

      success: true,

      stats: {

        totalProducts,

        totalStock,

        reservedStock,

        lowStock,
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