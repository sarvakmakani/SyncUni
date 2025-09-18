"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Poll Available",
      message: "Check out the latest poll on programming languages!",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Workshop Reminder",
      message: "Offline workshop scheduled for next week. Don't miss it!",
      time: "1 day ago",
      read: true,
    },
    {
      id: 3,
      title: "System Update",
      message: "UniSync has been updated with new features.",
      time: "3 days ago",
      read: false,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#3b82f6] hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Bell className="w-6 h-6 text-blue-400" /> Notifications
      </h1>

      {notifications.length === 0 ? (
        <div className="text-center text-gray-400 text-lg">
          No notifications at the moment.
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-xl border border-gray-700 shadow-md flex justify-between items-start gap-4
                ${notification.read ? "bg-slate-800" : "bg-blue-900"}
              `}
            >
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{notification.title}</h2>
                <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
                <span className="text-gray-400 text-xs mt-1 block">{notification.time}</span>
              </div>

              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-sm text-blue-300 font-medium hover:text-white transition"
                >
                  Mark as Read
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
