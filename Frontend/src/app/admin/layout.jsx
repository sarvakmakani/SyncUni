"use client";
import React, { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar open by default

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white transition-all duration-300">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <AdminSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Section (Header + Content) */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Header - always fixed at the top */}
        <AdminHeader toggleSidebar={toggleSidebar} />

        {/* Main Content - full width, no margin */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
