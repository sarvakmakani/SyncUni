"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  PieChart,
  Lock,
  Megaphone,
  Bell,
  Users,
  X,
} from "lucide-react";

const adminMenuItems = [
  { label: "Dashboard", href: "/admin", icon: <Home size={18} /> },
  { label: "Forms", href: "/admin/forms", icon: <FileText size={18} /> },
  { label: "Polls", href: "/admin/polls", icon: <PieChart size={18} /> },
  { label: "Vault", href: "/admin/vault", icon: <Lock size={18} /> },
  { label: "Events", href: "/admin/events", icon: <Bell size={18} /> },
  { label: "CIE", href: "/admin/cie", icon: <Megaphone size={18} /> },
  {
    label: "Announcements",
    href: "/admin/announcements",
    icon: <Users size={18} />,
  },
];

const AdminSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const pathname = usePathname() || "/";

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-gradient-to-b from-[#2e3a74] to-[#1c2440] text-white
          shadow-xl border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:-translate-x-full sm:hidden"}
          sm:block
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <span className="text-xl font-bold tracking-wide">Admin Panel</span>

          {/* Close button only visible on mobile */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/10 sm:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 p-4">
          {adminMenuItems.map((item, index) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href);

            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium relative ${
                  isActive ? "bg-white/10" : ""
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-white/10 p-4 text-xs text-white/60">
          © 2025 UniSync Admin
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
