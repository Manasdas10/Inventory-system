"use client";

export default function StatCard({
  title,
  value,
  icon,
  color,
}: any) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 hover:scale-[1.02] transition-all duration-300">

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