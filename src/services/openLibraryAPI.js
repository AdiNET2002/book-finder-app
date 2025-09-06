const BASE_URL = 'https://openlibrary.org';

/**
 * API service for interacting with Open Library
 */
export const openLibraryAPI = {
  /**
   * Search for books by title, author, or general query
   * @param {string} query - The search query
   * @param {string} type - The search type ('title', 'author', or 'q' for general)
   * @param {number} page - The page number for pagination
   * @param {number} limit - Number of results per page
   * @returns {Promise<Object>} The search results
   */
  async searchBooks(query, type = 'q', page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit;
      let searchParam = '';
      
      switch (type) {
        case 'title':
          searchParam = `title=${encodeURIComponent(query)}`;
          break;
        case 'author':
          searchParam = `author=${encodeURIComponent(query)}`;
          break;
        default:
          searchParam = `q=${encodeURIComponent(query)}`;
      }
      
      const url = `${BASE_URL}/search.json?${searchParam}&limit=${limit}&offset=${offset}&fields=key,title,author_name,first_publish_year,cover_i,isbn,publisher,number_of_pages_median`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        books: data.docs || [],
        totalResults: data.numFound || 0,
        hasMore: data.docs && data.docs.length === limit
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('Failed to fetch books. Please try again.');
    }
  },

  /**
   * Get cover image URL for a book
   * @param {string} coverId - The cover ID from the API
   * @param {string} size - The size of the cover ('S', 'M', 'L')
   * @returns {string} The cover image URL
   */
  getCoverUrl(coverId, size = 'M') {
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  },

  /**
   * Get book details by key
   * @param {string} key - The book key from the API
   * @returns {Promise<Object>} The book details
   */
  async getBookDetails(key) {
    try {
      const response = await fetch(`${BASE_URL}${key}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw new Error('Failed to fetch book details. Please try again.');
    }
  }
};