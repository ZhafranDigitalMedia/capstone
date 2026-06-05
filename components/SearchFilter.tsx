import { Search } from "lucide-react";

interface SearchFilterProps {
  search: string;
  setSearch: (value: string) => void;
  rating: number;
  setRating: (value: number) => void;
  onSearch: () => void;
  isMoodSelected: boolean;
}

export default function SearchFilter({
  search,
  setSearch,
  rating,
  setRating,
  onSearch,
  isMoodSelected,
}: SearchFilterProps) {
  const placeholder = isMoodSelected
    ? "Filter by title within this mood..."
    : "Search movies by title or keyword...";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 mt-8 sm:mt-10">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/10 shadow-xl">
        <div className="mb-6 sm:mb-8">
          <label className="block mb-1 text-lg sm:text-xl font-semibold text-white">
            {isMoodSelected ? "Filter by Title" : "Search by Title / Keyword"}
          </label>

          <p className="text-xs sm:text-sm text-gray-400 mb-4">
            {isMoodSelected
              ? "Optionally narrow results within the selected mood genre"
              : "No mood selected — results will match your keyword across all genres"}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center bg-purple-900/40 rounded-2xl px-3 sm:px-4 py-3 sm:py-2 overflow-hidden border border-white/10 gap-3 sm:gap-0">
            <div className="flex items-center flex-1 w-full">
              <Search
                className="mr-3 text-purple-200 flex-shrink-0"
                size={20}
              />

              <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-transparent py-2 sm:py-3 outline-none text-white placeholder:text-purple-300 text-sm sm:text-base"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <button
              onClick={onSearch}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition whitespace-nowrap sm:ml-2 text-sm sm:text-base"
            >
              Search
            </button>
          </div>
        </div>

        <div>
          <label className="block mb-4 text-lg sm:text-xl font-semibold text-white">
            Minimum Rating: {rating}.0
          </label>

          <input
            type="range"
            min="5"
            max="9"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full accent-pink-500 cursor-pointer"
          />

          <div className="flex justify-between text-xs sm:text-sm text-purple-200 mt-2">
            <span>5.0</span>
            <span>9.0</span>
          </div>
        </div>
      </div>
    </section>
  );
}