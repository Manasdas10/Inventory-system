"use client";

import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

import toast from "react-hot-toast";

import {
  ShieldPlus,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
  AlertTriangle,
} from "lucide-react";

type Reservation = {
  id: string;

  quantity: number;

  status: string;

  expiresAt: string;

  createdAt: string;

  warehouse?: {
    name: string;
  };

  product: {
    name: string;
    category: string;
  };
};

export default function ReservationsPage() {

  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  //////////////////////////////////////////////////////
  // FETCH RESERVATIONS
  //////////////////////////////////////////////////////

  const fetchReservations =
    async () => {

      try {

        setLoading(true);

        const response =
          await fetch(
            "/api/reservations",
            {
              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        setReservations(
          data.reservations || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchReservations();

    const interval =
      setInterval(() => {

        fetchReservations();

      }, 1000);

    return () =>
      clearInterval(interval);

  }, []);

  //////////////////////////////////////////////////////
  // CONFIRM RESERVATION
  //////////////////////////////////////////////////////

  const confirmReservation =
    async (id: string) => {

      try {

        const res =
          await fetch(
            `/api/reservations/${id}/confirm`,
            {
              method: "POST",
            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          toast.error(
            data.message ||
            "Confirmation failed"
          );

          return;
        }

        toast.success(
          "Reservation confirmed"
        );

        fetchReservations();

      } catch (error) {

        console.log(error);

        toast.error(
          "Something went wrong"
        );
      }
    };

  //////////////////////////////////////////////////////
  // TIMER
  //////////////////////////////////////////////////////

  const getTimeRemaining =
    (expiresAt: string) => {

      const total =

        new Date(expiresAt)
          .getTime()

        -

        new Date().getTime();

      if (total <= 0) {
        return "Expired";
      }

      const minutes = Math.floor(
        total / 1000 / 60
      );

      const seconds = Math.floor(
        (total / 1000) % 60
      );

      return `${String(minutes)
        .padStart(2, "0")}:${String(seconds)
        .padStart(2, "0")}`;
    };

  //////////////////////////////////////////////////////
  // FILTER
  //////////////////////////////////////////////////////

  const filteredReservations =
    reservations.filter(
      (reservation) =>
        reservation.product.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  //////////////////////////////////////////////////////
  // STATUS COLORS
  //////////////////////////////////////////////////////

  const getStatusStyle = (
    status: string
  ) => {

    switch (status) {

      case "CONFIRMED":

        return "bg-emerald-100 text-emerald-700";

      case "PENDING":

        return "bg-yellow-100 text-yellow-700";

      case "EXPIRED":

        return "bg-red-100 text-red-700";

      default:

        return "bg-slate-100 text-slate-700";
    }
  };

  return (

    <div className="flex bg-slate-100 min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 ml-72 p-8">

        {/* NAVBAR */}
        <Navbar />

        <div className="mt-8">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">

            <div>

              <h1 className="text-5xl font-bold text-slate-800">

                Reservation Management

              </h1>

              <p className="text-slate-500 mt-3 text-lg">

                Real-time medical inventory reservations

              </p>

            </div>

            <div className="bg-emerald-100 text-emerald-600 p-5 rounded-3xl shadow-lg">

              <ShieldPlus size={40} />

            </div>

          </div>

          {/* SEARCH */}
          <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">

            <div className="flex items-center bg-slate-100 px-4 py-4 rounded-2xl w-full md:w-[450px]">

              <Search
                size={18}
                className="text-slate-400 mr-2"
              />

              <input
                type="text"
                placeholder="Search reservations..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="bg-transparent outline-none w-full"
              />

            </div>

          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl shadow-xl p-8">

            <div className="flex items-center justify-between mb-8">

              <h2 className="text-3xl font-bold text-slate-800">

                Active Reservations

              </h2>

              <div className="text-slate-500 font-medium">

                Total:
                {" "}
                {
                  filteredReservations.length
                }

              </div>

            </div>

            {loading ? (

              <div className="py-20 text-center text-slate-500 text-xl">

                Loading reservations...

              </div>

            ) : (

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
                        Warehouse
                      </th>

                      <th className="text-left p-4">
                        Quantity
                      </th>

                      <th className="text-left p-4">
                        Status
                      </th>

                      <th className="text-left p-4">
                        Countdown
                      </th>

                      <th className="text-left p-4">
                        Created
                      </th>

                      <th className="text-left p-4">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredReservations.map(
                      (reservation) => (

                        <tr
                          key={reservation.id}
                          className="border-b border-slate-100 hover:bg-slate-50"
                        >

                          <td className="p-4 font-semibold">

                            {
                              reservation
                                .product
                                .name
                            }

                          </td>

                          <td className="p-4">

                            {
                              reservation
                                .product
                                .category
                            }

                          </td>

                          <td className="p-4">

                            {
                              reservation
                                .warehouse
                                ?.name ||
                              "Main Warehouse"
                            }

                          </td>

                          <td className="p-4">

                            {
                              reservation.quantity
                            }

                          </td>

                          <td className="p-4">

                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                                reservation.status
                              )}`}
                            >

                              {
                                reservation.status
                              }

                            </span>

                          </td>

                          <td className="p-4">

                            <div className="flex items-center gap-2">

                              <Clock3
                                size={18}
                                className="text-cyan-600"
                              />

                              <span className="font-semibold">

                                {
                                  reservation.status ===
                                  "CONFIRMED"

                                    ? "Confirmed"

                                    : getTimeRemaining(
                                        reservation.expiresAt
                                      )
                                }

                              </span>

                              {getTimeRemaining(
                                reservation.expiresAt
                              ) ===
                                "Expired" && (

                                <AlertTriangle
                                  size={18}
                                  className="text-red-500"
                                />

                              )}

                            </div>

                          </td>

                          <td className="p-4 text-slate-500">

                            {new Date(
                              reservation.createdAt
                            ).toLocaleDateString()}

                          </td>

                          <td className="p-4">

                            {reservation.status ===
                              "PENDING" &&

                              getTimeRemaining(
                                reservation.expiresAt
                              ) !==
                                "Expired" && (

                              <button
                                onClick={() =>
                                  confirmReservation(
                                    reservation.id
                                  )
                                }
                                className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 text-white px-5 py-2 rounded-2xl font-semibold shadow-lg"
                              >

                                Confirm

                              </button>

                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

            <SummaryCard
              title="Confirmed"
              value={
                reservations.filter(
                  (r) =>
                    r.status ===
                    "CONFIRMED"
                ).length
              }
              icon={<CheckCircle2 />}
              color="emerald"
            />

            <SummaryCard
              title="Pending"
              value={
                reservations.filter(
                  (r) =>
                    r.status ===
                    "PENDING"
                ).length
              }
              icon={<Clock3 />}
              color="yellow"
            />

            <SummaryCard
              title="Expired"
              value={
                reservations.filter(
                  (r) =>
                    r.status ===
                    "EXPIRED"
                ).length
              }
              icon={<XCircle />}
              color="red"
            />

          </div>

        </div>

      </div>

    </div>
  );
}

//////////////////////////////////////////////////////
// SUMMARY CARD
//////////////////////////////////////////////////////

function SummaryCard({
  title,
  value,
  icon,
  color,
}: any) {

  return (

    <div className="bg-white rounded-3xl shadow-xl p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-slate-500">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-slate-800 mt-3">

            {value}

          </h2>

        </div>

        <div
          className={`

          ${
            color === "emerald"

              ? "bg-emerald-100 text-emerald-600"

              : color === "yellow"

              ? "bg-yellow-100 text-yellow-600"

              : "bg-red-100 text-red-600"
          }

          p-4 rounded-2xl
          `}
        >

          {icon}

        </div>

      </div>

    </div>
  );
}