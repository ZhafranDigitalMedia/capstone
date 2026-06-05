"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { moods } from "@/data/moods";
import { fetchMovies } from "@/lib/movies";
import Image from "next/image";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import { TrendingUp, Film, Star, Smile } from "lucide-react";

const COLORS = ["#ec4899","#8b5cf6","#3b82f6","#10b981","#f59e0b","#ef4444","#06b6d4","#f97316"];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [moodStats, setMoodStats] = useState<any[]>([]);
  const [genreStats, setGenreStats] = useState<any[]>([]);
  const [ratingDist, setRatingDist] = useState<any[]>([]);
  const [moodMovieCount, setMoodMovieCount] = useState<any[]>([]);
  const [topMovies, setTopMovies] = useState<any[]>([]);
  const [totalFilms, setTotalFilms] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  // Modal state


  useEffect(() => {
    // Mood click stats from localStorage
    const stored = localStorage.getItem("moodStats");
    const parsed = stored ? JSON.parse(stored) : {};
    setMoodStats(
      moods.map((m) => ({ name: m.nama, count: parsed[m.nama] || 0 }))
    );

    // Load all movies from local JSON database
    const fetchAll = async () => {
      setLoading(true);

      try {
        // Fetch movies for each mood (no rating filter — pass 0)
        const results = await Promise.all(
          moods.map((m) => 
            fetchMovies({
              mode: "mood",
              moodQuery:m.query, 
              rating: 0,})
            )
        );

        setMoodMovieCount(
          moods.map((m, i) => ({ name: m.nama, total: results[i].length }))
        );

        const combined = results.flat();
        // Deduplicate by imdbID (= TMDb_ID string)
        const unique = Array.from(
          new Map(combined.map((m) => [m.imdbID, m])).values()
        );
        setTotalFilms(unique.length);

        // Average rating
        const rated = unique.filter((m) => parseFloat(m.imdbRating) > 0);
        const avg =
          rated.reduce((acc, m) => acc + parseFloat(m.imdbRating), 0) /
          (rated.length || 1);
        setAvgRating(Math.round(avg * 10) / 10);

        // Genre distribution
        const genreMap: Record<string, number> = {};
        unique.forEach((movie) => {
          movie.Genre?.split(",").forEach((g: string) => {
            const genre = g.trim();
            if (genre) genreMap[genre] = (genreMap[genre] || 0) + 1;
          });
        });
        setGenreStats(
          Object.entries(genreMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8)
        );

        // Rating distribution (0–10 scale from TMDb)
        const ratingMap: Record<string, number> = {
          "<6": 0, "6–7": 0, "7–8": 0, "8–9": 0, "9–10": 0,
        };
        unique.forEach((movie) => {
          const r = parseFloat(movie.imdbRating);
          if (isNaN(r)) return;
          if (r < 6) ratingMap["<6"]++;
          else if (r < 7) ratingMap["6–7"]++;
          else if (r < 8) ratingMap["7–8"]++;
          else if (r < 9) ratingMap["8–9"]++;
          else ratingMap["9–10"]++;
        });
        setRatingDist(
          Object.entries(ratingMap).map(([name, value]) => ({ name, value }))
        );

        // Top 5 by rating
        setTopMovies(
          [...rated]
            .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
            .slice(0, 5)
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const totalMoodClicks = moodStats.reduce((a, b) => a + b.count, 0);

  return (
    <main className="min-h-screen pt-24 bg-gradient-to-b from-[#0b1026] to-[#480D82] text-white">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Image src="/analysis.png" alt="Analytics" width={40} height={40} />
            Analytics
          </h2>
          <p className="text-gray-400">
            MoodFlix usage statistics and movie data distribution
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin" />
            <p className="text-gray-400 text-lg">Loading analytics data...</p>
          </div>
        ) : (
          <>
            {/* Top 5 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm mb-10">
              <div className="flex items-center gap-3 mb-1">
                <Image src="/trophy-star.png" alt="Trophy" width={32} height={32} />
                <h3 className="text-xl font-semibold">Top 5 Highest Film Ratings</h3>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                The best films in all mood categories
              </p>
              
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {topMovies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                />
              ))}
            </div>
            </div>
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                { icon: Film, label: "Total Movies", value: totalFilms, color: "text-pink-400" },
                { icon: Star, label: "Avg Rating", value: avgRating, color: "text-yellow-400" },
                { icon: Smile, label: "Total Mood Selected", value: totalMoodClicks, color: "text-purple-400" },
                { icon: TrendingUp, label: "Total Genres", value: genreStats.length, color: "text-green-400" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm"
                >
                  <Icon className={`mb-3 ${color}`} size={24} />
                  <p className="text-gray-400 text-sm">{label}</p>
                  <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
                </div>
              ))}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Mood Popularity */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-1">
                  <Image src="/popular.png" alt="Popular Mood" width={28} height={28} />
                  <h3 className="text-xl font-semibold">Most Popular Mood</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6">Based on your selections</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={moodStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#1e1b4b", border: "none", borderRadius: 8 }} labelStyle={{ color: "#f8fafc" }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {moodStats.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {totalMoodClicks === 0 && (
                  <p className="text-center text-gray-500 text-sm mt-3">
                    No data available — please select a mood on the main page first!
                  </p>
                )}
              </div>

              {/* Genre Distribution */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-1">
                  <Image src="/film-reel.png" alt="Genre Distribution" width={28} height={28} />
                  <h3 className="text-xl font-semibold">Genre Distribution</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6">Top 8 genres from all films</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={genreStats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      label={({ name, percent }) =>
                        `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {genreStats.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1e1b4b", border: "none", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Rating Distribution */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-1">
                  <Image src="/star.png" alt="Rating Distribution" width={28} height={28} />
                  <h3 className="text-xl font-semibold">Rating Distribution</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                  Distribution of recommended film ratings
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ratingDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#1e1b4b", border: "none", borderRadius: 8 }} labelStyle={{ color: "#f8fafc" }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {ratingDist.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Films per Mood */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-1">
                  <Image src="/emotion.png" alt="Film per mood" width={28} height={28} />
                  <h3 className="text-xl font-semibold">Number of Films per Mood</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                  Films available in each mood category
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={moodMovieCount}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="name" tick={{ fill: "#cbd5e1", fontSize: 12 }} />
                    <YAxis tick={{ fill: "#cbd5e1", fontSize: 12 }} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "#1e1b4b", border: "none", borderRadius: 8 }} labelStyle={{ color: "#f8fafc" }} />
                    <Bar dataKey="total" fill="#ec4899" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}