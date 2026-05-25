"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  ShieldPlus,
  BarChart3,
  Settings,
  Activity,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {

  const pathname = usePathname();

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-slate-950 to-slate-900 text-white flex flex-col justify-between shadow-2xl border-r border-slate-800">

      {/* TOP SECTION */}
      <div>

        {/* LOGO */}
        <div className="p-8 border-b border-slate-800">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">

              <Activity
                size={28}
                className="text-white"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-white">
                Allo Health
              </h1>

              <p className="text-slate-400 text-sm mt-1">
                Inventory System
              </p>

            </div>

          </div>

        </div>

        {/* MENU */}
        <div className="p-6 space-y-3">

          {/* DASHBOARD */}
          <Link href="/">

            <SidebarItem
              icon={<LayoutDashboard size={20} />}
              text="Dashboard"
              active={pathname === "/"}
            />

          </Link>

          {/* INVENTORY */}
          <Link href="/inventory">

            <SidebarItem
              icon={<Package size={20} />}
              text="Inventory"
              active={
                pathname === "/inventory"
              }
            />

          </Link>

          {/* RESERVATIONS */}
          <Link href="/reservations">

            <SidebarItem
              icon={<ShieldPlus size={20} />}
              text="Reservations"
              active={
                pathname ===
                "/reservations"
              }
            />

          </Link>

          {/* ANALYTICS */}
          <Link href="/analytics">

            <SidebarItem
              icon={<BarChart3 size={20} />}
              text="Analytics"
              active={
                pathname ===
                "/analytics"
              }
            />

          </Link>

          {/* SETTINGS */}
          <Link href="/settings">

            <SidebarItem
              icon={<Settings size={20} />}
              text="Settings"
              active={
                pathname ===
                "/settings"
              }
            />

          </Link>

        </div>

      </div>

      {/* BOTTOM PROFILE */}
      <div className="p-6">

        <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 backdrop-blur-lg">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">

                A

              </div>

              <div>

                <h3 className="font-semibold text-white">
                  Admin
                </h3>

                <p className="text-sm text-slate-400">
                  Inventory Manager
                </p>

              </div>

            </div>

            <ChevronRight
              className="text-slate-500"
              size={20}
            />

          </div>

        </div>

      </div>

    </div>
  );
}

function SidebarItem({
  icon,
  text,
  active = false,
}: any) {

  return (
    <button
      className={`

      w-full
      flex
      items-center
      gap-4
      px-5
      py-4
      rounded-2xl
      transition-all
      duration-300
      group

      ${
        active

          ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20"

          : "hover:bg-slate-800"
      }

      `}
    >

      <div
        className={`

        ${
          active
            ? "text-white"
            : "text-slate-400 group-hover:text-white"
        }

        `}
      >

        {icon}

      </div>

      <span
        className={`

        font-medium

        ${
          active
            ? "text-white"
            : "text-slate-300 group-hover:text-white"
        }

        `}
      >

        {text}

      </span>

    </button>
  );
}