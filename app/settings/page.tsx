"use client";

import { useState } from "react";

import {
  Settings,
  Bell,
  Moon,
  Shield,
  Building2,
  Save,
} from "lucide-react";

export default function SettingsPage() {

  const [darkMode, setDarkMode] =
    useState(false);

  const [notifications,
    setNotifications] =
    useState(true);

  const [hospitalName,
    setHospitalName] =
    useState("Allo Health");

  const [lowStockThreshold,
    setLowStockThreshold] =
    useState(5);

  const saveSettings = () => {

    alert(
      "Settings saved successfully"
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            System Settings
          </h1>

          <p className="text-slate-500 mt-2">
            Manage platform preferences
            and configurations
          </p>

        </div>

        <div className="bg-cyan-100 text-cyan-700 p-5 rounded-3xl">

          <Settings size={34} />

        </div>

      </div>

      {/* SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* HOSPITAL INFO */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-cyan-100 text-cyan-700 p-4 rounded-2xl">

              <Building2 />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                Hospital Information
              </h2>

              <p className="text-slate-500">
                Update healthcare details
              </p>

            </div>

          </div>

          <div className="space-y-5">

            <div>

              <label className="text-sm text-slate-500 mb-2 block">
                Hospital Name
              </label>

              <input
                type="text"
                value={hospitalName}
                onChange={(e) =>
                  setHospitalName(
                    e.target.value
                  )
                }
                className="w-full border border-slate-300 p-4 rounded-2xl"
              />

            </div>

            <div>

              <label className="text-sm text-slate-500 mb-2 block">
                Low Stock Threshold
              </label>

              <input
                type="number"
                value={lowStockThreshold}
                onChange={(e) =>
                  setLowStockThreshold(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full border border-slate-300 p-4 rounded-2xl"
              />

            </div>

          </div>

        </div>

        {/* SYSTEM PREFERENCES */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          <div className="flex items-center gap-4 mb-8">

            <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl">

              <Shield />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                System Preferences
              </h2>

              <p className="text-slate-500">
                Configure notifications and themes
              </p>

            </div>

          </div>

          <div className="space-y-6">

            {/* DARK MODE */}
            <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl">

              <div className="flex items-center gap-4">

                <div className="bg-slate-200 p-3 rounded-xl">

                  <Moon size={20} />

                </div>

                <div>

                  <h3 className="font-semibold text-slate-800">
                    Dark Mode
                  </h3>

                  <p className="text-sm text-slate-500">
                    Enable dark dashboard
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setDarkMode(
                    !darkMode
                  )
                }
                className={`

                w-16 h-8 rounded-full transition-all relative

                ${
                  darkMode
                    ? "bg-cyan-600"
                    : "bg-slate-300"
                }

                `}
              >

                <div
                  className={`

                  absolute top-1 w-6 h-6 bg-white rounded-full transition-all

                  ${
                    darkMode
                      ? "left-9"
                      : "left-1"
                  }

                  `}
                />

              </button>

            </div>

            {/* NOTIFICATIONS */}
            <div className="flex items-center justify-between bg-slate-50 p-5 rounded-2xl">

              <div className="flex items-center gap-4">

                <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl">

                  <Bell size={20} />

                </div>

                <div>

                  <h3 className="font-semibold text-slate-800">
                    Notifications
                  </h3>

                  <p className="text-sm text-slate-500">
                    Low stock alerts
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setNotifications(
                    !notifications
                  )
                }
                className={`

                w-16 h-8 rounded-full transition-all relative

                ${
                  notifications
                    ? "bg-cyan-600"
                    : "bg-slate-300"
                }

                `}
              >

                <div
                  className={`

                  absolute top-1 w-6 h-6 bg-white rounded-full transition-all

                  ${
                    notifications
                      ? "left-9"
                      : "left-1"
                  }

                  `}
                />

              </button>

            </div>

          </div>

        </div>

      </div>

      {/* SAVE BUTTON */}
      <div className="mt-10">

        <button
          onClick={saveSettings}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 shadow-lg"
        >

          <Save size={20} />

          Save Settings

        </button>

      </div>

    </div>
  );
}