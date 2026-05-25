"use client";

import { Clock3 } from "lucide-react";

export default function ReservationTable({
  reservations,
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
              Status
            </th>

            <th className="text-left p-4">
              Expires
            </th>

          </tr>

        </thead>

        <tbody>

          {reservations.map(
            (reservation: any) => (

              <tr
                key={reservation.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >

                <td className="p-4 font-medium">
                  {
                    reservation.product
                      ?.name
                  }
                </td>

                <td className="p-4">
                  {
                    reservation.product
                      ?.category
                  }
                </td>

                <td className="p-4">
                  {reservation.quantity}
                </td>

                <td className="p-4">

                  <span
                    className={`

                    px-4
                    py-2
                    rounded-full
                    text-sm
                    font-medium

                    ${
                      reservation.status ===
                      "ACTIVE"

                        ? "bg-emerald-100 text-emerald-600"

                        : reservation.status ===
                          "PENDING"

                        ? "bg-yellow-100 text-yellow-600"

                        : "bg-red-100 text-red-600"
                    }

                    `}
                  >

                    {reservation.status}

                  </span>

                </td>

                <td className="p-4">

                  <div className="flex items-center gap-2 text-slate-600">

                    <Clock3 size={16} />

                    {new Date(
                      reservation.expiresAt
                    ).toLocaleString()}

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