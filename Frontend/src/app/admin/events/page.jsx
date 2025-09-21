"use client";
import React, { useState, useEffect, memo } from "react";
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

// Memoized EventCard component to prevent unnecessary re-renders
const EventCard = memo(({ event, handleEdit, handleDelete }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-slate-900 p-5 rounded-xl shadow-lg border border-slate-700 relative"
  >
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-bold">{event.name}</h3>
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(event)}
          className="p-1 text-gray-400 hover:text-blue-400"
          title="Edit Event"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => handleDelete(event._id)}
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
        <Calendar className="w-4 h-4 text-blue-400" />{" "}
        {new Date(event.date).toLocaleDateString()}
      </p>
      <p className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-red-400" /> {event.time}
      </p>
      <p className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-pink-400" /> {event.venue}
      </p>
      <p className="flex items-center gap-2">
        <Users className="w-4 h-4 text-green-400" /> {event.for}
      </p>
    </div>
  </motion.div>
));

export default function AdminEventsPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    for: "All",
  });

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const batches = ["23DCE", "24DCE", "25DCE", "All"];

  // Fetch events from the backend on component mount
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/admin/event", {
        withCredentials: true,
      });

      // Correctly handle the nested data structure from the backend
      const { pastEvents, upcomingEvents } = response.data.data;
      setUpcomingEvents(upcomingEvents);
      setPreviousEvents(pastEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
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

    if (!formData.name || !formData.date || !formData.time || !formData.venue) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      if (editingEventId) {
        // Send the update request
        const response = await axios.patch(
          `http://localhost:5000/admin/event/${editingEventId}`,
          formData,
          { withCredentials: true }
        );

        const updatedEvent = response.data.data;

        // Update the state with the new data to trigger an instant re-render
        setUpcomingEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === updatedEvent._id ? updatedEvent : event
          )
        );
        setPreviousEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === updatedEvent._id ? updatedEvent : event
          )
        );

        toast.success("Event updated successfully!");
        setEditingEventId(null);
      } else {
        // Create new event
        await axios.post(
          "http://localhost:5000/admin/event",
          formData,
          { withCredentials: true }
        );
        // Refetch all events to get the latest data
        fetchEvents();
        toast.success("Event created successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        for: "All",
      });
    } catch (err) {
      console.error("Error saving event:", err);
      toast.error("Failed to save event. Please try again.");
    }
  };

  const handleEdit = (event) => {
    setFormData({
      name: event.name,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0],
      time: event.time,
      venue: event.venue,
      for: event.for,
    });
    setEditingEventId(event._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/event/${id}`, {
        withCredentials: true,
      });
      // After deleting, refetch all events
      fetchEvents();
      toast.success("Event deleted successfully!");
    } catch (err) {
      console.error("Error deleting event:", err);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white">
        <p>Loading events...</p>
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
      <h1 className="text-3xl font-bold">Manage Events</h1>

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
            name="name"
            value={formData.name}
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
            type="text"
            name="time"
            value={formData.time}
            onChange={handleChange}
            placeholder="Time (e.g., 2:00 PM - 4:00 PM)"
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

        <div className="mt-6">
          <p className="text-sm font-medium mb-2">Target Batches</p>
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

      <div>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-400">No upcoming events.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} handleEdit={handleEdit} handleDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mt-10 mb-4">Previous Events</h2>
        {previousEvents.length === 0 ? (
          <p className="text-gray-400">No previous events.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousEvents.map((event) => (
              <EventCard key={event._id} event={event} handleEdit={handleEdit} handleDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}