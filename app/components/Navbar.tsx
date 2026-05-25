"use client";

import {
  LogOut,
} from "lucide-react";

import {
  signOut,
} from "next-auth/react";

import {
  useSession,
} from "next-auth/react";

export default function Navbar() {

  const { data: session } = useSession();

  return (

    <div className="bg-white shadow-xl rounded-3xl p-6 flex items-center justify-between">

      <div>

        <h2 className="text-3xl font-bold text-slate-800">

          Allo Health Dashboard

        </h2>

        <p className="text-slate-500 mt-1">

             Role:
            {" "}

            <span className="font-semibold">

                {
                 (session?.user as any)
                    ?.role
                }

             </span>

        </p>

      </div>

      <div className="flex items-center gap-5">

        <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">

          A

        </div>

        <button
          onClick={() =>
            signOut({
              callbackUrl:
                "/login",
            })
          }
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2 transition-all duration-300"
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </div>
  );
}