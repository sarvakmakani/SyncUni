"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Hero from "@/components/Hero";
import "./globals.css";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // closed by default

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with overlay on mobile */}
      {sidebarOpen && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          mode="vault"
        />
      )}
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />
        <Hero />
      </div>
    </div>
  );
}
