"use client";
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

const PollCard = ({ poll, handleDelete }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isExpired = new Date(poll.deadline) < new Date();
    const totalVotes = poll.totalVotes || 0;

    return (
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 hover:border-blue-500 transition-all">
            <h3 className="text-xl font-semibold text-white">{poll.name}</h3>
            <div className="text-sm text-gray-400 mb-2">
                <p><strong>Posted on:</strong> {formatDate(poll.updatedAt)}</p>
                <p><strong>Posted by:</strong> {poll.uploadedBy?.name || 'Unknown'}</p>
                <p className={isExpired ? "text-red-400" : ""}>
                    <strong>Deadline:</strong> {formatDate(poll.deadline)}
                </p>
            </div>
            
            <div className="mt-4">
                <h4 className="font-medium text-white mb-2">Options and Votes:</h4>
                <ul className="list-none space-y-2">
                    {poll.options.map((option, index) => {
                        const votes = poll.voteCounts ? (poll.voteCounts[index] || 0) : 0;
                        const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                        
                        return (
                            <li key={index} className="bg-slate-700 rounded-lg p-3 relative overflow-hidden">
                                <div
                                    className="absolute inset-0 h-full bg-blue-500/30"
                                    style={{ width: `${percentage}%` }}
                                />
                                <div className="relative z-10 flex justify-between items-center">
                                    <span className="text-gray-300">{option}</span>
                                    <span className="text-sm font-semibold text-white">
                                        {votes} Votes ({percentage}%)
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <p className="text-sm text-gray-400 mt-4">
                <span className="font-semibold text-white">Total Votes:</span> {totalVotes}
            </p>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={() => handleDelete(poll._id)}
                    className="text-red-400 hover:text-red-600 font-semibold text-sm"
                >
                    Delete Poll
                </button>
            </div>
        </div>
    );
};

export default function FacultyPolls() {
    const [myPolls, setMyPolls] = useState([]);
    const [pastPolls, setPastPolls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Updated form state to include `forWhom`
    const [formData, setFormData] = useState({
        question: "",
        options: ["", ""],
        endDate: "",
        forWhom: "All",
    });

    const batches = ["23DCE", "24DCE", "25DCE", "All"];

    const fetchPolls = async () => {
        try {
            const response = await fetch("http://localhost:5000/admin/poll", {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to fetch polls.");
            }
            const data = await response.json();
            
            setMyPolls(data.data.myPolls);
            setPastPolls(data.data.pastPolls);
        } catch (error) {
            toast.error("Error fetching polls.");
            console.error("Error fetching polls:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPolls();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({ ...prev, options: newOptions }));
    };

    const handleBatchSelect = (batch) => {
        setFormData(prev => ({ ...prev, forWhom: batch }));
    };

    const addOption = () => {
        if (formData.options.length < 4) {
            setFormData(prev => ({ ...prev, options: [...prev.options, ""] }));
        }
    };

    const removeOption = (index) => {
        if (formData.options.length > 2) {
            const newOptions = formData.options.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, options: newOptions }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.question.trim() ||
            formData.options.some(opt => !opt.trim()) ||
            !formData.endDate ||
            !formData.forWhom
        ) {
            toast.error("Please fill all fields, including target audience!");
            return;
        }

        try {
            const optionsAsStrings = formData.options.map(opt => opt);

            const response = await fetch("http://localhost:5000/admin/poll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.question,
                    deadline: formData.endDate,
                    options: optionsAsStrings,
                    for: formData.forWhom, // Correct field name for backend
                }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to create poll.");
            }

            toast.success("Poll created successfully!");
            setFormData({
                question: "",
                options: ["", ""],
                endDate: "",
                forWhom: "All",
            });
            fetchPolls();
        } catch (error) {
            toast.error("Error creating poll. Please try again.");
            console.error("Error creating poll:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/admin/poll/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error("Failed to delete poll.");
            }
            setMyPolls(prevPolls => prevPolls.filter(poll => poll._id !== id));
            setPastPolls(prevPolls => prevPolls.filter(poll => poll._id !== id));
            toast.success("Poll deleted successfully!");
        } catch (error) {
            toast.error("Error deleting poll. Please try again.");
            console.error("Error deleting poll:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <Toaster />
            <div className="max-w-3xl mx-auto">
                <div className="bg-slate-800 p-6 rounded-2xl shadow-xl mb-6">
                    <h1 className="text-3xl font-bold text-[#47c0e8] mb-4 text-center">
                        Create Poll
                    </h1>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Poll Question"
                            className="p-3 rounded-xl bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#47c0e8]"
                            name="question"
                            value={formData.question}
                            onChange={handleFormChange}
                            required
                        />
                        <input
                            type="date"
                            className="p-3 rounded-xl bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#47c0e8]"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleFormChange}
                            required
                        />
                        {formData.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={(e) => handleOptionChange(i, e.target.value)}
                                    className="flex-1 p-3 rounded-xl bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#47c0e8]"
                                    required
                                />
                                {formData.options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(i)}
                                        className="text-red-400 hover:text-red-600"
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        ))}
                        {formData.options.length < 4 && (
                            <button
                                type="button"
                                onClick={addOption}
                                className="bg-[#47c0e8] px-4 py-2 rounded-xl hover:bg-[#36a1c1] text-black font-semibold"
                            >
                                Add Option
                            </button>
                        )}
                        <div className="mt-2">
                            <label className="block text-sm text-gray-300 mb-2">Target Audience</label>
                            <div className="flex flex-wrap gap-3">
                                {batches.map((batch) => (
                                    <button
                                        type="button"
                                        key={batch}
                                        onClick={() => handleBatchSelect(batch)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                                            formData.forWhom === batch
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
                            Post Poll
                        </button>
                    </form>
                </div>

                <div className="mb-10">
                    <h2 className="text-2xl font-semibold text-white mb-4">My Polls</h2>
                    {myPolls.length === 0 ? (
                        <p className="text-gray-400">No polls available.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {myPolls.map((poll) => (
                                <PollCard key={poll._id} poll={poll} handleDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-white mb-4">Previous Polls</h2>
                    {pastPolls.length === 0 ? (
                        <p className="text-gray-400">No previous polls available.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {pastPolls.map((poll) => (
                                <PollCard key={poll._id} poll={poll} handleDelete={handleDelete} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}