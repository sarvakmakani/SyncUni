"use client";
import React, { useState,useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User } from "lucide-react";
import axios from "axios";

export default function FormsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const [forms,setForms]=useState([])

  // Fetch questions
  const fetchForms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/form', {
        withCredentials: true, 
      });
      setForms(res.data.data);
    } catch (err) {
      console.error("Error fetching forms:", err);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  // Status → Badge color mapping
  const statusColor = {
    Filled: "bg-green-500/20 text-green-400 border border-green-500",
    Pending: "bg-red-500/20 text-red-400 border border-red-500",
  };

  const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
      });
  };

  const isExpired = (date)=> new Date(date) < new Date();

  return (
    <div className="flex h-screen">
      {sidebarOpen && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          mode="vault"
        />
      )}
      <div className="flex-1 flex bg-slate-900 flex-col overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />

        <div className="p-6 text-white">
          <h1 className="text-2xl font-bold mb-6"> Available Forms</h1>

          {/* Forms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card
                key={form._id}
                className="bg-[#1f2a5c] border border-gray-700 shadow-md hover:shadow-lg transition rounded-2xl"
              >
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">
                    {form.name}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={`${statusColor["Pending"]} rounded-full px-3 py-1 text-xs font-medium`}
                  >
                    Pending
                  </Badge>
                </CardHeader>

                <CardContent>
                  {/* Description */}
                  <p className="text-sm text-gray-400 mb-3">
                    {form.description || "No description provided."}
                  </p>

                  {/* Deadline */}
                  <div className="flex items-center text-gray-300 text-sm mb-2">
                    <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                    <span className={isExpired(form.deadline) ? "text-red-400" : "font-medium"}>
                      Deadline: {formatDate(form.deadline)}
                    </span>
                  </div>

                  {/* Created By */}
                  {console.log(form)
                  }
                  <div className="flex items-center text-gray-300 text-sm mb-4">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">
                      Created By: {'  Prof. '+form.uploadedBy.name || 'Unknown'}
                    </span>
                  </div>

                  {/* Fill Form Button */}
                  <Button
                    onClick={() => window.open(form.googleFormLink, "_blank")}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    Fill Form
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
