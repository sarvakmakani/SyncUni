"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import {
  CalendarCheck,
  FileText,
  Archive,
  MessageCircle,
  Bell,
} from "lucide-react";

export default function Hero() {
  const [stats, setStats] = useState({
    forms: { count: 0, sub: "" },
    polls: { count: 0, sub: "" },
    vaultItems: { count: 0, sub: "" },
    events: { count: 0, sub: "" },
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [livePoll, setLivePoll] = useState(null);
  const [recentForms, setRecentForms] = useState([]);
  const [name, setName] = useState("Unknown");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/dashboard", {
        withCredentials: true,
      });

      const dashboardData = response.data.data;

      // Update stats
      setStats({
        forms: {
          count: dashboardData.activeForms,
          sub: `${dashboardData.formsDueThisWeek || 0} due this week`,
        },
        polls: {
          count: dashboardData.activePolls,
          sub: `${dashboardData.pollsEndingSoon || 0} ending soon`,
        },
        vaultItems: {
          count: dashboardData.vaultItems || 0,
          sub: `${dashboardData.newVaultItems || 0} new this week`,
        },
        events: {
          count: dashboardData.activeEvents,
          sub: `${dashboardData.todayEvents || 0} today`,
        },
      });

      
      // Update other sections
      setRecentAnnouncements(dashboardData.announcements);
      setLivePoll(dashboardData.polls);
      setRecentForms(dashboardData.forms);
      setName(dashboardData.name);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cardData = [
    {
      title: "Active Forms",
      count: stats.forms.count,
      sub: stats.forms.sub,
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      color: "from-blue-100 to-blue-50",
    },
    {
      title: "Active Polls",
      count: stats.polls.count,
      sub: stats.polls.sub,
      icon: <MessageCircle className="w-6 h-6 text-orange-500" />,
      color: "from-orange-100 to-orange-50",
    },
    {
      title: "Vault Items",
      count: stats.vaultItems.count,
      sub: stats.vaultItems.sub,
      icon: <Archive className="w-6 h-6 text-green-500" />,
      color: "from-green-100 to-green-50",
    },
    {
      title: "Upcoming Events",
      count: stats.events.count,
      sub: stats.events.sub,
      icon: <CalendarCheck className="w-6 h-6 text-purple-500" />,
      color: "from-purple-100 to-purple-50",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-red-400">
        <p>Error: {error}. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-slate-900 px-4 sm:px-6 lg:px-8 py-6">
      <Toaster />
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1f3582] to-[#3d5bc9] text-white rounded-3xl px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-lg">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            Welcome back, {name}!
          </h1>
          <p className="text-white/80 text-sm">
            Stay updated with your university activities.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 text-right">
          <p className="text-sm opacity-80">Today</p>
          <p className="text-lg font-semibold">{today}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cardData.map((card, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-700">
                {card.title}
              </h2>
              <div className="p-2 bg-white rounded-lg shadow">{card.icon}</div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.count}</p>
            <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Announcements + Right Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {/* Announcements */}
        <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Bell className="w-5 h-5 text-blue-600" /> Recent Announcements
            </h2>
            <Link href="/announcements">
              <button className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 transition">
                Show All
              </button>
            </Link>
          </div>
          <div className="space-y-5">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((ann, idx) => (
                <div key={idx} className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-md shadow-sm">
                  <h3 className="font-semibold text-gray-800">{ann.title}</h3>
                  <p className="text-sm text-gray-600">{ann.description}</p>
                  <span className="text-xs text-gray-500 mt-2 block">
                    {new Date(ann.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent announcements found.</p>
            )}
          </div>
        </div>

        {/* Live Poll */}
          {console.log(livePoll)
          }
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 flex flex-col justify-between">
          {livePoll ? (
            <>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    Live Poll
                  </h2>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {livePoll.question}
                </p>
                <p className="text-xs text-gray-500 mb-5">
                  {livePoll.description}
                </p>
                <div className="space-y-3">
                  {livePoll.options.map((option, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer hover:shadow-md transition bg-gray-50 hover:bg-blue-50"
                    >
                      <input
                        type="radio"
                        name="poll"
                        // Add logic here to handle user selection
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  // Add onClick handler
                  className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 shadow transition"
                >
                  Submit Vote
                </button>
                <button
                  // Add onClick handler
                  className="px-5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
                >
                  Clear
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="w-10 h-10 text-gray-400 mb-4" />
              <p className="text-gray-500">No active polls right now.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}