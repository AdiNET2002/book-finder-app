import { useState, useCallback, useEffect, useRef } from 'react';
import SearchBar from './components/SearchBar';
import BookList from './components/BookList';
import BookDetailModal from './components/BookDetailModal';
import { openLibraryAPI } from './services/openLibraryAPI';
import './App.css';

/**
 * Premium Book Finder App - Designed for Readers
 */
function App() {
  // State management using React hooks
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentSearchType, setCurrentSearchType] = useState('q');
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false); // New state to control auto-scroll

  // Add ref for results section
  const resultsRef = useRef(null);

  // Add mouse position state for interactive animations
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Mouse tracking for interactive background animations
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  /**
   * Handle search functionality with auto-scroll
   */
  const handleSearch = useCallback(async (query, searchType) => {
    setIsLoading(true);
    setError(null);
    setBooks([]);
    setCurrentPage(1);
    setCurrentQuery(query);
    setCurrentSearchType(searchType);
    setShouldAutoScroll(true); // Enable auto-scroll for new searches

    try {
      const result = await openLibraryAPI.searchBooks(query, searchType, 1);
      setBooks(result.books);
      setTotalResults(result.totalResults);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
      setBooks([]);
      setTotalResults(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-scroll to results only for new searches, not for load more
  useEffect(() => {
    if (!isLoading && shouldAutoScroll && (books.length > 0 || error) && resultsRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest' 
        });
        setShouldAutoScroll(false); // Reset after scrolling
      }, 100);
    }
  }, [isLoading, books.length, error, shouldAutoScroll]);

  /**
   * Handle load more functionality for pagination
   */
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    // Don't set shouldAutoScroll for load more operations

    try {
      const result = await openLibraryAPI.searchBooks(
        currentQuery, 
        currentSearchType, 
        nextPage
      );
      
      setBooks(prevBooks => [...prevBooks, ...result.books]);
      setHasMore(result.hasMore);
      setCurrentPage(nextPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentQuery, currentSearchType, currentPage, hasMore, isLoadingMore]);

  /**
   * Handle book card click to open modal
   */
  const handleBookClick = useCallback((book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  }, []);

  /**
   * Handle modal close
   */
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedBook(null);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen gradient-bg overflow-hidden relative">
      {/* Interactive Background Elements with Mouse Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs with parallax effect */}
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-amber-300/5 rounded-full blur-3xl float transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 20}px) scale(${1 + mousePosition.x * 0.1})`
          }}
        ></div>
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl float transition-transform duration-1000 ease-out" 
          style={{
            animationDelay: '2s',
            transform: `translate(${-mousePosition.x * 25}px, ${-mousePosition.y * 15}px) scale(${1 + mousePosition.y * 0.08})`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl float transition-transform duration-1000 ease-out" 
          style={{
            animationDelay: '4s',
            transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 25}px) scale(${1 + (mousePosition.x + mousePosition.y) * 0.05})`
          }}
        ></div>
        
        {/* Interactive floating book elements */}
        <div 
          className="absolute top-20 right-20 w-4 h-6 bg-gradient-to-b from-amber-400/20 to-amber-600/20 rounded-sm float transition-all duration-700 ease-out" 
          style={{
            animationDelay: '1s',
            transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 10}px) rotate(${mousePosition.x * 10}deg)`
          }}
        ></div>
        <div 
          className="absolute bottom-40 left-20 w-3 h-5 bg-gradient-to-b from-blue-400/20 to-blue-600/20 rounded-sm float transition-all duration-700 ease-out" 
          style={{
            animationDelay: '3s',
            transform: `translate(${-mousePosition.x * 12}px, ${mousePosition.y * 8}px) rotate(${-mousePosition.y * 8}deg)`
          }}
        ></div>
        
        {/* Additional interactive particles */}
        <div 
          className="absolute top-1/3 left-1/4 w-2 h-2 bg-yellow-400/30 rounded-full blur-sm transition-all duration-500 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 40}px, ${mousePosition.y * 30}px) scale(${1 + mousePosition.x * 0.5})`
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-pink-400/30 rounded-full blur-sm transition-all duration-500 ease-out"
          style={{
            transform: `translate(${-mousePosition.x * 35}px, ${-mousePosition.y * 25}px) scale(${1 + mousePosition.y * 0.3})`
          }}
        ></div>
        <div 
          className="absolute top-2/3 right-1/4 w-2.5 h-2.5 bg-purple-400/20 rounded-full blur-sm transition-all duration-500 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${-mousePosition.y * 20}px) scale(${1 + (mousePosition.x + mousePosition.y) * 0.2})`
          }}
        ></div>
        
        {/* Floating text elements that respond to mouse */}
        <div 
          className="absolute top-1/4 right-1/2 text-amber-400/10 text-6xl font-serif italic select-none transition-all duration-800 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 25}px, ${mousePosition.y * 15}px) rotate(${mousePosition.x * 5}deg)`,
            opacity: 0.1 + mousePosition.x * 0.1
          }}
        >
          📚
        </div>
        <div 
          className="absolute bottom-1/4 left-1/3 text-emerald-400/10 text-4xl font-serif italic select-none transition-all duration-800 ease-out"
          style={{
            transform: `translate(${-mousePosition.x * 20}px, ${mousePosition.y * 12}px) rotate(${-mousePosition.y * 3}deg)`,
            opacity: 0.1 + mousePosition.y * 0.1
          }}
        >
          ✨
        </div>
        
        {/* Dynamic gradient overlay that follows mouse */}
        <div 
          className="absolute inset-0 transition-all duration-1000 ease-out pointer-events-none"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(59, 130, 246, 0.02) 0%, 
              rgba(147, 51, 234, 0.01) 25%, 
              transparent 50%)`
          }}
        ></div>
      </div>

      {/* Elegant Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="space-y-12 fade-in-up">
            {/* Literary Icon */}
            <div className="inline-flex items-center justify-center w-28 h-28 glass rounded-full shadow-elegant mb-8 stagger-1">
              <div className="relative">
                <svg className="w-14 h-14 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 2v20l8-4 8 4V2H4zm2 2h12v14l-6-3-6 3V4z"/>
                </svg>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Hero Title with Literary Elegance */}
            <div className="stagger-2">
              <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                <span className="font-serif italic">Literary</span>
                <br />
                <span className="font-sans">Discovery</span>
              </h1>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed mb-4">
                  Embark on a journey through millions of literary treasures
                </p>
                <p className="text-lg text-slate-300/80 italic font-serif">
                  "A reader lives a thousand lives before he dies" — George R.R. Martin
                </p>
              </div>
            </div>

            {/* Elegant Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20 stagger-3">
              <div className="glass rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-500">
                <div className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent mb-3">10M+</div>
                <div className="text-slate-600 font-medium">Literary Works</div>
                <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="glass rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-500">
                <div className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent mb-3">50K+</div>
                <div className="text-slate-600 font-medium">Distinguished Authors</div>
                <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="glass rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-500">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent mb-3">100+</div>
                <div className="text-slate-600 font-medium">Languages & Cultures</div>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 pb-24">
        {/* Search Section */}
        <div className="mb-20 fade-in-up stagger-4">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results Section with ref for auto-scroll */}
        <div ref={resultsRef}>
          {/* Error Message */}
          {error && (
            <div className="mb-16 max-w-3xl mx-auto fade-in-up">
              <div className="glass-dark rounded-3xl p-10 border border-red-400/20">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-white mb-3">Search Encountered an Issue</h3>
                    <p className="text-red-200 leading-relaxed">{error}</p>
                    <p className="text-red-300/70 text-sm mt-2 italic">Please try again with different search terms</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <BookList
            books={books}
            onBookClick={handleBookClick}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isLoading={isLoading}
            isLoadingMore={isLoadingMore}
            totalResults={totalResults}
          />
        </div>

        {/* Welcome State - Literary Focus */}
        {!isLoading && books.length === 0 && !error && (
          <div className="text-center py-24 fade-in-up">
            <div className="max-w-6xl mx-auto">
              {/* Literary Search Illustration */}
              <div className="relative mb-20">
                <div className="w-48 h-48 mx-auto glass rounded-full flex items-center justify-center shadow-elegant group">
                  <svg className="w-24 h-24 text-amber-600 group-hover:scale-110 transition-transform duration-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </div>
                {/* Floating literary elements */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-8">
                  <div className="w-6 h-8 bg-gradient-to-b from-amber-400/40 to-amber-600/40 rounded-sm float shadow-lg"></div>
                </div>
                <div className="absolute bottom-8 right-1/4 transform translate-x-4">
                  <div className="w-5 h-7 bg-gradient-to-b from-emerald-400/40 to-emerald-600/40 rounded-sm float shadow-lg" style={{animationDelay: '1s'}}></div>
                </div>
                <div className="absolute top-1/2 left-1/4 transform -translate-x-8">
                  <div className="w-4 h-6 bg-gradient-to-b from-blue-400/40 to-blue-600/40 rounded-sm float shadow-lg" style={{animationDelay: '2s'}}></div>
                </div>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 font-serif">
                Begin Your Literary Quest
              </h2>
              <p className="text-xl md:text-2xl text-slate-200 mb-6 max-w-3xl mx-auto leading-relaxed font-light">
                Explore the vast universe of human knowledge and imagination
              </p>
              <p className="text-lg text-slate-300/80 mb-20 max-w-2xl mx-auto italic font-serif">
                Every book is a doorway to new worlds, perspectives, and possibilities
              </p>
              
              {/* Enhanced Feature Cards */}
              <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
                <div className="card group cursor-default">
                  <div className="p-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 2v20l8-4 8 4V2H4zm2 2h12v14l-6-3-6 3V4z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 font-serif">Search by Title</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">Discover specific literary works with precision and find exactly what speaks to your soul</p>
                  </div>
                </div>
                
                <div className="card group cursor-default">
                  <div className="p-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 font-serif">Explore by Author</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">Journey through the complete works of literary masters and discover new voices in literature</p>
                  </div>
                </div>
                
                <div className="card group cursor-default">
                  <div className="p-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 font-serif">Browse by Genre</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">Navigate through diverse subjects and genres to uncover hidden literary gems</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />

      {/* Elegant Footer */}
      <footer className="relative mt-32">
        <div className="glass-dark border-t border-slate-700/20">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center">
              <div className="flex items-center justify-center mb-10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-blue-500 rounded-2xl flex items-center justify-center mr-6">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 2v20l8-4 8 4V2H4zm2 2h12v14l-6-3-6 3V4z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-3xl font-bold text-white font-serif italic">Literary</span>
                  <span className="text-3xl font-light text-slate-300 ml-2">Discovery</span>
                </div>
              </div>
              <p className="text-slate-300 mb-6 text-lg leading-relaxed">
                Powered by the remarkable{' '}
                <a
                  href="https://openlibrary.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors underline decoration-amber-400/30 hover:decoration-amber-300"
                >
                  Open Library
                </a>
                {' '}— A treasure trove of human knowledge
              </p>
              <div className="flex items-center justify-center space-x-2 text-slate-400">
                <span>Crafted with</span>
                <span className="text-red-400 text-xl">♥</span>
                <span>for book lovers and dreamers worldwide</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
