"use client";

import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

import {

  BarChart,
  Bar,

  PieChart,
  Pie,
  Cell,

  ResponsiveContainer,

  XAxis,
  YAxis,

  Tooltip,
  CartesianGrid,

  LineChart,
  Line,

} from "recharts";

import {

  Activity,
  TrendingUp,
  Package,
  AlertTriangle,
  ShieldCheck,

} from "lucide-react";

export default function AnalyticsPage() {

  const [inventory, setInventory] =
    useState<any[]>([]);

  const [reservations, setReservations] =
    useState<any[]>([]);

  //////////////////////////////////////////////////////
  // FETCH ANALYTICS
  //////////////////////////////////////////////////////

  const fetchAnalytics =
    async () => {

      try {

        const inventoryRes =
          await fetch(
            "/api/inventory",
            {
              cache:
                "no-store",
            }
          );

        const inventoryData =
          await inventoryRes.json();

        setInventory(
          inventoryData.inventory || []
        );

        const reservationRes =
          await fetch(
            "/api/reservations",
            {
              cache:
                "no-store",
            }
          );

        const reservationData =
          await reservationRes.json();

        setReservations(
          reservationData.reservations || []
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchAnalytics();

  }, []);

  //////////////////////////////////////////////////////
  // STOCK DATA
  //////////////////////////////////////////////////////

  const stockData =
    inventory.map((item: any) => ({

      name:
        item.product?.name,

      stock:
        item.availableUnits,

      reserved:
        item.reservedUnits,
    }));

  //////////////////////////////////////////////////////
  // CATEGORY DATA
  //////////////////////////////////////////////////////

  const categoryMap:
    Record<string, number> = {};

  inventory.forEach(
    (item: any) => {

      const category =
        item.product?.category ||
        "GENERAL";

      if (
        !categoryMap[category]
      ) {

        categoryMap[category] = 0;
      }

      categoryMap[category] +=
        item.availableUnits;
    }
  );

  const categoryData =
    Object.keys(categoryMap)
      .map((key) => ({

        name: key,

        value:
          categoryMap[key],
      }));

  //////////////////////////////////////////////////////
  // RESERVATION STATUS
  //////////////////////////////////////////////////////

  const reservationStatusData = [

    {
      name: "Confirmed",

      value:
        reservations.filter(
          (r: any) =>
            r.status ===
            "CONFIRMED"
        ).length,
    },

    {
      name: "Pending",

      value:
        reservations.filter(
          (r: any) =>
            r.status ===
            "PENDING"
        ).length,
    },

    {
      name: "Expired",

      value:
        reservations.filter(
          (r: any) =>
            r.status ===
            "EXPIRED"
        ).length,
    },
  ];

  //////////////////////////////////////////////////////
  // KPI
  //////////////////////////////////////////////////////

  const totalProducts =
    inventory.length;

  const totalStock =
    inventory.reduce(
      (acc, item) =>
        acc +
        item.availableUnits,
      0
    );

  const lowStock =
    inventory.filter(
      (item) =>
        item.availableUnits < 5
    ).length;

  const confirmedReservations =
    reservations.filter(
      (r: any) =>
        r.status ===
        "CONFIRMED"
    ).length;

  //////////////////////////////////////////////////////
  // COLORS
  //////////////////////////////////////////////////////

  const COLORS = [

    "#06b6d4",

    "#3b82f6",

    "#10b981",

    "#f59e0b",

    "#ef4444",
  ];

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

                Analytics Dashboard

              </h1>

              <p className="text-slate-500 mt-3 text-lg">

                Real-time healthcare inventory insights

              </p>

            </div>

            <div className="bg-cyan-100 text-cyan-700 p-5 rounded-3xl shadow-lg">

              <TrendingUp size={40} />

            </div>

          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

            <AnalyticsCard
              title="Total Products"
              value={totalProducts}
              icon={<Package />}
              color="bg-cyan-100 text-cyan-700"
            />

            <AnalyticsCard
              title="Available Stock"
              value={totalStock}
              icon={<Activity />}
              color="bg-emerald-100 text-emerald-700"
            />

            <AnalyticsCard
              title="Low Stock"
              value={lowStock}
              icon={<AlertTriangle />}
              color="bg-red-100 text-red-700"
            />

            <AnalyticsCard
              title="Confirmed Reservations"
              value={
                confirmedReservations
              }
              icon={<ShieldCheck />}
              color="bg-blue-100 text-blue-700"
            />

          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* BAR CHART */}
            <div className="bg-white rounded-3xl shadow-xl p-8">

              <div className="mb-8">

                <h2 className="text-2xl font-bold text-slate-800">

                  Product Stock

                </h2>

                <p className="text-slate-500 mt-1">

                  Available inventory units

                </p>

              </div>

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <BarChart
                  data={stockData}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="name"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="stock"
                    fill="#06b6d4"
                    radius={[
                      10,
                      10,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

            {/* PIE CHART */}
            <div className="bg-white rounded-3xl shadow-xl p-8">

              <div className="mb-8">

                <h2 className="text-2xl font-bold text-slate-800">

                  Category Distribution

                </h2>

                <p className="text-slate-500 mt-1">

                  Product category analytics

                </p>

              </div>

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <PieChart>

                  <Pie
                    data={
                      categoryData
                    }
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label
                  >

                    {categoryData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                                COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* LINE CHART */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-10">

            <div className="mb-8">

              <h2 className="text-2xl font-bold text-slate-800">

                Reservation Analytics

              </h2>

              <p className="text-slate-500 mt-1">

                Stock reservation trends

              </p>

            </div>

            <ResponsiveContainer
              width="100%"
              height={400}
            >

              <LineChart
                data={stockData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="reserved"
                  stroke="#10b981"
                  strokeWidth={4}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          {/* RESERVATION STATUS */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mt-10">

            <div className="mb-8">

              <h2 className="text-2xl font-bold text-slate-800">

                Reservation Status

              </h2>

              <p className="text-slate-500 mt-1">

                Reservation lifecycle overview

              </p>

            </div>

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <PieChart>

                <Pie
                  data={
                    reservationStatusData
                  }
                  outerRadius={130}
                  dataKey="value"
                  label
                >

                  {reservationStatusData.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}

//////////////////////////////////////////////////////
// KPI CARD
//////////////////////////////////////////////////////

function AnalyticsCard({
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

          p-4
          rounded-2xl

          ${color}

          `}
        >

          {icon}

        </div>

      </div>

    </div>
  );
}