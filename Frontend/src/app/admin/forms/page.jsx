"use client";
import React, { useState, useEffect } from "react";
import { Plus, ExternalLink, Trash2 } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const FormsTable = ({ formsList, title, handleDelete }) => (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {formsList.length === 0 ? (
            <p className="text-slate-400">No forms available.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-900">
                            <th className="p-3 text-left min-w-[150px]">Title</th>
                            <th className="p-3 text-left min-w-[100px]">Audience</th>
                            <th className="p-3 text-left min-w-[120px]">Deadline</th>
                            <th className="p-3 text-left min-w-[120px]">Created On</th>
                            <th className="p-3 text-left min-w-[250px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formsList.map((form) => (
                            <tr
                                key={form._id}
                                className="border-b border-slate-700 hover:bg-slate-700/30"
                            >
                                <td className="p-3">{form.name}</td>
                                <td className="p-3">{form.for}</td>
                                <td className="p-3 text-yellow-300">
                                    {new Date(form.deadline).toLocaleDateString()}
                                </td>
                                <td className="p-3 text-sm text-slate-400">
                                    {new Date(form.updatedAt).toLocaleDateString()}
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-3"> {/* Added this div wrapper */}
                                        <a
                                            href={form.googleFormLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-600 flex items-center gap-1"
                                        >
                                            <ExternalLink size={16} /> Open
                                        </a>
                                        {form.responseLink && (
                                            <a
                                                href={form.responseLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-400 hover:text-green-600 flex items-center gap-1"
                                            >
                                                <ExternalLink size={16} /> Responses
                                            </a>
                                        )}
                                        <button
                                            onClick={() => handleDelete(form._id)}
                                            className="text-red-400 hover:text-red-600 flex items-center gap-1"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export default function AdminFormsPage() {
    const [forms, setForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        formLink: "",
        responseLink: "",
        toWhom: "",
        deadline: "",
    });

    const fetchForms = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch("http://localhost:5000/admin/form", {
                credentials: 'include'
            });
            
            if (response.status === 401) {
                window.location.href = "/login";
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to fetch forms.");
            }

            const data = await response.json();
            setForms(data.data.upcomingForms.concat(data.data.pastForms));

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.formLink || !formData.toWhom || !formData.deadline) {
            toast.error("Title, Form Link, Audience, and Deadline are required!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/admin/form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            });
            
            if (response.status === 401) {
                window.location.href = "/login";
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to create form.");
            }

            const newForm = await response.json();
            
            setForms(prevForms => [...prevForms, newForm.data]);
            
            toast.success("Form created successfully!");

            setFormData({
                title: "",
                description: "",
                formLink: "",
                responseLink: "",
                toWhom: "",
                deadline: "",
            });
        } catch (err) {
            toast.error("Error creating form. Please try again.");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/form/${id}`, {
                method: "DELETE",
                credentials: 'include'
            });

            if (response.status === 401) {
                window.location.href = "/login";
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to delete form.");
            }

            setForms(forms.filter((form) => form._id !== id));
            toast.success("Form deleted successfully!");

        } catch (err) {
            toast.error("Error deleting form. Please try again.");
            console.error(err);
        }
    };

    const today = new Date().setHours(0, 0, 0, 0);
    const upcomingForms = forms.filter(
        (form) => new Date(form.deadline).setHours(0, 0, 0, 0) >= today
    );
    const previousForms = forms.filter(
        (form) => new Date(form.deadline).setHours(0, 0, 0, 0) < today
    );

    if (isLoading) {
        return <div className="p-6 text-center text-white">Loading forms...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-400">Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <Toaster />
            <div className="bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
                <h2 className="text-xl font-bold mb-4">Add New Google Form</h2>
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
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
                    <div className="md:col-span-2">
                        <label className="block text-sm mb-1">
                            Google Form Link *
                        </label>
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
            <FormsTable formsList={upcomingForms} title="Upcoming Forms" handleDelete={handleDelete} />
            <FormsTable formsList={previousForms} title="Previous Forms" handleDelete={handleDelete} />
        </div>
    );
} 