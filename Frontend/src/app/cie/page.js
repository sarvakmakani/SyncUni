"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { CalendarDays, Clock, MapPin, FileText,BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function CieAnnouncementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Example Data - Replace with API later
  const [cieAnnouncements, setCieAnnouncements] = useState([
    {
      id: 1,
      subject: "Machine Learning",
      date: "2025-08-28",
      time: "2:20 PM - 3:20 PM",
      venue: "Room 301",
      professor: "Prof. Kashyap Patel",
      syllabus: "UNIT 5.",
    },
    {
      id: 2,
      subject: "DAA",
      date: "2025-08-29",
      time: "10:10 AM - 11:10 AM",
      venue: "Room 205",
      professor: "Prof. Premal Patel",
      syllabus: "UNIT 7 & 8.",
    },
  ]);

  // Later: Fetch from backend
  // useEffect(() => {
  //   fetch("/api/cie-announcements")
  //     .then(res => res.json())
  //     .then(data => setCieAnnouncements(data));
  // }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          mode="vault"
        />
      )}

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />

        {/* Page Header */}
        <div className="p-6">
          <div className="bg-gradient-to-r from-[#47c0e8] via-[#3b82f6] to-[#6366f1] rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-white drop-shadow-md" />
            <h1 className="text-3xl font-bold tracking-tight">
              CIE Announcements
            </h1>
          </div>

          {/* CIE Announcement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cieAnnouncements.map((cie, index) => (
              <motion.div
                key={cie.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-slate-900 border border-slate-800 hover:border-[#47c0e8] 
                 rounded-2xl p-6 shadow-md hover:shadow-xl 
                 transition transform hover:-translate-y-1"
              >
                {/* Subject Name */}
                <h2 className="text-xl font-bold text-[#47c0e8] mb-2">
                  {cie.subject}
                </h2>

                {/* Professor Name */}
                <p className="text-gray-400 text-sm mb-4">
                  Conducted by:{" "}
                  <span className="font-medium">{cie.professor}</span>
                </p>

                {/* Date */}
                <div className="flex items-center gap-2 text-gray-300 mb-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>{cie.date}</span>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2 text-gray-300 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{cie.time}</span>
                </div>

                {/* Venue */}
                <div className="flex items-center gap-2 text-gray-300 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{cie.venue}</span>
                </div>

                {/* Syllabus */}
                <div className="flex items-start gap-2 text-gray-300 mb-4">
                  <BookOpen className="w-4 h-4 mt-1" /> {/* optional icon */}
                  <span className="text-sm">{cie.syllabus}</span>
                </div>

                {/* Optional Message */}
                {/* <p className="text-gray-300 text-sm">{cie.message}</p> */}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
