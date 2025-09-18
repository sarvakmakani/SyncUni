"use client";
import React from "react";
import Link from "next/link";
import { PanelLeft, LogOut } from "lucide-react";

const AdminHeader = ({ toggleSidebar }) => {
  return (
    <header className="bg-[#1f2a5c] w-full h-16 flex items-center px-4 shadow-sm text-white">
      <div className="w-full flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <PanelLeft className="w-6 h-6" />
          </button>
          <span className="text-xl font-bold">Admin Panel</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
         <Link
            href="/login"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#47c0e8] to-[#3b82f6] text-white font-medium text-sm hover:opacity-90 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
