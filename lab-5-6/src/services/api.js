import axios from 'axios';

// Axios instance pointing to Open Library API
const openLibraryAPI = axios.create({
  baseURL: 'https://openlibrary.org',
  timeout: 10000,
});

/**
 * Fetch books from Open Library by subject/query
 * @param {string} query - search term (e.g. 'fiction', 'science', 'history')
 * @param {number} limit - number of results
 */
export const fetchBooksBySubject = async (query = 'fiction', limit = 20) => {
  const response = await openLibraryAPI.get('/search.json', {
    params: {
      q: query,
      limit,
      fields: 'key,title,author_name,subject,cover_i,first_publish_year,ratings_average',
    },
  });
  return response.data.docs;
};

/**
 * Get cover image URL from Open Library cover ID
 * @param {number|string} coverId
 * @param {string} size - 'S', 'M', or 'L'
 */
export const getCoverUrl = (coverId, size = 'M') => {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

export default openLibraryAPI;
