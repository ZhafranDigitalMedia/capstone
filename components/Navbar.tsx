"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 px-4 sm:px-6 lg:px-10 py-3 sm:py-5">
        
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/Logo MoodFlix.png"
            alt="MoodFlix Logo"
            width={40}
            height={40}
            className="sm:w-[50px] sm:h-[50px]"
          />

          <div>
            <h1 className="text-xl sm:text-3xl font-bold text-white">
              MoodFlix
            </h1>

            <p className="text-xs sm:text-sm text-purple-200">
              Movie Recommender System
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="flex w-full sm:w-auto gap-2 sm:gap-4 items-center">
          <button
            onClick={() => router.push("/")}
            className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-xl font-medium text-sm sm:text-base transition ${
              pathname === "/"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "text-purple-200 hover:text-white"
            }`}
          >
            Recommendation
          </button>

          <button
            onClick={() => router.push("/analytics")}
            className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 rounded-xl font-medium text-sm sm:text-base transition ${
              pathname === "/analytics"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "text-purple-200 hover:text-white"
            }`}
          >
            Analysis
          </button>
        </div>
      </div>
    </nav>
  );
}