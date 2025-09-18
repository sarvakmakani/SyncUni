"use client";
import React from "react";

export default function AdminVaultPlaceholder() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <h1 className="text-3xl font-bold text-[#47c0e8] mb-4">
          Vault Section
        </h1>
        <p className="text-gray-300 mb-6">
          The Vault section for managing student documents will be live soon.
        </p>
        <p className="text-gray-400 text-sm">
          Stay tuned for updates. Students will be able to upload their certificates and important documents here.
        </p>
      </div>
    </div>
  );
}
