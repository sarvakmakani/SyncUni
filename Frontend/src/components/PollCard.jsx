// components/PollCard.jsx
"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#47c0e8", "#36a1c1", "#1e90ff", "#00bfff"]; // up to 4 options

export default function PollCard({ poll }) {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-md hover:shadow-xl transition">
      <h2 className="text-xl font-bold text-[#47c0e8] mb-2">{poll.question}</h2>
      <p className="text-gray-400 text-sm mb-2">
        Created by: {poll.createdBy} | Posted on: {new Date(poll.createdAt).toLocaleDateString()}
      </p>

      <ul className="mb-4">
        {poll.options.map((opt, i) => (
          <li key={i} className="text-gray-300">
            • {opt.text} ({opt.votes} votes)
          </li>
        ))}
      </ul>

      <button
        onClick={() => setShowAnalytics(!showAnalytics)}
        className="bg-[#47c0e8] hover:bg-[#36a1c1] text-black px-4 py-2 rounded-xl font-semibold"
      >
        {showAnalytics ? "Hide Analytics" : "View Analytics"}
      </button>

      {showAnalytics && (
        <div className="mt-4 w-full h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={poll.options.map(opt => ({ name: opt.text, value: opt.votes }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                isAnimationActive={true}
              >
                {poll.options.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
