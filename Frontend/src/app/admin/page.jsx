"use client";
import React from "react";
import Link from "next/link";

import { motion } from "framer-motion";
import { FileText, MessageCircle, Archive, CalendarCheck } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { title: "Active Forms", count: 12, icon: <FileText className="w-6 h-6 text-blue-500" /> },
    { title: "Active Polls", count: 5, icon: <MessageCircle className="w-6 h-6 text-orange-500" /> },
    { title: "Vault Items", count: 30, icon: <Archive className="w-6 h-6 text-green-500" /> },
    { title: "Upcoming Events", count: 7, icon: <CalendarCheck className="w-6 h-6 text-purple-500" /> },
  ];

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white">
      {/* Animated Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Welcome Back, Admin
        </h1>
        <p className="text-gray-400 mt-1">Today is {today}</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-800 p-6 rounded-2xl shadow hover:shadow-lg flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium text-gray-300">{stat.title}</h2>
              <div className="p-2 bg-slate-700 rounded-lg">{stat.icon}</div>
            </div>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold"
            >
              {stat.count}
            </motion.p>
          </motion.div>
        ))}
      </div>


<div className="mt-10">
  <h2 className="text-xl font-semibold mb-4 text-gray-300">Quick Actions</h2>
  <div className="flex flex-wrap gap-4">
    {[
      { label: "Add Form", href: "/admin/forms" },
      { label: "Create Poll", href: "/admin/polls" },
      { label: "Add Event", href: "/admin/events" },
    ].map((action, i) => (  
      <Link key={i} href={action.href} passHref>
        <motion.a
          whileHover={{ scale: 1.05, backgroundColor: "#3b82f6" }}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium transition-colors inline-block"
        >
          {action.label}
        </motion.a>
      </Link>
    ))}
  </div>
</div>

    </div>
  );
};

export default AdminDashboard;
