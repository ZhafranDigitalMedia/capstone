"use client";

import { useState } from "react";
import { Star, X, Calendar, Globe, ThumbsUp } from "lucide-react";

export default function MovieCard({ movie }: any) {
  const [open, setOpen] = useState(false);

  const title = movie.Title || movie.title || "Unknown";
  const poster = movie.Poster || movie.poster;
  const rating = movie.imdbRating;
  const year = movie.Year;
  const genre = movie.Genre;
  const plot = movie.Plot;
  const language = movie.Bahasa_Asli?.toUpperCase() || null;
  const votes = movie.Jumlah_Rating_Vote
    ? Number(movie.Jumlah_Rating_Vote).toLocaleString()
    : null;

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 cursor-pointer"
      >
        <div className="overflow-hidden relative">
          <img
            src={poster}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-[380px] sm:h-[450px] md:h-[500px] object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='320' fill='%23161032'%3E%3Crect width='400' height='320'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-size='16'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm">
              View Synopsis
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 text-sm text-yellow-400 mb-3">
            <Star size={16} fill="yellow" />
            <span>{rating}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">{year}</span>
          </div>

          <h4 className="text-lg sm:text-xl font-semibold text-white mb-3 line-clamp-2 sm:line-clamp-1">
            {title}
          </h4>

          <div className="flex flex-wrap gap-2 mb-4">
            {genre?.split(",").map((g: string) => (
              <span
                key={g}
                className="px-3 py-1 text-xs rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/20"
              >
                {g.trim()}
              </span>
            ))}
          </div>

          <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
            {plot}
          </p>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-gradient-to-br from-[#0f1535] to-[#2a0a55] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative h-44 sm:h-56 overflow-hidden rounded-t-3xl">
              <img
                src={movie.Backdrop_Path || poster}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = poster || "";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1535] via-transparent to-transparent" />
            </div>

            <div className="flex gap-4 sm:gap-5 px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-10">
              <img
                src={poster}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-24 h-36 sm:w-28 sm:h-40 object-cover rounded-xl border-2 border-white/20 shadow-xl flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />

              <div className="pt-12 sm:pt-16 pr-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                  {title}
                </h2>

                {movie.Judul_Asli && movie.Judul_Asli !== title && (
                  <p className="text-gray-400 text-sm mt-1 italic">
                    {movie.Judul_Asli}
                  </p>
                )}
              </div>
            </div>

            <div className="px-4 sm:px-6 py-5 space-y-4">
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                  <Star size={14} fill="yellow" />
                  {rating} / 10
                </span>

                <span className="flex items-center gap-1.5 text-gray-300">
                  <Calendar size={14} />
                  {movie.Tanggal_Rilis || year}
                </span>

                {language && (
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <Globe size={14} />
                    {language}
                  </span>
                )}

                {votes && (
                  <span className="flex items-center gap-1.5 text-gray-300">
                    <ThumbsUp size={14} />
                    {votes} votes
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {genre?.split(",").map((g: string) => (
                  <span
                    key={g}
                    className="px-3 py-1 text-xs rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/20"
                  >
                    {g.trim()}
                  </span>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider mb-2">
                  Synopsis
                </h3>

                <p className="text-gray-200 leading-relaxed text-sm">
                  {plot || "No synopsis available for this film."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
