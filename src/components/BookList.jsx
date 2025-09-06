import BookCard from './BookCard';
import LoadingSpinner from './LoadingSpinner';

/**
 * Premium book list component with stunning layout
 */
const BookList = ({ 
  books, 
  onBookClick, 
  onLoadMore, 
  hasMore, 
  isLoading, 
  isLoadingMore, 
  totalResults 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <LoadingSpinner size="large" text="Discovering amazing books..." />
      </div>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <div className="space-y-16 fade-in-up">
      {/* Premium Results Header */}
      <div className="glass rounded-2xl p-8 border border-white/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-heading mb-2">📚 Search Results</h2>
            <p className="text-slate-600">
              Found <span className="font-bold text-blue-600">{totalResults.toLocaleString()}</span> amazing books for you
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-xl border border-blue-200/50">
              <span className="text-sm font-semibold text-blue-700">
                Showing {books.length} of {totalResults.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full pulse-glow"></div>
              <span className="text-sm text-slate-600 font-medium">Live Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {books.map((book, index) => (
          <div
            key={`${book.key}-${index}`}
            className={`stagger-${(index % 4) + 1}`}
          >
            <BookCard book={book} onClick={onBookClick} />
          </div>
        ))}
      </div>

      {/* Premium Load More Section */}
      {hasMore && (
        <div className="text-center pt-12">
          <div className="glass rounded-2xl p-8 max-w-md mx-auto border border-white/30">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">More Books Available</h3>
              <p className="text-slate-600 text-sm">Discover even more amazing books that match your search</p>
            </div>
            
            <button
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="btn-primary w-full"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Loading More Books...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Load More Books
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Premium End of Results */}
      {!hasMore && books.length > 0 && (
        <div className="text-center py-16">
          <div className="glass rounded-2xl p-8 max-w-md mx-auto border border-white/30">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">🎉 You've Explored Everything!</h3>
            <p className="text-slate-600 leading-relaxed">
              You've reached the end of our search results. Try a new search to discover more amazing books!
            </p>
            <div className="mt-6 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;