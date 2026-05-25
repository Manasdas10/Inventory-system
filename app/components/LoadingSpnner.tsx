"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  text = "Loading...",
}: {
  text?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20">

      <div className="bg-cyan-100 p-6 rounded-full">

        <Loader2
          size={40}
          className="animate-spin text-cyan-700"
        />

      </div>

      <p className="mt-5 text-slate-500 font-medium">
        {text}
      </p>

    </div>
  );
}