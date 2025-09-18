"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";


export default function DashboardPage() {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const toggleSidebar = () => setSidebarOpen((prev) => !prev);

	return (
		<div className="flex h-screen">
			{sidebarOpen && (
				<Sidebar
					sidebarOpen={sidebarOpen}
					toggleSidebar={toggleSidebar}
					mode="dashboard"
				/>
			)}
			<div className="flex-1 flex flex-col overflow-y-auto">
				<Header toggleSidebar={toggleSidebar} />
				<div className="p-6 text-white">This is the Dashboard page.</div>
			</div>
		</div>
	);
}

