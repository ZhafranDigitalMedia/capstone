import { Film, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Identitas Aplikasi */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Film className="text-pink-400" size={28} />

              <h3 className="text-2xl font-bold text-white">
                MoodFlix
              </h3>
            </div>

            <p className="text-gray-300 leading-relaxed text-justify">
              MoodFlix merupakan sistem rekomendasi film berbasis suasana hati
              yang membantu pengguna menemukan film sesuai dengan mood dan
              preferensi mereka menggunakan teknologi kecerdasan buatan dan
              metode Content-Based Filtering.
            </p>
          </div>

          {/* Informasi Proyek */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Informasi Proyek
            </h4>

            <p className="text-gray-300 leading-relaxed text-justify">
              Proyek ini dikembangkan sebagai bagian dari Capstone Project
              Kelompok 1 Program Studi Data Sains, Fakultas Informatika,
              Telkom University. Sistem ini dirancang untuk memberikan
              rekomendasi film yang lebih personal berdasarkan suasana hati
              pengguna.
            </p>
          </div>

          {/* Teknologi */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Teknologi yang Digunakan
            </h4>

            <ul className="space-y-2 text-gray-300">
              <li>⚡ Next.js</li>
              <li>🎨 Tailwind CSS</li>
              <li>🎬 OMDb API</li>
              <li>🤖 Machine Learning</li>
              <li>📊 Content-Based Filtering</li>
            </ul>
          </div>

          {/* Tim Pengembang */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Tim Pengembang
            </h4>

            <p className="text-gray-300 leading-relaxed text-justify">
              Abdul Nabil Ayyazid (1305223026), Abid Zhafran Arifain
              (103052300004), Ade Rahadatul Aisyiah (103052300075), dan
              Adelina Vivian Magdiel (103052300059).
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © 2026 MoodFlix. Dikembangkan sebagai Capstone Project
              Kelompok 1 Program Studi Data Sains, Fakultas Informatika,
              Telkom University.
            </p>

            <a
              href="mailto:abidzhafran@student.telkomuniversity.ac.id"
              className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition"
            >
              <Mail size={18} />
              <span>Hubungi Tim</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}