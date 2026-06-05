"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-10 py-5">

        {/* Logo + Title */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/Logo MoodFlix.png"
            alt="MoodFlix Logo"
            width={50}
            height={50}
          />

          <div>
            <h1 className="text-3xl font-bold text-white">
              MoodFlix
            </h1>

            <p className="text-sm text-purple-200">
              Movie Recommender System
            </p>
          </div>
        </div>

        {/* Menu kanan */}
        <div className="flex gap-4 items-center">

          <button
            onClick={() => router.push("/")}
            className={`px-5 py-2 rounded-xl font-medium transition ${
              pathname === "/"
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                : "text-purple-200 hover:text-white"
            }`}
          >
            Recommendation
          </button>

          <button
            onClick={() => router.push("/analytics")}
            className={`px-5 py-2 rounded-xl font-medium transition ${
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