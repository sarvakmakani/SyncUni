"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

export default function PollsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSelections, setUserSelections] = useState({});
  const [isSubmitting, setIsSubmitting] = useState({});

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const fetchPolls = async () => {
    try {
      const response = await axios.get("http://localhost:5000/poll", {
        withCredentials: true,
      });
      const fetchedPolls = response.data.data || [];
      setPolls(fetchedPolls);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError(
        err.response?.data?.message || "Failed to fetch polls. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleSelect = (pollId, optionIndex) => {
    const poll = polls.find((p) => p._id === pollId);
    if (poll && (poll.alreadyVoted || new Date(poll.deadline) < new Date()))
      return;
    setUserSelections((prev) => ({ ...prev, [pollId]: optionIndex }));
  };

  const handleSubmit = async (pollId) => {
    const selectedOptionIndex = userSelections[pollId];
    const poll = polls.find((p) => p._id === pollId);

    if (
      !poll ||
      poll.alreadyVoted ||
      new Date(poll.deadline) < new Date() ||
      selectedOptionIndex === undefined
    )
      return;

    setIsSubmitting((prev) => ({ ...prev, [pollId]: true }));

    try {
      const response = await axios.post(
        `http://localhost:5000/poll/${pollId}`,
        { option: selectedOptionIndex },
        { withCredentials: true }
      );

      const updatedPoll = {
        ...poll,
        totalVotes: response.data.data.totalVotes,
        voteCounts: response.data.data.voteCounts,
        alreadyVoted: true,
      };

      setPolls((prevPolls) =>
        prevPolls.map((p) => (p._id === pollId ? updatedPoll : p))
      );
      toast.success("Vote submitted successfully!");
    } catch (err) {
      console.error("Error submitting vote:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit vote. Please try again."
      );
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [pollId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white">
        <p>Loading polls...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950 text-white flex-col">
        <p className="text-red-400">{error}</p>
        <Button onClick={fetchPolls} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        mode="vault"
      />

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />

        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-white mb-4">Active Polls</h1>
          {polls.length === 0 ? (
            <div className="text-center text-gray-400 text-lg">
              No active polls available at the moment.
            </div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {polls.map((poll) => {
                const totalVotes = poll.totalVotes || 0;
                const hasVoted = poll.alreadyVoted;
                const isExpired = new Date(poll.deadline) < new Date();

                return (
                  <motion.div
                    key={poll._id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-5 bg-slate-800 border border-gray-700 shadow-lg rounded-2xl hover:shadow-2xl transition-all">
                      <CardHeader>
                        <CardTitle className="flex justify-between text-white items-center">
                          <span className="text-lg font-semibold">
                            {poll.name}
                          </span>
                          <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500">
                            Deadline: {new Date(poll.deadline).toLocaleDateString()}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {poll.options.map((option, i) => {
                          const percentage =
                            totalVotes === 0
                              ? 0
                              : Math.round(
                                  ((poll.voteCounts?.[i] || 0) / totalVotes) *
                                    100
                                );
                          const isSelected = userSelections[poll._id] === i;

                          return (
                            <div key={i} className="relative">
                              <label
                                className={`
                                  relative p-3 rounded-lg border flex justify-between items-center transition-all
                                  ${isExpired || hasVoted ? 'cursor-not-allowed' : 'cursor-pointer'}
                                  ${isSelected && !hasVoted && !isExpired
                                    ? 'bg-blue-500/20 border-blue-500'
                                    : 'bg-slate-700 border-gray-600 hover:bg-slate-600'
                                  }
                                `}
                              >
                                {isExpired || hasVoted ? (
                                  <>
                                    {/* Analysis view */}
                                    <div className="absolute inset-0 z-0 rounded-lg overflow-hidden">
                                      <motion.div
                                        className="h-full bg-blue-500/30"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.5 }}
                                      />
                                    </div>
                                    <div className="z-10 flex justify-between items-center w-full">
                                      <span className="font-medium text-white">{option}</span>
                                      <span className="text-sm font-semibold text-white">
                                        {(poll.voteCounts?.[i] || 0)} votes ({percentage}%)
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    {/* Voting view */}
                                    <input
                                      type="radio"
                                      name={`poll-${poll._id}`}
                                      value={i}
                                      checked={isSelected}
                                      onChange={() => handleSelect(poll._id, i)}
                                      className="mr-2"
                                      disabled={hasVoted || isExpired}
                                    />
                                    <span className="font-medium text-gray-200">{option}</span>
                                  </>
                                )}
                              </label>
                            </div>
                          );
                        })}

                        <Button
                          className={`w-full mt-2 ${hasVoted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                          disabled={
                            hasVoted ||
                            isExpired ||
                            userSelections[poll._id] === undefined ||
                            isSubmitting[poll._id]
                          }
                          onClick={() => handleSubmit(poll._id)}
                        >
                          {isSubmitting[poll._id]
                            ? "Submitting..."
                            : hasVoted
                            ? "Voted"
                            : isExpired
                            ? "Poll Expired"
                            : "Submit Vote"}
                        </Button>

                        <div className="text-right text-gray-400 text-sm">
                          Total Votes: {totalVotes}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}