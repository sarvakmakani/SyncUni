"use client";
import React from "react";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#0a0a14]">
      <div className="bg-[#12121c] p-8 rounded-xl shadow-lg w-96 text-center">
        {/* Welcome Text */}
        <h1 className="text-xl font-semibold text-white">Welcome Back</h1>
        <p className="text-gray-400 text-sm mt-1">
          Sign in to continue to <span className="text-blue-400 font-medium">UniSync</span>
        </p>

        {/* Google Login Button */}
        <button className="mt-6 flex items-center justify-center gap-2 w-full bg-white text-gray-800 rounded-lg py-2 font-medium hover:bg-gray-100 transition">
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        {/* Sign Up Link */}
        <p className="mt-6 text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
