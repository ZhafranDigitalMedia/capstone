// TMDB Genre ID → Genre Name mapping
const GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

// Normalize movie data
export function normalizeTmdbMovie(movie: any) {
  const genreNames = (movie.Genre_IDs || [])
    .map((id: number) => GENRE_MAP[id] || "")
    .filter(Boolean)
    .join(", ");

  const year = movie.Tanggal_Rilis
    ? movie.Tanggal_Rilis.split("-")[0]
    : "N/A";

  const rating =
    movie.Rating_Rata_Rata != null
      ? String(Math.round(movie.Rating_Rata_Rata * 10) / 10)
      : "N/A";

  return {
    ...movie,
    imdbID: String(movie.TMDb_ID),
    Title: movie.Judul || movie.Judul_Asli || "Unknown",
    Year: year,
    Poster: movie.Poster_Path || "",
    Genre: genreNames || "N/A",
    Plot: movie.Sinopsis || "No synopsis available.",
    imdbRating: rating,
    Response: "True",
  };
}

let _cachedMovies: any[] | null = null;

// Load local database
async function loadDatabase(): Promise<any[]> {
  if (_cachedMovies) return _cachedMovies;

  const res = await fetch("/data/semua_film_gabungan.json");

  if (!res.ok) {
    throw new Error("Failed to load movie database");
  }

  const raw: any[] = await res.json();

  _cachedMovies = raw.map(normalizeTmdbMovie);

  return _cachedMovies;
}

// Mood → Genre mapping
export const MOOD_GENRE_MAP: Record<string, string[]> = {
  comedy: ["Comedy", "Romance"],
  drama: ["Drama", "Romance"],
  action: ["Action", "Thriller", "Crime"],
  family: ["Family", "Comedy", "Animation"],
  adventure: ["Adventure", "Action", "Fantasy", "Science Fiction"],
};

export type SearchMode =
  | "mood"
  | "title"
  | "mood+title";

export interface FetchOptions {
  mode: SearchMode;
  moodQuery?: string;
  titleQuery?: string;
  rating: number;

}

// Main fetch function
export const fetchMovies = async (
  opts: FetchOptions
): Promise<any[]> => {

  const allMovies = await loadDatabase();

  const {
    mode,
    moodQuery = "",
    titleQuery = "",
    rating,
  } = opts;

  const titleLower = titleQuery.toLowerCase().trim();
  const moodKey = moodQuery.toLowerCase().trim();

  const moodGenres =
    MOOD_GENRE_MAP[moodKey] ?? [];

  let filtered = allMovies;

  // MODE: MOOD
  if (mode === "mood") {

    if (moodGenres.length > 0) {

      filtered = filtered.filter((m) => {
        const genres =
          (m.Genre || "").toLowerCase();

        return moodGenres.some((g) =>
          genres.includes(g.toLowerCase())
        );
      });
    }
  }

  // MODE: TITLE
  else if (mode === "title") {

    if (titleLower) {

      filtered = filtered.filter(
        (m) =>
          (m.Title || "")
            .toLowerCase()
            .includes(titleLower) ||

          (m.Plot || "")
            .toLowerCase()
            .includes(titleLower)
      );
    }
  }

  // MODE: MOOD + TITLE
  else if (mode === "mood+title") {

    if (moodGenres.length > 0) {

      filtered = filtered.filter((m) => {
        const genres =
          (m.Genre || "").toLowerCase();

        return moodGenres.some((g) =>
          genres.includes(g.toLowerCase())
        );
      });
    }

    if (titleLower) {

      filtered = filtered.filter(
        (m) =>
          (m.Title || "")
            .toLowerCase()
            .includes(titleLower) ||

          (m.Plot || "")
            .toLowerCase()
            .includes(titleLower)
      );
    }
  }

  // Rating filter
  if (rating > 0) {

    filtered = filtered.filter(
      (m) =>
        parseFloat(m.imdbRating || "0") >= rating
    );
  }

  // Top movies before AI ranking
  const topMovies = filtered
    .sort(
      (a, b) =>
        (b.Popularitas_Skor || 0) -
        (a.Popularitas_Skor || 0)
    )
    .slice(0, 50);

  return topMovies;
};

