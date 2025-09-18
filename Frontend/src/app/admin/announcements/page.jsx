"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";

export default function AnnouncementsPage() {
  const [announcement, setAnnouncement] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!announcement.trim()) return;

    // TODO: Send announcement to backend
    console.log("Announcement submitted:", announcement);
    setAnnouncement(""); // Clear input after posting
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-[#47c0e8] mb-6 text-center">
          Post Announcement
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <textarea
              className="w-full p-4 rounded-xl bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#47c0e8] resize-none"
              placeholder="Write your announcement here..."
              rows={5}
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
            />
            <span className="absolute top-2 right-3 text-gray-400 text-sm">
              {announcement.length}/500
            </span>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#47c0e8] hover:bg-[#36a1c1] transition text-black font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
          >
            <Send className="w-5 h-5" />
            Post Announcement
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          This announcement will be visible to all students in their portal.
        </p>
      </div>
    </div>
  );
}
