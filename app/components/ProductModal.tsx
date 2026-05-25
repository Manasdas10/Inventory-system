"use client";

import { motion } from "framer-motion";

import { X } from "lucide-react";

export default function ProductModal({
  isOpen,
  onClose,
  title,
  children,
}: any) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5">

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
          y: 50,
        }}

        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}

        exit={{
          opacity: 0,
          scale: 0.8,
        }}

        transition={{
          duration: 0.25,
        }}

        className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl p-8 relative"
      >

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition-all"
        >

          <X size={20} />

        </button>

        {/* TITLE */}
        <div className="mb-8">

          <h2 className="text-3xl font-bold text-slate-800">
            {title}
          </h2>

        </div>

        {/* CONTENT */}
        {children}

      </motion.div>

    </div>
  );
}