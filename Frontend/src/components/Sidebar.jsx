"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  PieChart,
  Lock,
  Calendar,
  Bell,
  Megaphone,
  Settings,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/", icon: <Home size={18} /> },
  { label: "Forms", href: "/forms", icon: <FileText size={18} /> },
  { label: "Polls", href: "/polls", icon: <PieChart size={18} /> },
  { label: "Vault", href: "/vault", icon: <Lock size={18} /> },
  { label: "Calendar", href: "/calendar", icon: <Calendar size={18} /> },
  { label: "Events", href: "/events", icon: <Bell size={18} /> },
  { label: "CIE ", href: "/cie", icon: <Megaphone size={18} /> },
  // { label: "Settings", href: "/settings", icon: <Settings size={18} /> },
];

const Sidebar = ({ sidebarOpen, toggleSidebar, mode = "vault" }) => {
  const pathname = usePathname() || "/";
  const headerTitle = (() => {
    if (pathname === "/" || pathname.startsWith("/dashboard")) return "Dashboard";
    const matched = menuItems.find(
      (item) => item.href !== "/" && pathname.startsWith(item.href)
    );
    return matched ? matched.label : "Dashboard";
  })();
  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#1f2a5c] to-[#162040] 
          text-white p-5 shadow-xl border-r border-white/10 z-50
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:static sm:flex sm:flex-col
        `}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-2xl font-bold tracking-wide relative">
            {headerTitle}
            <div className="absolute bottom-[-6px] left-0 w-18 h-1 bg-slate-900 rounded-full"></div>
          </div>
          {/* Close button (mobile only) */}
          <button
            onClick={toggleSidebar}
            className="sm:hidden p-2 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1">
          {menuItems.map((item, index) => {
            const isDashboardContext = mode === "dashboard";
            const isActive =
              item.label === "Dashboard"
                ? pathname === "/" || pathname.startsWith("/dashboard")
                : pathname.startsWith(item.href);

            const itemContent = (
              <>
                <span className={`absolute left-0 top-0 h-full w-1 bg-[#E5E5E5] ${isActive ? "scale-y-100" : "scale-y-0"} group-hover:scale-y-100 origin-top transition-transform`}></span>
                {item.icon}
                <span>{item.label}</span>
              </>
            );

            if (isDashboardContext && item.label !== "Dashboard") {
              return (
                <button
                  key={index}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium relative group opacity-60 cursor-not-allowed ${isActive ? "bg-white/10" : ""}`}
                  aria-disabled
                >
                  {itemContent}
                </button>
              );
            }

            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium relative group ${isActive ? "bg-white/10" : ""}`}
              >
                {itemContent}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto border-t border-white/10 pt-4 text-xs text-white/60">
          © 2025 University Portal
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
  