import { openLibraryAPI } from '../services/openLibraryAPI';

/**
 * Premium book card with magazine-style design
 */
const BookCard = ({ book, onClick }) => {
  const {
    title,
    author_name,
    first_publish_year,
    cover_i
    // key is available but not used in this component
  } = book;

  const coverUrl = openLibraryAPI.getCoverUrl(cover_i, 'M');
  const authors = author_name ? author_name.join(', ') : 'Unknown Author';

  return (
    <div
      onClick={() => onClick(book)}
      className="group cursor-pointer fade-in-up"
    >
      <div className="card relative overflow-hidden">
        {/* Book Cover */}
        <div className="aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden rounded-t-2xl relative">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={`Cover of ${title}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Fallback Design */}
          <div
            className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 ${
              coverUrl ? 'hidden' : 'flex'
            }`}
          >
            <div className="text-center p-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <p className="text-slate-500 font-medium">No Cover Available</p>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center text-slate-700">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm font-semibold">View Details</span>
                </div>
              </div>
            </div>
          </div>

          {/* Publication Year Badge */}
          {first_publish_year && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-lg border border-white/50">
              {first_publish_year}
            </div>
          )}

          {/* Premium Badge */}
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
            📚 BOOK
          </div>
        </div>

        {/* Book Information */}
        <div className="p-6 bg-white/95 backdrop-blur-sm">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {title || 'Untitled'}
            </h3>
            
            <div className="flex items-center text-slate-600">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium line-clamp-1">
                {authors}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div className="flex items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                <span className="text-xs font-semibold tracking-wide uppercase">Read More</span>
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;