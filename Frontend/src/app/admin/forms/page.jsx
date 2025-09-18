"use client";
import React, { useState } from "react";
import { Plus, ExternalLink, Trash2 } from "lucide-react";

export default function AdminFormsPage() {
  const [forms, setForms] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    formLink: "",
    responseLink: "",
    toWhom: "",
    deadline: "",
    createdBy: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Format date to show only YYYY-MM-DD
  const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.formLink ||
      !formData.toWhom ||
      !formData.deadline ||
      !formData.createdBy
    ) {
      alert("Title, Form Link, Audience, Deadline, and Created By are required!");
      return;
    }

    const newForm = {
      id: Date.now(),
      ...formData,
      createdAt: formatDate(new Date()),
    };

    setForms([...forms, newForm]);

    // Reset form
    setFormData({
      title: "",
      description: "",
      formLink: "",
      responseLink: "",
      toWhom: "",
      deadline: "",
      createdBy: "",
    });
  };

  // Delete form
  const handleDelete = (id) => {
    setForms(forms.filter((form) => form.id !== id));
  };

  // Split forms into upcoming and previous
  const today = new Date().setHours(0, 0, 0, 0);

  const upcomingForms = forms.filter(
    (form) => new Date(form.deadline).setHours(0, 0, 0, 0) >= today
  );

  const previousForms = forms.filter(
    (form) => new Date(form.deadline).setHours(0, 0, 0, 0) < today
  );

  // Reusable Table Component
  const FormsTable = ({ formsList, title }) => (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {formsList.length === 0 ? (
        <p className="text-slate-400">No forms available.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-900">
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Audience</th>
              <th className="p-3 text-left">Deadline</th>
              <th className="p-3 text-left">Created By</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {formsList.map((form) => (
              <tr
                key={form.id}
                className="border-b border-slate-700 hover:bg-slate-700/30"
              >
                <td className="p-3">{form.title}</td>
                <td className="p-3">{form.toWhom}</td>
                <td className="p-3 text-yellow-300">{formatDate(form.deadline)}</td>
                <td className="p-3">{form.createdBy}</td>
                <td className="p-3 text-sm text-slate-400">{form.createdAt}</td>
                <td className="p-3 flex gap-3">
                  <a
                    href={form.formLink}
                    target="_blank"
                    className="text-blue-400 hover:text-blue-600 flex items-center gap-1"
                  >
                    <ExternalLink size={16} /> Open Form
                  </a>
                  {form.responseLink && (
                    <a
                      href={form.responseLink}
                      target="_blank"
                      className="text-green-400 hover:text-green-600 flex items-center gap-1"
                    >
                      <ExternalLink size={16} /> Responses
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="text-red-400 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* Add Form Section */}
      <div className="bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Google Form</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Title */}
          <div>
            <label className="block text-sm mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter form title"
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              required
            />
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm mb-1">To Whom *</label>
            <select
              name="toWhom"
              value={formData.toWhom}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              required
            >
              <option value="">Select Audience</option>
              <option value="23DCE">23DCE</option>
              <option value="24DCE">24DCE</option>
              <option value="25DCE">25DCE</option>
              <option value="All">All</option>
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm mb-1">Deadline *</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              required
            />
          </div>

          {/* Created By */}
          <div>
            <label className="block text-sm mb-1">Created By *</label>
            <input
              type="text"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              placeholder="Faculty Name"
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              required
            />
          </div>

          {/* Google Form Link */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Google Form Link *</label>
            <input
              type="url"
              name="formLink"
              value={formData.formLink}
              onChange={handleChange}
              placeholder="Paste Google Form URL"
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
              required
            />
          </div>

          {/* Response Link */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Response Link</label>
            <input
              type="url"
              name="responseLink"
              value={formData.responseLink}
              onChange={handleChange}
              placeholder="Paste response sheet link (optional)"
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional description about the form"
              className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
            >
              <Plus size={18} /> Add Form
            </button>
          </div>
        </form>
      </div>

      {/* Upcoming Forms */}
      <FormsTable formsList={upcomingForms} title="Upcoming Forms" />

      {/* Previous Forms */}
      <FormsTable formsList={previousForms} title="Previous Forms" />
    </div>
  );
}
