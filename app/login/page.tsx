"use client";

import { useState } from "react";

import { signIn }
from "next-auth/react";

import { useRouter }
from "next/navigation";

export default function LoginPage() {

  const router =
    useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async () => {

      try {

        setLoading(true);

        const res =
          await signIn(
            "credentials",
            {

              email,
              password,

              redirect: false,
            }
          );

        if (res?.ok) {

          router.push("/");

        } else {

          alert(
            "Invalid credentials"
          );
        }

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-[420px]">

        <h1 className="text-4xl font-bold text-slate-800 mb-2">

          Admin Login

        </h1>

        <p className="text-slate-500 mb-8">

          Access Allo Health Dashboard

        </p>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full border border-slate-200 rounded-2xl px-5 py-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full border border-slate-200 rounded-2xl px-5 py-4"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-2xl font-semibold"
          >

            {
              loading
                ? "Logging in..."
                : "Login"
            }

          </button>

        </div>

      </div>

    </div>
  );
}