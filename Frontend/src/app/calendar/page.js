"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function CalendarPage() {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const toggleSidebar = () => setSidebarOpen((prev) => !prev);

	return (
		<div className="flex h-screen">
			{sidebarOpen && (
				<Sidebar
					sidebarOpen={sidebarOpen}
					toggleSidebar={toggleSidebar}
					mode="vault"
				/>
			)}
			<div className="flex-1 flex flex-col overflow-y-auto bg-gray-900">
				<Header toggleSidebar={toggleSidebar} />
				<div className="p-6 text-white h-full">
					<iframe
						src="https://www.charusat.ac.in/calendar"
						title="College Calendar"
						className="w-full h-[80vh] rounded-xl border border-gray-700"
					></iframe>
				</div>
			</div>
		</div>
	);
}
