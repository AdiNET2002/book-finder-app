import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className="relative">
      {/* Elegant Search Container */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="relative group">
          {/* Search Input with Literary Styling */}
          <div className="relative overflow-hidden rounded-3xl glass-dark border border-slate-600/30 shadow-2xl backdrop-blur-xl group-hover:border-amber-400/30 transition-all duration-500">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-emerald-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-sm"></div>
            
            <div className="relative flex items-center">
              {/* Literary Search Icon */}
              <div className="flex-shrink-0 pl-8 pr-4">
                <div className="relative">
                  <svg 
                    className="w-7 h-7 text-slate-400 group-hover:text-amber-400 transition-colors duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-amber-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                </div>
              </div>

              {/* Enhanced Input Field */}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for literary treasures... (e.g., 'The Great Gatsby', 'Shakespeare', 'Science Fiction')"
                className="flex-1 py-6 pr-8 bg-transparent text-white placeholder-slate-400 text-lg font-light focus:outline-none focus:placeholder-slate-500 transition-all duration-300"
                disabled={isLoading}
              />

              {/* Enhanced Submit Button with Fixed Animations */}
              <div className="flex-shrink-0 pr-4">
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  className="group/btn relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 ease-out hover:scale-105 active:scale-95 overflow-hidden transform-gpu will-change-transform"
                >
                  {/* Enhanced Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-300/30 to-amber-500/30 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-2xl blur-lg"></div>
                  
                  {/* Ripple effect on click */}
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-active/btn:opacity-100 group-active/btn:animate-ping transition-opacity duration-150"></div>
                  
                  <div className="relative flex items-center justify-center space-x-3 min-w-[120px]">
                    {isLoading ? (
                      <div className="flex items-center space-x-3 animate-pulse">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="animate-pulse">Searching...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span className="transition-all duration-300 group-hover/btn:font-bold">Discover</span>
                        <svg 
                          className="w-5 h-5 transition-all duration-300 ease-out group-hover/btn:translate-x-1 group-hover/btn:scale-110" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Elegant Search Suggestions with Improved Animations */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm mb-4 font-light">Popular searches to inspire your literary journey:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'Classic Literature',
                'Contemporary Fiction',
                'Mystery & Thriller',
                'Science Fiction',
                'Jane Austen',
                'Agatha Christie',
                'Philosophy',
                'Poetry'
              ].map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    onSearch(suggestion);
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 bg-slate-700/30 hover:bg-slate-600/40 text-slate-300 hover:text-white text-sm rounded-full border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 ease-out hover:scale-105 active:scale-95 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform-gpu will-change-transform"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Literary Quote */}
        <div className="mt-12 text-center">
          <blockquote className="text-slate-300/80 italic text-lg font-serif max-w-2xl mx-auto leading-relaxed">
            "I have always imagined that Paradise will be a kind of library."
            <footer className="text-slate-400 text-sm mt-2 not-italic font-sans">— Jorge Luis Borges</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;