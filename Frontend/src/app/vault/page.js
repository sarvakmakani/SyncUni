"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { UploadCloud, Eye, Download, Trash2, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VaultPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [vault, setVault] = useState([]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handle file change
  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault();
    setFile(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e) => e.preventDefault();

  // Upload
  const handleUpload = () => {
    if (file && fileName) {
      const newFile = {
        id: Date.now(),
        name: fileName,
        file: file,
        url: URL.createObjectURL(file),
      };
      setVault((prev) => [...prev, newFile]);
      setFile(null);
      setFileName("");
    }
  };

  const handleDelete = (id) => {
    setVault((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-900">
      {sidebarOpen && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          mode="vault"
        />
      )}

      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-white">Student Vault</h1>

          {/* Upload Section */}
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="border-2 border-dashed border-gray-500 rounded-2xl p-12 text-center cursor-pointer 
                hover:border-blue-400 hover:bg-blue-50/10 transition bg-slate-800 shadow-sm"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <UploadCloud className="mx-auto h-14 w-14 text-blue-400 mb-4" />
                <p className="text-gray-200 font-medium text-lg">
                  Drag & drop your document here
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  PDF, Word, Images supported
                </p>
                <label className="inline-block mt-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-xl shadow hover:opacity-90 transition cursor-pointer">
                  Choose File
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </motion.div>
            ) : (
              <motion.div
                key="fileupload"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="border rounded-2xl p-6 shadow bg-slate-800"
              >
                <p className="mb-3 font-medium text-gray-200">
                  Selected File:{" "}
                  <span className="text-blue-400 font-semibold">
                    {file.name}
                  </span>
                </p>
                <input
                  type="text"
                  placeholder="Enter a name for this file"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-blue-400 outline-none bg-slate-900 text-gray-100"
                />
                <button
                  onClick={handleUpload}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2 rounded-lg hover:opacity-90 transition shadow"
                >
                  Upload
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vault Section */}
          <AnimatePresence>
            {vault.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-10"
              >
                <h2 className="text-2xl font-semibold mb-5 text-white">
                  My Documents
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vault.map((doc, index) => (
                    <motion.div
                      key={doc.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-[#1f2a5c] border border-gray-700 rounded-xl p-6 shadow hover:shadow-lg transition-all flex flex-col"
                    >
                      {/* File Icon + Name */}
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-10 h-10 text-blue-400" />
                        <h2 className="font-semibold text-lg line-clamp-1 text-white">
                          {doc.name}
                        </h2>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap mt-auto">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100/20 text-green-400 hover:bg-green-100/30 transition"
                        >
                          <Eye size={14} /> View
                        </a>
                        <a
                          href={doc.url}
                          download={doc.name}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100/20 text-blue-400 hover:bg-blue-100/30 transition"
                        >
                          <Download size={14} /> Download
                        </a>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-red-100/20 text-red-400 hover:bg-red-100/30 transition"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
