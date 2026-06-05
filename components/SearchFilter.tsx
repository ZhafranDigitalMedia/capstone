import { Search } from "lucide-react";

interface SearchFilterProps {
  search: string;
  setSearch: (value: string) => void;
  rating: number;
  setRating: (value: number) => void;
  onSearch: () => void;
  isMoodSelected: boolean; // true = mood chosen; false = "By Title" mode
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
    <section className="px-6 md:px-10 mt-10">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl">

        {/* Search Movie */}
        <div className="mb-8">
          <label className="block mb-1 text-xl font-semibold text-white">
            {isMoodSelected ? "Filter by Title" : "Search by Title / Keyword"}
          </label>
          <p className="text-sm text-gray-400 mb-4">
            {isMoodSelected
              ? "Optionally narrow results within the selected mood genre"
              : "No mood selected — results will match your keyword across all genres"}
          </p>

          <div className="flex items-center bg-purple-900/40 rounded-2xl px-4 py-2 overflow-hidden border border-white/10">
            <Search className="mr-3 text-purple-200 flex-shrink-0" size={22} />

            <input
              type="text"
              placeholder={placeholder}
              className="w-full bg-transparent py-3 outline-none text-white placeholder:text-purple-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={onSearch}
              className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition whitespace-nowrap ml-2"
            >
              Search
            </button>
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="block mb-4 text-xl font-semibold text-white">
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
          <div className="flex justify-between text-sm text-purple-200 mt-2">
            <span>5.0</span>
            <span>9.0</span>
          </div>
        </div>

      </div>
    </section>
  );
}