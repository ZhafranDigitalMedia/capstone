"use client";

interface MoodSelectorProps {
  moods: any[];
  selectedMood: any | null;
  setSelectedMood: (mood: any | null) => void;
}

// A sentinel object for "no mood selected"
export const NO_MOOD = { nama: null, query: null, image: null, genres: null, color: null };

export default function MoodSelector({
  moods,
  selectedMood,
  setSelectedMood,
}: MoodSelectorProps) {

  const handleMoodClick = (mood: any | null) => {
    if (mood && mood.nama) {
      // Track click stats only for real moods
      const stored = localStorage.getItem("moodStats");
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[mood.nama] = (parsed[mood.nama] || 0) + 1;
      localStorage.setItem("moodStats", JSON.stringify(parsed));
    }
    setSelectedMood(mood);
  };

  const isNoMood = !selectedMood?.nama;

  return (
    <section className="max-w-7xl mx-auto px-6 mt-10">
      <h3 className="text-3xl font-semibold mb-8 text-white">
        How's your mood today?
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* "No Mood / Search by Title" card */}
        <div
          onClick={() => handleMoodClick(NO_MOOD)}
          className={`
            cursor-pointer h-[180px] rounded-3xl border
            flex flex-col items-center justify-center text-center
            transition-all duration-300 hover:scale-105
            ${
              isNoMood
                ? "border-pink-400 bg-white/10 shadow-2xl"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }
          `}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3 bg-white/10 text-3xl">
            🔍
          </div>
          <h4 className="text-lg font-bold text-white">By Title</h4>
          <p className="text-sm text-gray-300 mt-1 px-3">Search by keyword</p>
        </div>

        {/* Mood cards */}
        {moods.map((mood, index) => (
          <div
            key={index}
            onClick={() => handleMoodClick(mood)}
            className={`
              cursor-pointer h-[180px] rounded-3xl border
              flex flex-col items-center justify-center text-center
              transition-all duration-300 hover:scale-105
              ${
                selectedMood?.nama === mood.nama
                  ? "border-pink-400 bg-white/10 shadow-2xl"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }
            `}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3">
              <img
                src={mood.image}
                alt={mood.nama}
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-xl font-bold text-white">{mood.nama}</h4>
            <p className="text-sm text-gray-300 mt-1 px-3">{mood.genres}</p>
          </div>
        ))}
      </div>
    </section>
  );
}