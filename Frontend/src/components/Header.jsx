"use client";
import React from "react";
import { Bell, Search, Cloud, PanelLeft, ChevronDown } from "lucide-react";
import Image from "next/image";
import node from "../public/ref2.png";
import Link from "next/link";

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-[#1f2a5c] w-full py-4 px-4 shadow-sm text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Image src={node} alt="Logo" width={50} height={50} />
          <span className="text-2xl font-bold tracking-wide">
            Uni
            <span className="bg-gradient-to-r from-[#47c0e8] to-[#3b82f6] bg-clip-text text-transparent">
              Sync
            </span>
          </span>

          {/* Sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <PanelLeft className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* Center Search Bar */}
        {/* <div className="hidden sm:flex items-center bg-white rounded-full px-4 py-2 w-full max-w-xl mx-8 shadow-sm">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by address, location, or ID"
            className="ml-3 w-full text-sm bg-transparent placeholder-gray-400 focus:outline-none text-black"
          />
          <button className="ml-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm px-4 py-1.5 rounded-full font-medium hover:opacity-90 transition">
            Search
          </button>
        </div> */}

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <Link 
          href='/notifications'
          className="p-2 hover:bg-white/10 rounded-full transition">
            <Bell className="w-5 h-5" />
          </Link>

          {/* Profile section */}
          {/* <div className="flex items-center gap-2 bg-[#324a91] px-3 py-1.5 rounded-full cursor-pointer hover:bg-[#3c599e] transition">
            <div className="w-7 h-7 bg-white text-[#324a91] rounded-full flex items-center justify-center font-semibold text-sm">
              L
            </div>
            <div className="hidden sm:block text-sm leading-tight">
              <div className="font-semibold">LAKHAN</div>
              <div className="text-xs text-white/70">Student</div>
            </div>
            <ChevronDown className="w-4 h-4" />
          </div> */}
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

export default Header;
