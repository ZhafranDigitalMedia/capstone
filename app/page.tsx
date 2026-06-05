"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import MoodSelector, { NO_MOOD } from "@/components/MoodSelector";
import SearchFilter from "@/components/SearchFilter";
import MovieCard from "@/components/MovieCard";
import { moods } from "@/data/moods";
import { fetchMovies } from "@/lib/movies";
import { recommendMoviesByAI } from "@/lib/mlRecommender";

export default function Home() {
  // null = "By Title" mode (no mood)
  const [selectedMood, setSelectedMood] = useState<any>(moods[2]);
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [rating, setRating] = useState(7);

  const isMoodSelected = !!selectedMood?.nama;

  /**
   * Determine fetch mode based on current state:
   *
   * mood selected  + no title  → "mood"
   * mood selected  + has title → "mood+title"
   * no mood        + has title → "title"
   * no mood        + no title  → "mood" fallback with empty moodQuery (returns popular)
   */
  const runFetch = async (titleOverride?: string) => {
    const titleQuery = titleOverride !== undefined ? titleOverride : search;
    const moodQuery = selectedMood?.query ?? "";
    const hasMood = !!moodQuery;
    const hasTitle = titleQuery.trim().length > 0;

    let mode: "mood" | "title" | "mood+title";
    if (hasMood && hasTitle) mode = "mood+title";
    else if (!hasMood && hasTitle) mode = "title";
    else mode = "mood";

    // AI ranking context text
    const aiContext =
      hasMood && hasTitle
        ? `${selectedMood!.nama} ${titleQuery}`
        : hasMood
          ? selectedMood!.nama
          : titleQuery || "popular movies";

    try {
      setLoading(true);

      const rawMovies = await fetchMovies({
        mode,
        moodQuery,
        titleQuery,
        rating,
      });

      const aiRanked = await recommendMoviesByAI(aiContext, rawMovies);

      setMovies(aiRanked);

      localStorage.setItem("loaded_movies", JSON.stringify(aiRanked));
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever mood changes; clear search box on mood switch
  useEffect(() => {
    setSearch("");
    runFetch("");
  }, [selectedMood]);

  // Rating slider re-filters client-side (no re-fetch needed)
  const filteredMovies = movies.filter(
    (m) => Number(m.imdbRating || 0) >= rating,
  );

  // Section heading text
  const headingLabel = isMoodSelected ? (
    <>
      Recommendations for Mood:{" "}
      <span className="text-pink-400 ml-2">{selectedMood.nama}</span>
    </>
  ) : (
    <>
      Search Results
      {search ? (
        <span className="text-pink-400 ml-2">"{search}"</span>
      ) : (
        <span className="text-gray-400 ml-2 text-2xl">
          — type a title above
        </span>
      )}
    </>
  );

  return (
    <main className="min-h-screen pt-28 sm:pt-24 bg-gradient-to-b from-[#0b1026] to-[#480D82] text-white">
      <Navbar />
      <Hero />

      <MoodSelector
        moods={moods}
        selectedMood={selectedMood}
        setSelectedMood={setSelectedMood}
      />

      <SearchFilter
        search={search}
        setSearch={setSearch}
        rating={rating}
        setRating={setRating}
        isMoodSelected={isMoodSelected}
        onSearch={() => runFetch(search)}
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold leading-snug">
            {headingLabel}
          </h3>

          <p className="text-sm sm:text-base text-gray-300">
            {filteredMovies.length} movies found
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 sm:py-20 text-xl sm:text-2xl font-bold">
            Loading Content with AI...
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="text-center py-16 sm:py-20 text-gray-400 text-base sm:text-lg px-4">
            {!isMoodSelected && !search
              ? "Select a mood or type a title to start discovering movies 🎬"
              : "No movies found. Try a different keyword or lower the minimum rating."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} />
            ))}
          </div>
        )}
      </section>
      <Footer/>
    </main>
  );
}
