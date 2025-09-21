"use client";
import {
  Bell,
  Search,
  Cloud,
  PanelLeft,
  ChevronDown,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import node from "../public/ref2.png";
import {React, useState,useEffect } from "react";


const Header = ({ toggleSidebar }) => {
  const [unreadCount,setUnreadCount]=useState(0)
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch user data on component mount
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/me", {
        withCredentials: true,
      });
      setUser(res.data.user);

      const notifRes = await axios.get("http://localhost:5000/notification/count", {
        withCredentials: true,
      });
      
      setUnreadCount(notifRes.data.data);

    } catch (err) {
      console.log("User not logged in:", err);
      setUser(null); // Ensure user is null if not logged in
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
      toast.success("Logged out successfully!");
      router.push("/login"); // Redirect to login page
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <header className="bg-[#1f2a5c] w-full py-4 px-4 shadow-sm text-white">
      <Toaster />
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

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notification Bell */}
          <Link
            href='/notifications'
            className="relative p-2 hover:bg-white/10 rounded-full transition"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* User and Logout section */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#47c0e8] to-[#3b82f6] text-white font-medium text-sm">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#47c0e8] to-[#3b82f6] text-white font-medium text-sm hover:opacity-90 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;