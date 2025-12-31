import React, { useEffect, useRef, useState } from 'react';
import { fetchMovies } from '../api/tmdb';
import './MovieList.css';

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
};

interface MovieListProps {
  category: string;
  title: string;
}

export const MovieList: React.FC<MovieListProps> = ({ category, title }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);
  const scrollAmount = 300; // px

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchMovies(`/movie/${category}`)
      .then(data => {
        setMovies(data?.results || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load movies.');
        setLoading(false);
      });
  }, [category]);

  // Show arrows only if scrollable and not on mobile
  useEffect(() => {
    const handleResize = () => {
      if (!scrollRef.current) return;
      const isMobile = window.innerWidth <= 600;
      setShowArrows(!isMobile && scrollRef.current.scrollWidth > scrollRef.current.clientWidth + 10);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [movies]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="movie-list-container">
      <h2 className="movie-list-title">{title || 'Movies'}</h2>
      {loading ? (
        <div className="loading-message">Loading {title || 'Movies'}...</div>
      ) : error ? (
        <div className="error-message">Error loading {title || 'Movies'}: {error}</div>
      ) : (
        <>
          {showArrows && (
            <>
              <button
                aria-label="Scroll left"
                onClick={scrollLeft}
                className="scroll-button scroll-button-left"
              >
                &#8592;
              </button>
              <button
                aria-label="Scroll right"
                onClick={scrollRight}
                className="scroll-button scroll-button-right"
              >
                &#8594;
              </button>
            </>
          )}
          <div
            className={`hide-scroll scroll-container ${showArrows ? 'with-arrows' : ''}`}
            ref={scrollRef}
          >
            {Array.isArray(movies) && movies.length > 0 ? (
              movies.map(movie => (
                <div key={movie.id} className="movie-item">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkE0IiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4='}
                    alt={movie.title}
                    className="movie-poster"
                    loading="lazy"
                  />
                  <div className="movie-info">
                    <div>{movie.title}</div>
                    <div>{movie.release_date || 'N/A'}</div>
                    <div>⭐ {movie.vote_average || 'N/A'}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-movies-message">No movies found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
