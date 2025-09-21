"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { CalendarDays, Clock, MapPin, FileText, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function CieAnnouncementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cieAnnouncements, setCieAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Helper function to format the date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchCieAnnouncements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/cie", {
        withCredentials: true,
      });
      // Assuming your API returns an array of CIE announcements in response.data.data
      console.log(response.data.data);
      
      setCieAnnouncements(response.data.data);
    } catch (err) {
      console.error("Error fetching CIE announcements:", err);
      setError(
        err.response?.data?.message ||
        "Failed to fetch CIE announcements. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCieAnnouncements();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white">
        <p>Loading announcements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white flex-col">
        <p className="text-red-400">{error}</p>
        <button onClick={fetchCieAnnouncements} className="mt-4 px-4 py-2 bg-blue-600 rounded-md">
          Retry
        </button>
      </div>
    );
  }

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
            {cieAnnouncements.length === 0 ? (
              <p className="text-gray-400 text-lg">
                No announcements available at the moment.
              </p>
            ) : (
              cieAnnouncements.map((cie, index) => (
                <motion.div
                  key={cie._id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-slate-900 border border-slate-800 hover:border-[#47c0e8] 
                rounded-2xl p-6 shadow-md hover:shadow-xl 
                transition transform hover:-translate-y-1"
                >
                  {/* Subject Name */}
                  <h2 className="text-xl font-bold text-[#47c0e8] mb-2">
                    {cie.subjectName}
                  </h2>

                    {/* Professor Name */}
                  <p className="text-gray-400 text-sm mb-4">
                    Conducted by: Prof.{" "}
                    <span className="font-medium">{cie.uploadedBy.name}</span>
                  </p>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>{formatDate(cie.date)}</span>
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
                    <BookOpen className="w-4 h-4 mt-1" />
                    <span className="text-sm">{cie.syllabus}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}