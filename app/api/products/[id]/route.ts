// updated
export const dynamic =
  "force-dynamic";

import { prisma }
from "../../../../lib/prisma";

import {
  NextResponse
}
from "next/server";

//////////////////////////////////////////////////////
// DELETE PRODUCT
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

    await prisma.product.delete({

      where: {
        id,
      },
    });

    return NextResponse.json({

      success: true,

      message:
        "Deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(

      {
        success: false,

        message:
          "Delete failed",
      },

      {
        status: 500,
      }
    );
  }
}

//////////////////////////////////////////////////////
// UPDATE PRODUCT
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

    const updatedProduct =

      await prisma.product.update({

        where: {
          id,
        },

        data: {

          name:
            body.name,

          

          price:
            Number(
              body.price
            ),

         
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

        message:
          "Update failed",
      },

      {
        status: 500,
      }
    );
  }
}