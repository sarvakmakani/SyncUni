"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/notification", {
        withCredentials: true,
      });
      setNotifications(response.data.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to fetch notifications. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5000/notification/read/${id}`,
        {},
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      toast.success("Notification marked as read.");
    } catch (err) {
      console.error("Error marking as read:", err);
      toast.error("Failed to mark as read. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white">
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white flex-col">
        <p className="text-red-400">{error}</p>
        <button
          onClick={fetchNotifications}
          className="mt-4 px-4 py-2 bg-blue-600 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }
  const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <Toaster />
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
              key={notification._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-xl border border-gray-700 shadow-md flex justify-between items-start gap-4
                ${notification.isRead ? "bg-slate-800" : "bg-blue-900"}
              `}
            >
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{notification.title}</h2>
                <p className="text-gray-300 text-sm mt-1">
                  {notification.description}
                </p>
                <span className="text-gray-400 text-xs mt-1 block">
                  {formatDate(notification.createdAt)}
                </span>
              </div>

              {!notification.isRead && (
                <button
                  onClick={() => markAsRead(notification._id)}
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