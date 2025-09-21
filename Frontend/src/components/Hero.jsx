"use client";
import React, { useState,useEffect } from "react";
import {
  CalendarCheck,
  FileText,
  Archive,
  MessageCircle,
  Bell,
} from "lucide-react";
import axios from "axios";

const Hero = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [data,setData]=useState([])
  // Fetch polls
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/dashboard", {
        withCredentials: true,
      });
      setData(res.data.data); // ✅ contains alreadyVoted
    } catch (err) {
      console.error("Error fetching polls:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return (
      <section className="w-full px-4 py-6 text-center text-gray-600">
        Loading dashboard...
      </section>
    );
  }

  // ✅ Dynamic cards using backend data
  const cards = [
    {
      title: "Active Forms",
      count: data.activeForms,
      sub: `${data.activeForms} available now`,
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      color: "from-blue-100 to-blue-50",
    },
    {
      title: "Active Polls",
      count: data.activePolls,
      sub: `${data.activePolls} running`,
      icon: <MessageCircle className="w-6 h-6 text-orange-500" />,
      color: "from-orange-100 to-orange-50",
    },
    {
      title: "Vault Items",
      count: data.valutItems,
      sub: `${data.valutItems} uploaded`,
      icon: <Archive className="w-6 h-6 text-green-500" />,
      color: "from-green-100 to-green-50",
    },
    {
      title: "Upcoming Events",
      count: data.activeEvents,
      sub: `${data.activeEvents} upcoming`,
      icon: <CalendarCheck className="w-6 h-6 text-purple-500" />,
      color: "from-purple-100 to-purple-50",
    },
  ];

  const forms = [
    {
      id: 1,
      title: "Course Evaluation - CS 301",
      desc: "Provide feedback for Data Structures course",
      status: "pending",
      due: "Oct 15, 2024",
      left: "3 days left",
      action: "Start",
    },
    {
      id: 2,
      title: "Scholarship Application",
      desc: "Merit-based scholarship for Spring 2025",
      status: "in progress",
      due: "Oct 20, 2024",
      left: "8 days left",
      action: "Continue",
    },
    {
      id: 3,
      title: "Library Book Renewal",
      desc: "Renew borrowed textbooks",
      status: "completed",
      due: "Oct 10, 2024",
      left: "2 days overdue",
      action: "View",
    },
  ];

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    "in progress": "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
  };

  return (
    <section className="w-full bg-slate-900 px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#1f3582] to-[#3d5bc9] text-white rounded-3xl px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-lg">
        <div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            Welcome back, {data.name}!
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
        {cards.map((card, idx) => (
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
            <button className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 transition">
              Show All
            </button>
          </div>
          <div className="space-y-5">
            <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-gray-800">
                Mid-semester Break
              </h3>
              <p className="text-sm text-gray-600">
                University closed from Oct 15–22. Classes resume Oct 23.
              </p>
              <span className="text-xs text-gray-500 mt-2 block">
                2 hours ago • Academic Office
              </span>
            </div>
            <div className="border-l-4 border-green-600 bg-green-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-gray-800">
                New Library Resources
              </h3>
              <p className="text-sm text-gray-600">
                Access to IEEE library and 50+ new databases.
              </p>
              <span className="text-xs text-gray-500 mt-2 block">
                1 day ago • Library
              </span>
            </div>
          </div>
        </div>

        {/* Live Poll */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 flex flex-col justify-between">
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
              Student Center Renovation Priority
            </p>
            <p className="text-xs text-gray-500 mb-5">
              Which area should be renovated first?
            </p>

            <div className="space-y-3">
              {[
                "Food court and dining area",
                "Study spaces and library",
                "Recreation and fitness area",
                "Meeting rooms and event spaces",
              ].map((option, i) => (
                <label
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer hover:shadow-md transition bg-gray-50 hover:bg-blue-50"
                >
                  <input
                    type="radio"
                    name="poll"
                    className="accent-blue-600 w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 shadow transition">
              Submit Vote
            </button>
            <button className="px-5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Recent Forms */}
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 p-6 mt-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
            Recent Forms
          </h2>
          <button className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 transition">
            View All
          </button>
        </div>

        <div className="grid gap-5">
          {forms.map((form) => (
            <div
              key={form.id}
              className="p-5 rounded-xl border border-gray-200 hover:shadow-md transition bg-gray-50"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{form.title}</h3>
                  <p className="text-sm text-gray-600">{form.desc}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[form.status]}`}
                >
                  {form.status}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-600 border-t pt-3">
                <span>Due: {form.due}</span>
                <span
                  className={`font-medium ${
                    form.left.includes("overdue")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {form.left}
                </span>
              </div>

              <div className="mt-4 text-right">
                <button
                  className={`px-5 py-2 text-sm rounded-lg font-medium shadow transition ${
                    form.status === "completed"
                      ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {form.action}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
