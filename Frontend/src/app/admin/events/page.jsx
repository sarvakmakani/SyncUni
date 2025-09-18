"use client";
import React, { useState } from "react";
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminEventsPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    batches: [],
  });

  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);

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

  // Create or Update event
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.time || !formData.venue) {
      alert("Please fill all required fields!");
      return;
    }

    if (editingEventId) {
      // Update existing event
      setEvents(
        events.map((event) =>
          event.id === editingEventId ? { ...formData, id: editingEventId } : event
        )
      );
      setEditingEventId(null);
    } else {
      // Create new event
      setEvents([{ ...formData, id: Date.now() }, ...events]);
    }

    // Reset form
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      batches: [],
    });
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditingEventId(event.id);
  };

  const handleDelete = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  // Split events into Upcoming and Previous based on date
  const today = new Date().setHours(0, 0, 0, 0);
  const upcomingEvents = events.filter(
    (event) => new Date(event.date).setHours(0, 0, 0, 0) >= today
  );
  const previousEvents = events.filter(
    (event) => new Date(event.date).setHours(0, 0, 0, 0) < today
  );

  const EventCard = ({ event }) => (
    <motion.div
      key={event.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-900 p-5 rounded-xl shadow-lg border border-slate-700 relative"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold">{event.title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(event)}
            className="p-1 text-gray-400 hover:text-blue-400"
            title="Edit Event"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(event.id)}
            className="p-1 text-gray-400 hover:text-red-400"
            title="Delete Event"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className="text-gray-400 text-sm mt-1">{event.description}</p>
      <div className="mt-4 space-y-2 text-sm text-gray-300">
        <p className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" /> {event.date}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-400" /> {event.time}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-pink-400" /> {event.venue}
        </p>
        {event.batches.length > 0 && (
          <p className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-400" /> {event.batches.join(", ")}
          </p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="p-8 space-y-10 bg-slate-950 text-white min-h-screen">
      <h1 className="text-3xl font-bold">Manage Events</h1>

      {/* Event Creation / Update Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 p-6 rounded-xl shadow-lg max-w-3xl mx-auto border border-slate-700"
      >
        <h2 className="text-xl font-semibold mb-6">
          {editingEventId ? "Update Event" : "Create a New Event"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="w-full rounded-lg border border-gray-700 px-3 py-2 bg-slate-800 text-white focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-700 px-3 py-2 bg-slate-800 text-white focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-700 px-3 py-2 bg-slate-800 text-white focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            required
          />
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            placeholder="Venue"
            className="w-full rounded-lg border border-gray-700 px-3 py-2 bg-slate-800 text-white focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            required
          />
        </div>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Event Description"
          rows="3"
          className="mt-4 w-full rounded-lg border border-gray-700 px-3 py-2 bg-slate-800 text-white focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
        />

        {/* Batch Selection */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-2">Target Batches</p>
          <div className="flex flex-wrap gap-3">
            {batches.map((batch) => (
              <button
                type="button"
                key={batch}
                onClick={() => handleBatchSelect(batch)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                  formData.batches.includes(batch)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-800 text-gray-300 border-gray-700 hover:bg-slate-700"
                }`}
              >
                {batch}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition"
        >
          {editingEventId ? "Update Event" : "Create Event"}
        </button>
      </motion.form>

      {/* Upcoming Events */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-400">No upcoming events.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {/* Previous Events */}
      <div>
        <h2 className="text-2xl font-semibold mt-10 mb-4">Previous Events</h2>
        {previousEvents.length === 0 ? (
          <p className="text-gray-400">No previous events.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
