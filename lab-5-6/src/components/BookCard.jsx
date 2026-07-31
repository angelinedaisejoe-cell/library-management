import { getCoverUrl } from '../services/api';

const StarRating = ({ rating }) => {
  const stars = Math.round(rating || 3.5);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3.5 h-3.5 ${star <= stars ? 'text-amber-400' : 'text-gray-600'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-gray-500 text-xs ml-1">({rating ? rating.toFixed(1) : 'N/A'})</span>
    </div>
  );
};

const BookCard = ({ book }) => {
  const coverUrl = getCoverUrl(book.cover_i, 'M');
  const author = book.author_name?.[0] || 'Unknown Author';
  const category = book.subject?.[0] || 'General';
  const year = book.first_publish_year || '';

  return (
    <div className="card group cursor-pointer hover:border-primary-500/40 hover:shadow-2xl hover:shadow-primary-600/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
      {/* Cover Image */}
      <div className="relative h-56 bg-dark-800 overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        {/* Fallback placeholder */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary-900/50 to-dark-800 ${coverUrl ? 'hidden' : 'flex'}`}
          style={{ display: coverUrl ? 'none' : 'flex' }}
        >
          <div className="text-5xl mb-2">📖</div>
          <span className="text-gray-500 text-xs text-center px-4">{book.title}</span>
        </div>

        {/* Year badge */}
        {year && (
          <div className="absolute top-3 right-3 bg-dark-900/80 backdrop-blur-sm text-gray-300 text-xs px-2 py-1 rounded-lg border border-white/10">
            {year}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-dark-700 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category tag */}
        <div className="mb-2">
          <span className="text-xs bg-primary-600/20 text-primary-300 px-2.5 py-1 rounded-full border border-primary-500/20 font-medium">
            {category.length > 25 ? category.slice(0, 25) + '...' : category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary-300 transition-colors">
          {book.title}
        </h3>

        {/* Author */}
        <p className="text-gray-500 text-xs mb-3 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {author}
        </p>

        {/* Rating */}
        <div className="mt-auto">
          <StarRating rating={book.ratings_average} />
        </div>
      </div>
    </div>
  );
};

export default BookCard;
