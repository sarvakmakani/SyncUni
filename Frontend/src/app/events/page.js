"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { Calendar, Users, Mic, Clock } from "lucide-react";
import axios from "axios";

export default function EventsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Helper function to format the date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to check if an event has passed
  const isExpired = (dateString) => {
    return new Date(dateString) < new Date();
  };

  // Fetch events from the backend
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('hello');
      
      const response = await axios.get("http://localhost:5000/event",{withCredentials:true});
      console.log(response.data.data);
      
      setEvents(response.data.data); // Assuming the events array is in response.data.data
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events. Please check the server connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white">
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white flex-col">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={fetchEvents} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          mode="vault"
        />
      )}
      <div className="flex-1 flex flex-col overflow-y-auto bg-gray-950">
        <Header toggleSidebar={toggleSidebar} />

        {/* Page Header */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white">University Events</h1>
          <p className="text-gray-400 mt-2">
            Stay updated with the latest talks, sessions, and activities
          </p>
        </div>

        {/* Events Section */}
        {events.length === 0 ? (
          <div className="p-6 text-gray-400">No events found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {events.map((event, index) => {
              const expired = isExpired(event.date);
              return (
                <motion.div
                  key={event._id || index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`bg-gradient-to-tr from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition group ${
                    expired ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-full bg-gray-700">
                      {event.icon === "Mic" && (
                        <Mic className="text-blue-400 w-6 h-6" />
                      )}
                      {event.icon === "Users" && (
                        <Users className="text-green-400 w-6 h-6" />
                      )}
                      {event.icon === "Calendar" && (
                        <Calendar className="text-yellow-400 w-6 h-6" />
                      )}
                      {!event.icon && (
                        <Calendar className="text-gray-400 w-6 h-6" />
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition">
                      {event.name}
                    </h2>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                  <div className="space-y-1 text-gray-300 text-sm">
                    <p className={expired ? "text-red-400" : ""}>
                      <span className="font-medium">📅 Date:</span> {formatDate(event.date)}
                    </p>
                    <p>
                      <span className="font-medium">⏰ Time:</span> {event.time}
                    </p>
                    <p>
                      <span className="font-medium">📍 Venue:</span> {event.venue}
                    </p>
                    {expired && (
                      <p className="text-red-500 font-bold flex items-center mt-2">
                        <Clock className="w-4 h-4 mr-1" /> Event Expired
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}