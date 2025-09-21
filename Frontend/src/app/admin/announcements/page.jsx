"use client";
import React, { useState } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

export default function AnnouncementsPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    for: "All",
  });
  const [isLoading, setIsLoading] = useState(false);

  const batches = ["23DCE", "24DCE", "25DCE", "All"];

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
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and description cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/admin/notification",
        formData,
        { withCredentials: true }
      );
      console.log(response);
      
      if (response.status === 201) {
        toast.success("Announcement posted successfully!");
        setFormData({ title: "", description: "", for: "All" }); // Reset form
      } else {
        throw new Error(response.data.message || "Failed to post announcement.");
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
      toast.error(error.response?.data?.message || "Failed to post announcement. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <Toaster />
      <div className="bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-[#47c0e8] mb-6 text-center">
          Post Announcement
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Announcement Title"
            className="w-full p-4 rounded-xl bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#47c0e8]"
            disabled={isLoading}
            maxLength={100}
            required
          />

          <div className="relative">
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write the announcement details here..."
              rows={5}
              className="w-full p-4 rounded-xl bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#47c0e8] resize-none"
              disabled={isLoading}
              maxLength={500}
              required
            />
            <span className="absolute bottom-4 right-4 text-gray-400 text-sm">
              {formData.description.length}/500
            </span>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-300 mb-2">Target Audience</p>
            <div className="flex flex-wrap gap-3">
              {batches.map((batch) => (
                <button
                  type="button"
                  key={batch}
                  onClick={() => handleBatchSelect(batch)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                    formData.for === batch
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-slate-800 text-gray-300 border-gray-700 hover:bg-slate-700"
                  }`}
                  disabled={isLoading}
                >
                  {batch}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-[#47c0e8] hover:bg-[#36a1c1] transition text-black font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
          >
            {isLoading ? "Posting..." : (
              <>
                <Send className="w-5 h-5" />
                Post Announcement
              </>
            )}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          This announcement will be visible to all students in their portal.
        </p>
      </div>
    </div>
  );
}