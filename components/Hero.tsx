export default function Hero() {
  return (
    <section className="px-4 sm:px-6 py-8 sm:py-12">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center leading-tight">
        Find Movies to Match <span className="text-pink-400">Your Mood</span>
      </h2>

      <p className="mt-4 text-base sm:text-lg md:text-xl text-purple-200 max-w-3xl mx-auto text-center leading-relaxed">
        Mood-based recommendation systems use content-based filtering to provide
        a personalized viewing experience.
      </p>
    </section>
  );
}
