"use client";
import React, { useState } from "react";
import PollOption from "@/components/PollOption";
import PollCard from "@/components/PollCard";

export default function FacultyPolls() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [polls, setPolls] = useState([]);
  const [faculty] = useState("Prof. John Doe");
  const [endDate, setEndDate] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim() || options.some((opt) => !opt.trim()) || !endDate) {
      alert("Please fill all fields, including poll end date!");
      return;
    }

    const newPoll = {
      id: Date.now(),
      question,
      options: options.map((text) => ({ text, votes: 0 })),
      createdBy: faculty,
      createdAt: new Date().toISOString(),
      endDate, // store poll expiry date
    };

    setPolls([newPoll, ...polls]);
    setQuestion("");
    setOptions(["", ""]);
    setEndDate("");
  };

  // Separate Upcoming and Previous Polls
  const today = new Date().setHours(0, 0, 0, 0);
  const upcomingPolls = polls.filter(
    (poll) => new Date(poll.endDate).setHours(0, 0, 0, 0) >= today
  );
  const previousPolls = polls.filter(
    (poll) => new Date(poll.endDate).setHours(0, 0, 0, 0) < today
  );

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Poll Creation Form */}
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl mb-6">
          <h1 className="text-3xl font-bold text-[#47c0e8] mb-4 text-center">
            Create Poll
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Poll Question */}
            <input
              type="text"
              placeholder="Poll Question"
              className="p-3 rounded-xl bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#47c0e8]"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />

            {/* Poll End Date */}
            <input
              type="date"
              className="p-3 rounded-xl bg-slate-700 text-gray-200 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#47c0e8]"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />

            {/* Poll Options */}
            {options.map((opt, i) => (
              <PollOption
                key={i}
                value={opt}
                onChange={(val) => handleOptionChange(i, val)}
                onRemove={() => removeOption(i)}
                showRemove={options.length > 2}
              />
            ))}

            {/* Add Option Button */}
            {options.length < 4 && (
              <button
                type="button"
                onClick={addOption}
                className="bg-[#47c0e8] px-4 py-2 rounded-xl hover:bg-[#36a1c1] text-black font-semibold"
              >
                Add Option
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition"
            >
              Post Poll
            </button>
          </form>
        </div>

        {/* Upcoming Polls */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-4">
            My Polls
          </h2>
          {upcomingPolls.length === 0 ? (
            <p className="text-gray-400">No upcoming polls available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          )}
        </div>

        {/* Previous Polls */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            All Polls
          </h2>
          {previousPolls.length === 0 ? (
            <p className="text-gray-400">No previous polls available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {previousPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
