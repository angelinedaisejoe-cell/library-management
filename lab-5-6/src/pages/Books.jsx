import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import Search from '../components/Search';
import { fetchBooksBySubject } from '../services/api';

const SUBJECTS = ['All', 'Fiction', 'Science', 'History', 'Technology', 'Biography', 'Fantasy', 'Mystery'];

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Fiction');

  // Search states
  const [titleSearch, setTitleSearch] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // Fetch books whenever selected subject changes
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        setError('');
        const subject = selectedSubject === 'All' ? 'books' : selectedSubject;
        const data = await fetchBooksBySubject(subject, 24);
        setBooks(data);
      } catch (err) {
        setError('Failed to fetch books. Please check your internet connection and try again.');
        console.error('Books fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
  }, [selectedSubject]);

  // Dynamic filtering with all three search fields
  const filteredBooks = books.filter(book => {
    const titleMatch = book.title?.toLowerCase().includes(titleSearch.toLowerCase());
    const authorMatch = !authorSearch || book.author_name?.[0]?.toLowerCase().includes(authorSearch.toLowerCase());
    const catMatch = !categorySearch || book.subject?.some(s => s.toLowerCase().includes(categorySearch.toLowerCase()));
    return titleMatch && authorMatch && catMatch;
  });

  const hasActiveFilters = titleSearch || authorSearch || categorySearch;

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-primary-400 text-sm font-medium">📚 Open Library API</span>
          </div>
          <h1 className="section-title">Browse Books</h1>
          <p className="section-subtitle">Explore thousands of titles fetched live from Open Library</p>
        </div>

        {/* Subject Filter Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {SUBJECTS.map(subject => (
            <button
              key={subject}
              id={`subject-tab-${subject.toLowerCase()}`}
              onClick={() => {
                setSelectedSubject(subject);
                setTitleSearch('');
                setAuthorSearch('');
                setCategorySearch('');
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedSubject === subject
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white border border-white/10'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Search Filters */}
        <div className="card p-5 mb-8">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter Books
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Search
              id="search-by-title"
              value={titleSearch}
              onChange={setTitleSearch}
              placeholder="Search by title..."
            />
            <Search
              id="search-by-author"
              value={authorSearch}
              onChange={setAuthorSearch}
              placeholder="Search by author..."
            />
            <Search
              id="search-by-category"
              value={categorySearch}
              onChange={setCategorySearch}
              placeholder="Search by category..."
            />
          </div>
          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-3">
              <p className="text-gray-500 text-sm">
                Showing {filteredBooks.length} of {books.length} books
              </p>
              <button
                onClick={() => { setTitleSearch(''); setAuthorSearch(''); setCategorySearch(''); }}
                className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-14 h-14 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Fetching books from Open Library...</p>
            <p className="text-gray-600 text-xs mt-1">This may take a moment</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => setSelectedSubject(prev => prev)}
              className="btn-primary text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && filteredBooks.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg font-medium mb-2">No books found</p>
            <p className="text-gray-600 text-sm">Try adjusting your search filters</p>
            {hasActiveFilters && (
              <button
                onClick={() => { setTitleSearch(''); setAuthorSearch(''); setCategorySearch(''); }}
                className="mt-4 text-primary-400 hover:text-primary-300 text-sm transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && filteredBooks.length > 0 && (
          <>
            <p className="text-gray-600 text-sm mb-5">
              Showing {filteredBooks.length} results for "{selectedSubject}"
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {filteredBooks.map((book) => (
                <BookCard key={book.key} book={book} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Books;
