import { useState, useEffect, useCallback } from 'react';
import { openLibraryAPI } from '../services/openLibraryAPI';
import LoadingSpinner from './LoadingSpinner';

/**
 * Premium modal component with stunning glass morphism design
 */
const BookDetailModal = ({ book, isOpen, onClose }) => {
  const [bookDetails, setBookDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await openLibraryAPI.getBookDetails(book.key);
      setBookDetails(details);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [book?.key]);

  useEffect(() => {
    if (isOpen && book) {
      fetchBookDetails();
    }
  }, [isOpen, book, fetchBookDetails]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !book) return null;

  const coverUrl = openLibraryAPI.getCoverUrl(book.cover_i, 'L');
  const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
  const publishers = book.publisher ? book.publisher.join(', ') : 'Unknown Publisher';
  const isbns = book.isbn || [];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      {/* Premium Modal Container */}
      <div className="glass rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-premium border border-white/30 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl float"></div>
          <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl float" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Premium Header */}
        <div className="relative glass-dark border-b border-white/20 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Book Details</h2>
                <p className="text-white/70">Detailed information and insights</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 group"
            >
              <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Premium Content */}
        <div className="overflow-y-auto scrollbar-premium" style={{maxHeight: 'calc(95vh - 100px)'}}>
          {isLoading ? (
            <div className="p-16">
              <LoadingSpinner size="large" text="Loading book details..." />
            </div>
          ) : error ? (
            <div className="p-16 text-center">
              <div className="glass rounded-3xl p-12 max-w-lg mx-auto border border-red-200/20">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Unable to Load Details</h3>
                <p className="text-slate-600 mb-8 leading-relaxed">{error}</p>
                <button onClick={fetchBookDetails} className="btn-primary">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 lg:p-12">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Premium Book Cover */}
                <div className="flex-shrink-0 lg:w-96">
                  <div className="relative">
                    <div className="w-80 h-96 mx-auto lg:mx-0 glass rounded-3xl overflow-hidden shadow-premium border border-white/30">
                      {coverUrl ? (
                        <img
                          src={coverUrl}
                          alt={`Cover of ${book.title}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 ${coverUrl ? 'hidden' : 'flex'}`}>
                        <div className="text-center p-8">
                          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                            </svg>
                          </div>
                          <p className="text-xl text-slate-600 font-semibold">No Cover Available</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating decorative elements */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full pulse-glow"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400 rounded-full pulse-glow" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>

                {/* Premium Book Information */}
                <div className="flex-1 min-w-0 space-y-8">
                  {/* Title Section */}
                  <div className="space-y-4">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                      {book.title || 'Untitled'}
                    </h1>
                    <div className="flex items-center space-x-4">
                      <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200/50">
                        <span className="text-sm font-semibold text-blue-700">📚 PREMIUM BOOK</span>
                      </div>
                    </div>
                  </div>

                  {/* Information Cards Grid */}
                  <div className="grid gap-6">
                    {/* Author Card */}
                    <div className="card group">
                      <div className="card-content">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">Author(s)</h3>
                        </div>
                        <p className="text-lg text-slate-700 font-medium">{authors}</p>
                      </div>
                    </div>

                    {/* Publication & Pages Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {book.first_publish_year && (
                        <div className="card group">
                          <div className="card-content">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <h3 className="text-xl font-bold text-slate-900">Published</h3>
                            </div>
                            <p className="text-lg text-slate-700 font-bold">{book.first_publish_year}</p>
                          </div>
                        </div>
                      )}

                      {book.number_of_pages_median && (
                        <div className="card group">
                          <div className="card-content">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <h3 className="text-xl font-bold text-slate-900">Pages</h3>
                            </div>
                            <p className="text-lg text-slate-700 font-bold">{book.number_of_pages_median}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Publisher Card */}
                    <div className="card group">
                      <div className="card-content">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">Publisher(s)</h3>
                        </div>
                        <p className="text-lg text-slate-700 font-medium">{publishers}</p>
                      </div>
                    </div>

                    {/* ISBNs Card */}
                    {isbns.length > 0 && (
                      <div className="card group">
                        <div className="card-content">
                          <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">ISBN(s)</h3>
                          </div>
                          <div className="space-y-3">
                            {isbns.slice(0, 3).map((isbn, index) => (
                              <div key={index} className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200/50">
                                <code className="text-slate-700 font-semibold tracking-wider">{isbn}</code>
                              </div>
                            ))}
                            {isbns.length > 3 && (
                              <p className="text-orange-600 font-semibold">
                                +{isbns.length - 3} more ISBN{isbns.length - 3 !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Description Card */}
                    {bookDetails?.description && (
                      <div className="card group">
                        <div className="card-content">
                          <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Description</h3>
                          </div>
                          <p className="text-slate-700 leading-relaxed text-lg">
                            {typeof bookDetails.description === 'string' 
                              ? bookDetails.description 
                              : bookDetails.description.value || bookDetails.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;