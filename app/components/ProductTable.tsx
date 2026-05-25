"use client";

import {
  Pencil,
  Trash2,
  ShieldPlus,
  AlertTriangle,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category?: string;
};

export default function ProductTable({
  products,
  onEdit,
  onDelete,
  onReserve,
}: any) {
  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b border-slate-200">

            <th className="text-left p-4">
              Product
            </th>

            <th className="text-left p-4">
              Category
            </th>

            <th className="text-left p-4">
              Quantity
            </th>

            <th className="text-left p-4">
              Price
            </th>

            <th className="text-left p-4">
              Status
            </th>

            <th className="text-left p-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {products.map(
            (product: Product) => (

              <tr
                key={product.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >

                <td className="p-4 font-medium">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.category ||
                    "GENERAL"}
                </td>

                <td className="p-4">
                  {product.quantity}
                </td>

                <td className="p-4">
                  ₹{product.price}
                </td>

                <td className="p-4">

                  {product.quantity < 5 ? (

                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm flex items-center gap-2 w-fit">

                      <AlertTriangle size={14} />

                      Low Stock

                    </span>

                  ) : (

                    <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm">
                      In Stock
                    </span>

                  )}

                </td>

                <td className="p-4">

                  <div className="flex gap-3">

                    <button
                      onClick={() =>
                        onEdit(product)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all"
                    >

                      <Pencil size={18} />

                    </button>

                    <button
                      onClick={() =>
                        onDelete(
                          product.id
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-all"
                    >

                      <Trash2 size={18} />

                    </button>

                    <button
                      onClick={() =>
                        onReserve(
                          product.id
                        )
                      }
                      className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl transition-all"
                    >

                      <ShieldPlus size={18} />

                    </button>

                  </div>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  );
}