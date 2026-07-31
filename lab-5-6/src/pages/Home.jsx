import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Search from '../components/Search';
import BookCard from '../components/BookCard';
import Footer from '../components/Footer';
import { fetchBooksBySubject } from '../services/api';

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch featured books on mount
  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        setLoading(true);
        setError('');
        const books = await fetchBooksBySubject('fiction', 8);
        setFeaturedBooks(books);
      } catch (err) {
        setError('Failed to load featured books. Please check your connection.');
        console.error('Featured books fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedBooks();
  }, []);

  // Filter books based on search query
  const filteredBooks = featuredBooks.filter(book => {
    const q = searchQuery.toLowerCase();
    return (
      book.title?.toLowerCase().includes(q) ||
      book.author_name?.[0]?.toLowerCase().includes(q) ||
      book.subject?.[0]?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <Hero />

      {/* Featured Books Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-600/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-primary-400 text-sm font-medium">📚 Curated Picks</span>
          </div>
          <h2 className="section-title">Featured Books</h2>
          <p className="section-subtitle">Discover our hand-picked selection from top fiction titles</p>

          {/* Search bar */}
          <div className="max-w-lg mx-auto mt-6">
            <Search
              id="home-search"
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search featured books..."
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading featured books...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">😕</div>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary text-sm py-2 px-5"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty search result */}
        {!loading && !error && filteredBooks.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-500">No books match "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="text-primary-400 text-sm mt-2 hover:underline">
              Clear search
            </button>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filteredBooks.map((book) => (
              <BookCard key={book.key} book={book} />
            ))}
          </div>
        )}

        {/* View All Button */}
        {!loading && !error && (
          <div className="text-center mt-12">
            <Link to="/books" id="view-all-books-btn" className="btn-primary inline-block">
              View All Books →
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Why LibraVault?</h2>
            <p className="section-subtitle">Everything you need in one place</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🔍',
                title: 'Smart Search',
                desc: 'Find books by title, author, or category with instant filtering.',
              },
              {
                icon: '👥',
                title: 'Member Management',
                desc: 'Register members, view profiles, and manage memberships effortlessly.',
              },
              {
                icon: '📡',
                title: 'Live API Data',
                desc: 'Real-time book data powered by Open Library — always up to date.',
              },
            ].map((feature) => (
              <div key={feature.title} className="card p-6 hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
