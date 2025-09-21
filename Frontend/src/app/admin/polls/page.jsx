"use client"
import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

// Assuming PollOption and PollCard are correctly implemented elsewhere.
// Since they were not provided, a placeholder is used for PollCard's functionality.
// If you have your own components, replace this placeholder logic with your components.
const PollCard = ({ poll, handleDelete }) => {
    // A helper function to format dates
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isExpired = new Date(poll.deadline) < new Date();

    return (
        <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 hover:border-blue-500 transition-all">
            {/* Poll title and details */}
            <h3 className="text-xl font-semibold text-white">{poll.name}</h3>
            <div className="text-sm text-gray-400 mb-2">
                <p><strong>Posted on:</strong> {formatDate(poll.updatedAt)}</p>
                {/* Assuming 'uploadedBy' or similar is the property for the author */}
                <p><strong>Posted by:</strong> {poll.uploadedBy?.name || 'Unknown'}</p> 
                <p className={isExpired ? "text-red-400" : ""}>
                    <strong>Deadline:</strong> {formatDate(poll.deadline)}
                </p>
          </div>
            
            {/* Displaying options and their votes */}
            <div className="mt-4">
                <h4 className="font-medium text-white mb-2">Options and Votes:</h4>
                <ul className="list-none space-y-2">
                    {poll.options.map((option, index) => (
                        <li key={index} className="bg-slate-700 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">{option.text}</span>
                                {/* Accessing option-wise votes. Your backend needs to provide this. */}
                                <span className="text-sm font-semibold text-[#47c0e8]">
                                    {option.votes} Votes
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Total votes */}
            <p className="text-sm text-gray-400 mt-4">
                <span className="font-semibold text-white">Total Votes:</span> {poll.totalVotes || 0}
            </p>

            {/* Delete button */}
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
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [endDate, setEndDate] = useState("");
    const [forWhom, setForWhom] = useState("All");

    // Fetch poll data from the backend on component mount
    useEffect(() => {
        const fetchPolls = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("http://localhost:5000/admin/poll", {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch polls.");
                }
                const data = await response.json();

                // Set states based on the backend response structure
                
                setMyPolls(data.data.myPolls);
                setPastPolls(data.data.pastPolls);
            } catch (error) {
                toast.error("Error fetching polls.");
                console.error("Error fetching polls:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPolls();
    }, []);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 4) setOptions([...options, ""]);
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !question.trim() ||
            options.some((opt) => !opt.trim()) ||
            !endDate
        ) {
            toast.error("Please fill all fields, including poll end date!");
            return;
        }

        try {
            // Correctly map the array of option strings to the backend format
            const optionsAsStrings = options.map(opt => opt);

            const response = await fetch("http://localhost:5000/admin/poll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: question,
                    deadline: endDate,
                    options: optionsAsStrings, // Changed to send array of strings
                    for: forWhom,
                }),
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to create poll.");
            }

            const newPoll = await response.json();
            
            // Add the new poll to the myPolls state
            setMyPolls((prevPolls) => [newPoll.data, ...prevPolls]);
            
            toast.success("Poll created successfully!");

            // Reset form
            setQuestion("");
            setOptions(["", ""]);
            setEndDate("");
            setForWhom("All");

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

            setMyPolls((prevPolls) => prevPolls.filter((poll) => poll._id !== id));
            setPastPolls((prevPolls) => prevPolls.filter((poll) => poll._id !== id));
            
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
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                        />

                        <input
                            type="date"
                            className="p-3 rounded-xl bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#47c0e8]"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                        
                        {/* Poll Options */}
                        {options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={`Option ${i + 1}`}
                                    value={opt}
                                    onChange={(e) => handleOptionChange(i, e.target.value)}
                                    className="flex-1 p-3 rounded-xl bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#47c0e8]"
                                    required
                                />
                                {options.length > 2 && (
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

                        {options.length < 4 && (
                            <button
                                type="button"
                                onClick={addOption}
                                className="bg-[#47c0e8] px-4 py-2 rounded-xl hover:bg-[#36a1c1] text-black font-semibold"
                            >
                                Add Option
                            </button>
                        )}
                        
                        <button
                            type="submit"
                            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition"
                        >
                            Post Poll
                        </button>
                    </form>
                </div>

                {isLoading ? (
                    <div className="text-center text-white">Loading polls...</div>
                ) : (
                    <>
                        <div className="mb-10">
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                My Polls
                            </h2>
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
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Previous Polls
                            </h2>
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
                    </>
                )}
            </div>
        </div>
    );
}