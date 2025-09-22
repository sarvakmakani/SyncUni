"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

export default function CIEPage() {
  const [formData, setFormData] = useState({
    subjectName: "",
    date: "",
    time: "",
    syllabus: "",
    venue: "",
    for: "All",
  });

  const [upcomingAnnouncements, setUpcomingAnnouncements] = useState([]);
  const [previousAnnouncements, setPreviousAnnouncements] = useState([]);
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const batches = ["23DCE", "24DCE", "25DCE", "All"];

  // Helper function to fetch announcements from the backend
  const fetchAnnouncements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/admin/cie", {
        withCredentials: true,
      });
      const { upcomingCies, pastCies } = response.data.data;
      console.log(response.data.data)
      
      setUpcomingAnnouncements(upcomingCies);
      setPreviousAnnouncements(pastCies);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Failed to fetch announcements. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBatchSelect = (batch) => {
    setFormData((prev) => ({
      ...prev,
      for: batch,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.subjectName ||
      !formData.date ||
      !formData.time ||
      !formData.syllabus ||
      !formData.venue ||
      !formData.for
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      if (editingAnnouncementId) {
        // Update existing announcement
        const response = await axios.patch(
          `http://localhost:5000/admin/cie/${editingAnnouncementId}`,
          formData,
          { withCredentials: true }
        );
        
        // After a successful update, re-fetch to ensure data integrity
        await fetchAnnouncements(); 
        toast.success("cie updated successfully!");
        setEditingAnnouncementId(null);
      } else {
        // Add new announcement
        await axios.post(
          "http://localhost:5000/admin/cie",
          formData,
          { withCredentials: true }
        );
        
        // After a successful create, re-fetch the data
        await fetchAnnouncements();
        toast.success("cie posted successfully!");
      }

      // Reset form
      setFormData({
        subjectName: "",
        date: "",
        time: "",
        syllabus: "",
        venue: "",
        for: "All",
      });
    } catch (err) {
      console.error("Error saving announcement:", err);
      toast.error(err.response?.data?.message || "Failed to save announcement.");
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      subjectName: announcement.subjectName,
      date: new Date(announcement.date).toISOString().split("T")[0],
      time: announcement.time,
      syllabus: announcement.syllabus,
      venue: announcement.venue,
      for: announcement.for,
    });
    setEditingAnnouncementId(announcement._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/cie/${id}`, {
        withCredentials: true,
      });

      // After deleting, re-fetch announcements to get the latest list
      await fetchAnnouncements();
      toast.success("Announcement deleted successfully!");
    } catch (err) {
      console.error("Error deleting announcement:", err);
      toast.error("Failed to delete announcement. Please try again.");
    }
  };

  // Card component for rendering each announcement
  const AnnouncementCard = ({ item }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-xl shadow-lg p-5 hover:border-blue-500 transition relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">
          {item.subjectName}
        </h3>
      </div>
      <p className="text-sm text-gray-400">
        Date: {new Date(item.date).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
        <Clock className="w-4 h-4 text-yellow-400" />
        Time: {item.time}
      </p>
      <p className="text-gray-300 mt-3 text-sm leading-relaxed">
        {item.syllabus?.length > 100
          ? item.syllabus.slice(0, 100) + "..."
          : item.syllabus}
      </p>
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
        <MapPin className="w-4 h-4 text-blue-400" />
        {item.venue}
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
        <Users className="w-4 h-4 text-blue-400" />
        Batches: {item.for}
      </div>
      <p className="mt-4 text-xs text-gray-500">
        Posted by {item.uploadedBy?.name || "Unknown"} •{" "}
        {console.log(item.date)
        }
        {new Date(item.date).toLocaleString()}
      </p>
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => handleEdit(item)}
          className="bg-blue-600 text-white px-2 py-1 text-xs rounded-lg flex items-center gap-1 hover:bg-blue-700 transition"
        >
          <Edit className="w-3 h-3" /> Update
        </button>
        <button
          onClick={() => handleDelete(item._id)}
          className="bg-red-600 text-white px-2 py-1 text-xs rounded-lg flex items-center gap-1 hover:bg-red-700 transition"
        >
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white">
        <p>Loading announcements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10 bg-slate-950 text-white min-h-screen">
      <Toaster />
      <div className="bg-gradient-to-r from-[#47c0e8] via-[#3b82f6] to-[#6366f1] rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">CIE Announcements</h1>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-slate-900/90 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-3xl mx-auto border border-slate-700"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-6 text-white">
          {editingAnnouncementId ? "Update Announcement" : "Post a New CIE Announcement"}
        </h2>
        
        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative w-full">
            <label htmlFor="subjectName" className="absolute left-3 -top-2.5 bg-slate-900/90 px-1 text-xs text-gray-300">
              Subject Name
            </label>
            <input
              type="text"
              id="subjectName"
              name="subjectName"
              value={formData.subjectName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-600 bg-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none transition"
              required
            />
          </div>
          <div className="relative w-full">
            <label htmlFor="date" className="absolute left-3 -top-2.5 bg-slate-900/90 px-1 text-xs text-gray-300">
              Date of CIE
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-600 bg-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none transition"
              required
            />
          </div>
        </div>
        <div className="relative mt-6">
          <label htmlFor="time" className="absolute left-3 -top-2.5 bg-slate-900/90 px-1 text-xs text-gray-300">
            Time of CIE
          </label>
          <input
            type="text"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-600 bg-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none transition"
            required
          />
        </div>
        <div className="relative mt-6">
          <label htmlFor="syllabus" className="absolute left-3 -top-2.5 bg-slate-900/90 px-1 text-xs text-gray-300">
            Syllabus
          </label>
          <textarea
            id="syllabus"
            name="syllabus"
            value={formData.syllabus}
            onChange={handleChange}
            rows="3"
            className="w-full rounded-lg border border-gray-600 bg-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none transition"
            required
          />
        </div>
        <div className="relative mt-6">
          <label htmlFor="venue" className="absolute left-3 -top-2.5 bg-slate-900/90 px-1 text-xs text-gray-300">
            Venue
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-600 bg-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none transition"
            required
          />
        </div>

        {/* Batch Selection */}
        <div className="mt-6">
          <label className="block font-medium text-gray-300 mb-2">
            Select Batches
          </label>
          <div className="flex flex-wrap gap-3">
            {batches.map((batch) => (
              <motion.button
                type="button"
                key={batch}
                onClick={() => handleBatchSelect(batch)}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition shadow-sm border ${
                  formData.for === batch
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-800 text-gray-300 border-gray-600 hover:bg-slate-700"
                }`}
              >
                {batch}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition shadow-lg"
        >
          {editingAnnouncementId ? "Update Announcement" : "Post Announcement"}
        </motion.button>
      </motion.form>

      {/* Upcoming Announcements */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-white">
          Upcoming Announcements
        </h2>
        {upcomingAnnouncements.length === 0 ? (
          <p className="text-gray-400">No upcoming announcements.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingAnnouncements.map((item) => (
              <AnnouncementCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Previous Announcements */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-white">
          Previous Announcements
        </h2>
        {previousAnnouncements.length === 0 ? (
          <p className="text-gray-400">No previous announcements.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousAnnouncements.map((item) => (
              <AnnouncementCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}