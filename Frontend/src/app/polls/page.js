"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PollsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const [polls, setPolls] = useState([
    {
      id: 1,
      question: "Do you want an offline workshop next week?",
      options: ["Yes", "No", "Maybe", "Not Sure"],
      votes: [5, 2, 1, 0],
      deadline: "2025-08-30",
      status: "Active",
    },
    {
      id: 2,
      question: "Which programming language should be taught next?",
      options: ["Python", "Java", "C++", "JavaScript"],
      votes: [10, 3, 2, 6],
      deadline: "2025-09-05",
      status: "Active",
    },
  ]);

  const [userSelections, setUserSelections] = useState({});
  const [userVotes, setUserVotes] = useState({});

  const handleSelect = (pollId, optionIndex) => {
    if (userVotes[pollId] !== undefined) return;
    setUserSelections((prev) => ({ ...prev, [pollId]: optionIndex }));
  };

  const handleSubmit = (pollId) => {
    if (userVotes[pollId] !== undefined || userSelections[pollId] === undefined)
      return;

    const optionIndex = userSelections[pollId];
    setPolls((prev) =>
      prev.map((poll) =>
        poll.id === pollId
          ? {
              ...poll,
              votes: poll.votes.map((v, i) => (i === optionIndex ? v + 1 : v)),
            }
          : poll
      )
    );

    setUserVotes((prev) => ({ ...prev, [pollId]: optionIndex }));
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} mode="vault" />

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
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
                const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
                const hasVoted = userVotes[poll.id] !== undefined;

                return (
                  <motion.div
                    key={poll.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-5 bg-slate-800 border border-gray-700 shadow-lg rounded-2xl hover:shadow-2xl transition-all">
                      <CardHeader>
                        <CardTitle className="flex justify-between text-white items-center">
                          <span className="text-lg font-semibold">{poll.question}</span>
                          <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500">
                            Deadline: {poll.deadline}
                          </Badge>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {poll.options.map((option, i) => {
                          const percentage =
                            totalVotes === 0
                              ? 0
                              : Math.round((poll.votes[i] / totalVotes) * 100);
                          const isSelected = userSelections[poll.id] === i;

                          return (
                            <motion.div
                              key={i}
                              onClick={() => handleSelect(poll.id, i)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`relative p-3 rounded-lg border cursor-pointer flex justify-between items-center transition-all
                                ${
                                  isSelected && !hasVoted
                                    ? "bg-blue-600 border-blue-400 text-white"
                                    : "bg-slate-700 hover:bg-slate-600 text-gray-200 border-gray-600"
                                }
                                ${hasVoted ? "cursor-not-allowed" : ""}
                              `}
                            >
                              <span className="font-medium">{option}</span>

                              {hasVoted && (
                                <span className="text-sm text-gray-300">
                                  {poll.votes[i]} votes ({percentage}%)
                                </span>
                              )}

                              {hasVoted && (
                                <motion.div
                                  className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-b-lg"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.5 }}
                                />
                              )}
                            </motion.div>
                          );
                        })}

                        <Button
                          className="w-full mt-2"
                          disabled={hasVoted || userSelections[poll.id] === undefined}
                          onClick={() => handleSubmit(poll.id)}
                        >
                          {hasVoted ? "Voted " : "Submit Vote"}
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
