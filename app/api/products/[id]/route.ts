export const dynamic = "force-dynamic";

import { prisma } from "../../../../lib/prisma";

import { NextResponse } from "next/server";

// DELETE PRODUCT
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {

  try {

    await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}

// UPDATE PRODUCT
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {

  try {

    const body = await request.json();

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: params.id,
        },

        data: {
          name: body.name,

          quantity: Number(
            body.quantity
          ),

          price: Number(
            body.price
          ),

          category:
            body.category,
        },
      });

    return NextResponse.json({
      success: true,
      updatedProduct,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Update failed",
      },
      {
        status: 500,
      }
    );
  }
}