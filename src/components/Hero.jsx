import { Search, BookOpen, Users, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-blue-50 via-white to-teal-50 py-20 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 w-full h-full z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.25,
          filter: "blur(4px)",
        }}
        aria-hidden="true"
      ></div>
      {/* Decorative background blob */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full opacity-30 blur-2xl z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center w-full">
          {/* Headline, Search, CTA */}
          <div className="w-full max-w-3xl mx-auto space-y-10 text-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight animate-fade-in-up">
                <span className="text-gray-900 block">Discover Your Next</span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 animate-gradient-move">
                  Great Read
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed animate-fade-in-up delay-100">
                Access thousands of books, manage your reading journey, and
                connect with a community of book lovers. Your digital library
                awaits.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto animate-fade-in-up delay-200">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Search className="text-blue-400 h-6 w-6" />
              </div>
              <input
                type="text"
                placeholder="Search for books, authors, genres..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-blue-200 shadow focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white text-gray-900"
              />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
              <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Start Exploring
              </button>
              <button className="border-2 border-blue-300 text-blue-600 px-8 py-4 rounded-xl font-semibold bg-white hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Learn More
              </button>
            </div>
          </div>

          {/* Feature Cards - horizontal row */}
          <div className="flex flex-col lg:flex-row gap-8 w-full justify-center mt-16 animate-fade-in-up delay-400">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 flex-1 min-w-[250px] max-w-sm mx-auto">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Vast Collection
                  </h3>
                  <p className="text-gray-600">
                    Access over 50,000 books across all genres
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-teal-100 flex-1 min-w-[250px] max-w-sm mx-auto">
              <div className="flex items-center space-x-4">
                <div className="bg-teal-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Community</h3>
                  <p className="text-gray-600">
                    Connect with fellow book enthusiasts
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100 flex-1 min-w-[250px] max-w-sm mx-auto">
              <div className="flex items-center space-x-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">24/7 Access</h3>
                  <p className="text-gray-600">
                    Read anytime, anywhere with digital access
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats - below feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 w-full max-w-2xl mx-auto animate-fade-in-up delay-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Books</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">25K+</div>
              <div className="text-gray-600">Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">98%</div>
              <div className="text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
      {/* Responsive: hide blob and bg image on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .bg-gradient-to-br.absolute, .absolute.inset-0 { display: none; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradientMove 3s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
