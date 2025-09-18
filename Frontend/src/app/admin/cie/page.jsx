"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from "lucide-react";

export default function CIEPage() {
  const [formData, setFormData] = useState({
    subject: "",
    date: "",
    time: "",
    syllabus: "",
    location: "",
    batches: [],
  });

  const [announcements, setAnnouncements] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const batches = ["23DCE", "24DCE", "25DCE"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBatchSelect = (batch) => {
    setFormData((prev) => ({
      ...prev,
      batches: prev.batches.includes(batch)
        ? prev.batches.filter((b) => b !== batch)
        : [...prev.batches, batch],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.subject ||
      !formData.date ||
      !formData.time ||
      !formData.syllabus ||
      !formData.location ||
      formData.batches.length === 0
    ) {
      alert("Please fill all fields and select at least one batch.");
      return;
    }

    if (editingIndex !== null) {
      // Update existing announcement
      const updatedAnnouncements = [...announcements];
      updatedAnnouncements[editingIndex] = {
        ...formData,
        professor: "Prof. Sharma",
        createdAt: new Date().toISOString(),
      };
      setAnnouncements(updatedAnnouncements);
      setEditingIndex(null);
    } else {
      // Add new announcement
      const newAnnouncement = {
        ...formData,
        professor: "Prof. Sharma",
        createdAt: new Date().toISOString(),
      };

      setAnnouncements([newAnnouncement, ...announcements]);
    }

    // Reset form
    setFormData({
      subject: "",
      date: "",
      time: "",
      syllabus: "",
      location: "",
      batches: [],
    });
  };

  const handleEdit = (index) => {
    const announcementToEdit = announcements[index];
    setFormData({
      subject: announcementToEdit.subject,
      date: announcementToEdit.date,
      time: announcementToEdit.time,
      syllabus: announcementToEdit.syllabus,
      location: announcementToEdit.location,
      batches: announcementToEdit.batches,
    });
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      const updatedAnnouncements = announcements.filter((_, i) => i !== index);
      setAnnouncements(updatedAnnouncements);
    }
  };

  // Separate Upcoming and Previous announcements
  const today = new Date().setHours(0, 0, 0, 0);
  const upcomingAnnouncements = announcements.filter(
    (item) => new Date(item.date).setHours(0, 0, 0, 0) >= today
  );
  const previousAnnouncements = announcements.filter(
    (item) => new Date(item.date).setHours(0, 0, 0, 0) < today
  );

  return (
    <div className="p-8 space-y-10 bg-slate-950 text-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#47c0e8] via-[#3b82f6] to-[#6366f1] rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">CIE Announcements</h1>
      </div>

      {/* Form Section */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-slate-900/90 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-3xl mx-auto border border-slate-700"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-6 text-white">
          {editingIndex !== null ? "Update Announcement" : "Post a New CIE Announcement"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject */}
          <div className="relative w-full">
            <label
              htmlFor="subject"
              className="absolute left-3 -top-2.5 bg-slate-900/90 px-1 text-xs text-gray-300"
            >
              Subject Name
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-600 bg-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none transition"
              required
            />
          </div>

          {/* Date */}
          <div className="relative w-full">
            <label
              htmlFor="cie-date"
              className="absolute left-3 -top-2.5 bg-slate-900/90 px-1 text-xs text-gray-300"
            >
              Date of CIE
            </label>
            <input
              type="date"
              id="cie-date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-600 bg-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none transition"
              required
            />
          </div>
        </div>

        {/* Time Field */}
        <div className="relative mt-6">
          <label
            htmlFor="cie-time"
            className="absolute left-3 -top-2.5 bg-slate-900/90 px-1 text-xs text-gray-300"
          >
            Time of CIE
          </label>
          <input
            type="time"
            id="cie-time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-600 bg-slate-800 px-3 py-2 text-white focus:border-blue-500 focus:ring focus:ring-blue-300 outline-none transition"
            required
          />
        </div>

        {/* Syllabus */}
        <div className="relative mt-6">
          <label
            htmlFor="syllabus"
            className="absolute left-3 -top-2.5 bg-slate-900/90 px-1 text-xs text-gray-300"
          >
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

        {/* Location */}
        <div className="relative mt-6">
          <label
            htmlFor="location"
            className="absolute left-3 -top-2.5 bg-slate-900/90 px-1 text-xs text-gray-300"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
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
                  formData.batches.includes(batch)
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
          {editingIndex !== null ? "Update Announcement" : "Post Announcement"}
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
            {upcomingAnnouncements.map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-xl shadow-lg p-5 hover:border-blue-500 transition relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {item.subject}
                  </h3>
                  {/* <Calendar className="w-5 h-5 text-blue-400" /> */}
                </div>

                <p className="text-sm text-gray-400">
                  Date: {new Date(item.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  Time: {item.time}
                </p>

                <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                  {item.syllabus.length > 100
                    ? item.syllabus.slice(0, 100) + "..."
                    : item.syllabus}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {item.location}
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4 text-blue-400" />
                  Batches: {item.batches.join(", ")}
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Posted by {item.professor} •{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {/* Update Button */}
                  <button
                    onClick={() => handleEdit(announcements.indexOf(item))}
                    className="bg-blue-600 text-white px-2 py-1 text-xs rounded-lg flex items-center gap-1 hover:bg-blue-700 transition"
                  >
                    <Edit className="w-3 h-3" /> Update
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(announcements.indexOf(item))}
                    className="bg-red-600 text-white px-2 py-1 text-xs rounded-lg flex items-center gap-1 hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </motion.div>
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
            {previousAnnouncements.map((item, idx) => (
              <motion.div
                key={idx}
                className="bg-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-xl shadow-lg p-5 hover:border-blue-500 transition relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    {item.subject}
                  </h3>
                  <Calendar className="w-5 h-5 text-blue-400" />
                </div>

                <p className="text-sm text-gray-400">
                  Date: {new Date(item.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  Time: {item.time}
                </p>

                <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                  {item.syllabus.length > 100
                    ? item.syllabus.slice(0, 100) + "..."
                    : item.syllabus}
                </p>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  {item.location}
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                  <Users className="w-4 h-4 text-blue-400" />
                  Batches: {item.batches.join(", ")}
                </div>

                <p className="mt-4 text-xs text-gray-500">
                  Posted by {item.professor} •{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
